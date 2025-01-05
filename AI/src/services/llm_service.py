from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import os

class LLMService:
    def __init__(self):
        local_model_dir = 'distilgpt2'

        # Load tokenizer with specific settings
        self.tokenizer = AutoTokenizer.from_pretrained(
            local_model_dir,
            trust_remote_code=True,
            padding_side="left"
        )

        # Model loading with optimizations
        self.model = AutoModelForCausalLM.from_pretrained(
            local_model_dir,
            device_map="cpu",
            torch_dtype=torch.float32,
            trust_remote_code=True,
            low_cpu_mem_usage=True
        )

        # Configured for more controlled, professional responses
        self.pipeline = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=300,
            temperature=0.1,        # More focused responses
            top_p=0.9,
            repetition_penalty=1.2,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id
        )

        # Professional medical disclaimer
        self.disclaimer = ("\n\nNOTE: This is general medical information. For specific medical advice, "
                         "please schedule an appointment through the system. In case of severe symptoms "
                         "or emergency, seek immediate medical care.")

        # Emergency keywords for special handling
        self.emergency_keywords = [
            "severe", "extreme", "intense", "unbearable", "worst",
            "chest pain", "breathing", "unconscious", "stroke", "heart attack"
        ]

    def _detect_emergency(self, text):
        """Check if the query indicates a potential emergency."""
        return any(keyword in text.lower() for keyword in self.emergency_keywords)

    def _create_medical_prompt(self, text):
        """Create a professionally structured medical prompt."""
        base_prompt = f"""[System]
You are a medical professional providing healthcare guidance through a hospital management system.
Respond with clear, specific medical information relevant to the patient's concern.
Focus only on the presenting complaint and provide structured, actionable advice.

Format your response as follows:
1. Assessment of the condition
2. Specific recommendations
3. Warning signs to watch for
4. When to seek immediate care

Maintain a professional, clinical tone throughout.

[User Concern]
{text}

[Clinical Response]"""

        if self._detect_emergency(text):
            base_prompt += "\nNOTE: This appears to be an urgent medical concern. Prioritize emergency care guidance."

        return base_prompt

    def _clean_response(self, text):
        """Clean and structure the response professionally."""
        # Extract the main response
        if "[Clinical Response]" in text:
            text = text.split("[Clinical Response]")[-1].strip()
        
        # Remove any system markers
        text = text.replace("[System]", "").replace("[User Concern]", "").strip()
        
        # Clean up formatting and structure
        import re
        
        # Remove non-medical technical terms
        text = re.sub(r'(?i)\b(call|email|support|team|version)\b.*?[\.\n]', '', text)
        
        # Improve formatting of lists and points
        text = re.sub(r'(\d+[\).])', r'\n\1', text)
        text = re.sub(r'\n\s*\n', '\n', text)
        
        # Ensure professional medical terminology
        text = text.replace("gonna", "going to")
        text = text.replace("wanna", "want to")
        text = re.sub(r'(!+)', '.', text)  # Replace multiple exclamation marks
        
        # Clean up spacing
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Add emergency warning if detected
        if self._detect_emergency(text):
            text = "ATTENTION: Your symptoms may require immediate medical attention. " + text
        
        return text + self.disclaimer

    def _filter_inappropriate(self, text):
        """Filter inappropriate or harmful requests."""
        harmful_keywords = ["bomb", "weapon", "suicide", "kill", "death", "harmful"]
        if any(keyword in text.lower() for keyword in harmful_keywords):
            return True
        return False

    def generate_response(self, text):
        """Generate a professional medical response."""
        try:
            # Check for inappropriate content
            if self._filter_inappropriate(text):
                return ("I apologize, but I cannot provide information about harmful or dangerous topics. "
                       "If you're experiencing a crisis, please seek immediate professional help.")

            # Generate the response
            prompt = self._create_medical_prompt(text)
            outputs = self.pipeline(
                prompt,
                num_return_sequences=1,
                truncation=True,
                max_length=128
            )
            
            response = self._clean_response(outputs[0]['generated_text'])
            return response
            
        except Exception as e:
            return ("Our system is currently unable to process your request. If you have "
                   "urgent medical concerns, please seek immediate medical attention.")
