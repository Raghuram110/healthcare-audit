import fitz

def parse_pdf(file_path: str) -> dict:
    doc = fitz.open(file_path)
    pages = []
    for page in doc:
        text = page.get_text("text")
        pages.append({"text": text})
    full_text = " ".join(p["text"] for p in pages)
    doc.close()
    return {"type": "pdf", "pages": pages, "full_text": full_text}