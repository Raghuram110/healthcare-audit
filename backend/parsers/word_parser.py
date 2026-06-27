from docx import Document

def parse_word(file_path: str) -> dict:
    doc = Document(file_path)
    text = "\n".join([p.text for p in doc.paragraphs])
    return {"type": "word", "full_text": text}