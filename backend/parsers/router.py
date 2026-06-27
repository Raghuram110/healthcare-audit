import os

def route_and_parse(file_path: str) -> dict:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        from .pdf_parser import parse_pdf
        return parse_pdf(file_path)
    elif ext in [".jpg", ".jpeg", ".png", ".tiff"]:
        from .ocr_parser import parse_image
        return parse_image(file_path)
    elif ext in [".xlsx", ".xls", ".csv"]:
        from .excel_parser import parse_excel
        return parse_excel(file_path)
    elif ext in [".docx", ".doc"]:
        from .word_parser import parse_word
        return parse_word(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")