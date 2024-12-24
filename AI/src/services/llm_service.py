# src/services/llm_service.py
import pytesseract
from PIL import Image
from PyPDF2 import PdfReader

class LLMService:
    def __init__(self):
        # Initialize any necessary resources, models, or configurations here
        pass

    def generate_response(self, text=None, image_path=None, pdf_path=None):
        """
        Generate a response based on the inputs provided.
        This is a functional implementation that extracts text from images and PDFs,
        and processes the provided text input.
        
        Args:
            text (str): Text input.
            image_path (str): Path to the uploaded image file.
            pdf_path (str): Path to the uploaded PDF file.
        
        Returns:
            dict: A dictionary containing the generated responses.
        """
        response = {}

        if text:
            response['text_analysis'] = self.process_text(text)

        if image_path:
            response['image_analysis'] = self.process_image(image_path)

        if pdf_path:
            response['pdf_analysis'] = self.process_pdf(pdf_path)

        return response

    def process_text(self, text):
        """
        Simple text processing.
        
        Args:
            text (str): Input text.
        
        Returns:
            str: Processed text.
        """
        return f"You entered: {text}"

    def process_image(self, image_path):
        """
        Extract text from an image file using OCR.
        
        Args:
            image_path (str): Path to the image file.
        
        Returns:
            str: Extracted text from the image.
        """
        try:
            image = Image.open(image_path)
            extracted_text = pytesseract.image_to_string(image)
            return f"Extracted text from image: {extracted_text.strip()}"
        except Exception as e:
            return f"Error processing image: {str(e)}"

    def process_pdf(self, pdf_path):
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path (str): Path to the PDF file.
        
        Returns:
            str: Extracted text from the PDF.
        """
        try:
            reader = PdfReader(pdf_path)
            extracted_text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
            return f"Extracted text from PDF: {extracted_text.strip()}"
        except Exception as e:
            return f"Error processing PDF: {str(e)}"
