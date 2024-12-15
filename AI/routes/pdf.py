from fastapi import APIRouter, UploadFile, HTTPException, File
from fastapi.responses import JSONResponse
from utils.file_handler import encrypt_and_store_file
from utils.model_loader import load_generative_pipeline
import logging
import os
import pdfplumber

pdf_router = APIRouter()

# Initialize model
gen_pipeline = load_generative_pipeline()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_pdf(file_path):
    """
    Extracts text from a PDF file.

    Args:
        file_path (str): Path to the PDF file.

    Returns:
        str: Extracted text.
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            all_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text.append(text.strip())
            return "\n".join(all_text)
    except Exception as e:
        logging.error("Failed to extract text from the PDF.", exc_info=e)
        raise RuntimeError("Error extracting text from PDF.")


@pdf_router.post("/analyze_report")
async def analyze_report(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF reports are supported.")

    file_path = await encrypt_and_store_file(file, UPLOAD_DIR)

    try:
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_path)

        # Construct the analysis prompt
        dynamic_prompt = f"""
        You are a professional medical report analyzer. You have been provided the following report:
        {extracted_text}

        Your task:
        1. Summarize the medical findings in the report.
        2. Identify any potential medical conditions or risks based on the report.
        3. Suggest actionable next steps, such as further tests or consultations.

        Provide your response in a clear, professional tone.
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
        logging.error("Failed to process uploaded report", exc_info=e)
        raise HTTPException(status_code=500, detail="Error processing report.")
    finally:
        os.remove(file_path)
