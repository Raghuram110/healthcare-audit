import easyocr

reader = easyocr.Reader(['en'])

def parse_image(file_path: str) -> dict:
    result = reader.readtext(file_path)
    text = " ".join([item[1] for item in result])
    return {"type": "image_ocr", "full_text": text}