from typing import TypedDict, Optional, List

class AuditState(TypedDict):
    uploaded_files: List[str]
    doc_type_map: dict
    parsed_docs: dict
    hospital_bill_data: Optional[dict]
    insurance_policy_text: Optional[str]
    discharge_summary_text: Optional[str]
    prescription_text: Optional[str]
    lab_report_text: Optional[str]
    pharmacy_bill_data: Optional[dict]
    billing_result: Optional[dict]
    insurance_result: Optional[dict]
    claim_guide: Optional[str]
    dispute_letter: Optional[str]
    errors: List[str]