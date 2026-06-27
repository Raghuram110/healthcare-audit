from .state import AuditState
from ..rag.policy_rag import check_coverage

REQUIRED_DOCS = [
    "Discharge summary",
    "Doctor prescription",
    "Original hospital bill",
    "Lab reports",
    "Claim form",
    "Photo ID proof",
    "Policy document"
]

def insurance_node(state: AuditState) -> AuditState:
    try:
        billing = state.get("billing_result") or {}
        flags = billing.get("flags", [])

        coverage_results = []
        for flag in flags:
            if flag.get("flag_type") != "ok":
                result = check_coverage(
                    charge=flag.get("line_item", ""),
                )
                coverage_results.append({
                    "item": flag.get("line_item"),
                    "coverage": result
                })

        uploaded = list(state.get("doc_type_map", {}).keys())
        missing = []
        for doc in REQUIRED_DOCS:
            found = any(doc.lower() in u.lower() for u in uploaded)
            if not found:
                missing.append(doc)

        state["insurance_result"] = {
            "coverage_results": coverage_results,
            "missing_documents": missing
        }
    except Exception as e:
        state["errors"].append(f"Insurance error: {str(e)}")
    return state