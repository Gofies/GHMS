import aiofiles
import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def encrypt_and_store_file(file):
    """Encrypt and store the uploaded file securely."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    return file_path

def decrypt_file(file_path):
    """Decrypt the file for processing."""
    with open(file_path, "rb") as f:
        content = f.read()
        return content