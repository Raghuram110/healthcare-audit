from .state import AuditState
from .llm import get_llm
from ..models.billing import BillingAuditResult
from langchain_core.prompts import ChatPromptTemplate

BILLING_PROMPT = """
You are a hospital billing auditor in India.
Analyse this hospital bill carefully and detect:
1. Duplicate charges - same item billed twice
2. Inflated charges - price much higher than normal
3. Unbundled charges - one procedure split into many items
4. Unauthorised charges - items not in discharge summary
5. Negotiable items - admin fees that can be waived

Hospital bill text:
{bill_text}

Discharge summary:
{discharge_text}

Return a detailed audit with plain language explanations a patient can understand.
For each flagged item explain exactly why it is suspicious and what the patient should do.
"""

def billing_node(state: AuditState) -> AuditState:
    try:
        llm = get_llm().with_structured_output(BillingAuditResult)
        prompt = ChatPromptTemplate.from_template(BILLING_PROMPT)
        chain = prompt | llm

        bill_text = ""
        discharge_text = ""

        for path, doc in state.get("parsed_docs", {}).items():
            text = doc.get("full_text", "")
            if "bill" in path.lower() or "invoice" in path.lower():
                bill_text = text
            elif "discharge" in path.lower():
                discharge_text = text

        if not bill_text:
            bill_text = "No bill uploaded"

        result = chain.invoke({
            "bill_text": bill_text,
            "discharge_text": discharge_text or "Not provided"
        })
        state["billing_result"] = result.dict()
    except Exception as e:
        state["errors"].append(f"Billing error: {str(e)}")
    return state