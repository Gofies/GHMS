from transformers import pipeline
import torchxrayvision as xrv
import torchvision.transforms as transforms
from ..main import logging

def load_generative_pipeline():
    """Loads a generative medical NLP pipeline with specialized medical knowledge."""
    try:
        logging.info("Loading specialized medical NLP pipeline...")
        gen_pipeline = pipeline("text-generation", model="microsoft/BioGPT-Large")
        logging.info("Specialized medical NLP pipeline loaded successfully.")
        return gen_pipeline
    except Exception as e:
        logging.error("Failed to load the specialized medical NLP pipeline.", exc_info=e)
        raise RuntimeError("Error initializing generative NLP pipeline.")

def load_image_model():
    """Loads a medical image analysis model."""
    try:
        logging.info("Loading medical image analysis model...")
        
        # Example: Load a chest X-ray model from torchxrayvision
        model = xrv.models.DenseNet(weights="densenet121-res224-all")
        model.eval()  # Set the model to evaluation mode
        
        # Define image preprocessing pipeline for RGB input
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.Grayscale(num_output_channels=3),  # Convert grayscale to 3 channels (RGB)
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # Typical ImageNet normalization
        ])
        
        logging.info("Medical image analysis model loaded successfully.")
        return {"model": model, "transform": transform}
    except Exception as e:
        logging.error("Failed to load the medical image analysis model.", exc_info=e)
        raise RuntimeError("Error initializing image model.")