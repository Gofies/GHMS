from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Load LLM model (e.g., Hugging Face model)
chatbot = pipeline('text-generation', model='gpt2')

@app.post("/chat")
async def chat_with_ai(patient_query: str):
    response = chatbot(patient_query)
    return {"response": response[0]['generated_text']}



#how frontend will communicate with backend?
'''
// Example Express backend interaction with AI service

const axios = require('axios');

app.post('/api/patient-chat', async (req, res) => {
    const { patientQuery } = req.body;
    
    try {
        const aiResponse = await axios.post('http://ai-service:8000/chat', { patientQuery });
        res.json({ aiResponse: aiResponse.data.response });
    } catch (error) {
        res.status(500).send("Error communicating with AI service");
    }
});


'''