import pandas as pd

def detect_duplicates(bill_rows: list) -> list:
    if not bill_rows:
        return []
    df = pd.DataFrame(bill_rows)
    flags = []
    required = {"description", "amount"}
    if not required.issubset(set(df.columns)):
        return []
    duplicates = df[df.duplicated(subset=["description", "amount"], keep=False)]
    for _, row in duplicates.iterrows():
        flags.append({
            "line_item": row.get("description", ""),
            "billed_amount": float(row.get("amount", 0)),
            "flag_type": "duplicate",
            "excess_amount": float(row.get("amount", 0)),
            "plain_explanation": f"'{row.get('description','')}' appears to be charged more than once.",
            "action": "Ask the hospital to remove the duplicate charge."
        })
    return flags