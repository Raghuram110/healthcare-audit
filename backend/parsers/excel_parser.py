import pandas as pd

def parse_excel(file_path: str) -> dict:
    df = pd.read_excel(file_path)
    return {
        "type": "excel",
        "columns": df.columns.tolist(),
        "rows": df.to_dict(orient="records"),
        "full_text": df.to_string()
    }