from fastapi import APIRouter, UploadFile, HTTPException, File
from fastapi.responses import JSONResponse
from utils.file_handler import encrypt_and_store_file
from utils.model_loader import load_image_model
import logging
import os
from PIL import Image
import torch
from transformers import pipeline


image_router = APIRouter()

# Load the image analysis model
image_model = load_image_model()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def interpret_predictions(predictions, model_results_summary=None):
    """
    Allows the LLM to freely analyze model results and provide a diagnosis.

    Args:
        predictions (torch.Tensor): Model predictions in raw numerical format.
        model_results_summary (str): Human-readable summary of the raw predictions, if preprocessed.

    Returns:
        str: LLM-generated diagnosis and recommendations.
    """
    # Convert predictions into a string summary for the LLM
    if model_results_summary is None:
        # Convert raw predictions into a general format (e.g., string of probabilities or logits)
        probabilities = torch.sigmoid(predictions[0]).cpu().numpy()
        model_results_summary = ", ".join(
            [f"Class {i}: {prob:.2%}" for i, prob in enumerate(probabilities)]
        )

    # Construct a dynamic prompt for the LLM
    prompt = f"""
    You are a highly skilled medical professional and diagnostician.

    The system has analyzed a medical scan and provided the following raw results:
    {model_results_summary}

    Task:
    1. Interpret these results and identify potential medical issues.
    2. Explain your reasoning and how the results relate to your diagnosis.
    3. Suggest next steps, including any recommended tests, specialist consultations, or treatments.

    Provide your response in a professional, clear, and patient-friendly tone.
    """

    # Use the LLM to generate a diagnosis
    response = gen_pipeline(
        prompt,
        max_length=700,
        num_return_sequences=1
    )[0]["generated_text"]

    return response.strip()


def process_image(file_path):
    """
    Processes the uploaded medical image using a preloaded model.

    Args:
        file_path (str): Path to the image file.

    Returns:
        str: Model's raw predictions in human-readable form.
    """
    # Load the image model and its transformation
    image_model = load_image_model()
    transform = image_model["transform"]

    # Load and preprocess the image
    image = Image.open(file_path).convert("L")  # Convert to grayscale if necessary
    input_tensor = transform(image).unsqueeze(0)  # Add batch dimension

    # Perform inference
    with torch.no_grad():
        predictions = image_model["model"](input_tensor)

    # Interpret predictions (convert logits/probabilities into meaningful text)
    return interpret_predictions(predictions)

def gen_pipeline():
    """
    Loads a generative medical NLP pipeline.

    Returns:
        function: A callable pipeline object for text generation.
    """
    try:
        logging.info("Loading specialized medical NLP pipeline...")
        gen_pipeline = pipeline("text-generation", model="microsoft/BioGPT-Large")  # Example: BioGPT
        logging.info("Generative medical NLP pipeline loaded successfully.")
        return gen_pipeline
    except Exception as e:
        logging.error("Failed to load the generative NLP pipeline.", exc_info=e)
        raise RuntimeError("Error initializing generative NLP pipeline.")


@image_router.post("/analyze_scan")
async def analyze_scan(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only medical images are supported.")

    file_path = await encrypt_and_store_file(file, UPLOAD_DIR)

    try:
        # Preprocess the image and run it through the image model
        predictions = process_image(file_path)  # Assuming this returns human-readable model outputs

        # Construct the analysis prompt
        dynamic_prompt = f"""
        You are a medical imaging specialist. The system has analyzed an image scan and found the following results:
        {predictions}

        Your task:
        1. Interpret the model's findings in terms of potential conditions or issues.
        2. Explain the findings in a clear and professional way.
        3. Suggest next steps for further diagnostic testing or medical action.
        """

        # Generate the response
        response = gen_pipeline(
            dynamic_prompt,
            max_length=700,
            num_return_sequences=1
        )[0]["generated_text"]

        formatted_response = response.strip()

        return JSONResponse(content={"response": formatted_response})
    except Exception as e:
        logging.error("Failed to process uploaded scan", exc_info=e)
        raise HTTPException(status_code=500, detail="Error processing scan.")
    finally:
        os.remove(file_path)
