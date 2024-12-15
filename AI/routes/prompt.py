from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.model_loader import load_generative_pipeline
from ..main import logging

prompt_router = APIRouter()

# Initialize model
gen_pipeline = load_generative_pipeline()

class AnalysisRequest(BaseModel):
    prompt: str

@prompt_router.post("/general_prompt")
async def general_prompt(request: AnalysisRequest):
    try:
        # Construct a dynamic prompt to guide the model
        dynamic_prompt = f"""
        You are a highly experienced medical professional and diagnostician.
        The patient has provided the following input: "{request.prompt}"
        
        Your task:
        1. Identify potential medical conditions or issues based on the provided input.
        2. Provide a brief explanation for each identified condition.
        3. Suggest actionable next steps, including tests, consultations, or immediate actions.

        Please respond in a professional tone as a trusted medical expert.
        """
        
        # Generate the response
        generated_response = gen_pipeline(
            dynamic_prompt,
            max_length=500,
            num_return_sequences=1
        )[0]["generated_text"]

        # Ensure clean formatting
        formatted_response = generated_response.strip()

        return JSONResponse(content={"response": formatted_response})
    except Exception as e:
        logging.error("Failed to process general prompt", exc_info=e)
        raise HTTPException(status_code=500, detail="Error generating response.")