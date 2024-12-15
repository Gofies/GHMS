from fastapi import FastAPI
from dotenv import load_dotenv
from routes.health import health_router
from routes.image import image_router
from routes.pdf import pdf_router
from routes.prompt import prompt_router
import logging


load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = FastAPI()

# Include routes
app.include_router(health_router, prefix="/llm")
app.include_router(image_router, prefix="/llm")
app.include_router(pdf_router, prefix="/llm")
app.include_router(prompt_router, prefix="/llm")