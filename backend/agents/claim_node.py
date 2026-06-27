from .state import AuditState
from .llm import get_llm
from langchain_core.prompts import ChatPromptTemplate

CLAIM_PROMPT = """
You are a patient advocate helping someone file an insurance claim in India.

Based on this billing audit and insurance analysis, do two things:

1. Write a step-by-step claim filing guide in simple language
2. Write a formal dispute letter for the overcharged items

Billing audit result:
{billing_result}

Insurance analysis:
{insurance_result}

Format your response as:

CLAIM GUIDE:
Step 1: ...
Step 2: ...
(continue all steps)

DISPUTE LETTER:
[Formal letter disputing the flagged charges with specific amounts]
"""

def claim_node(state: AuditState) -> AuditState:
    try:
        llm = get_llm()
        prompt = ChatPromptTemplate.from_template(CLAIM_PROMPT)
        chain = prompt | llm

        result = chain.invoke({
            "billing_result": str(state.get("billing_result", "No billing result")),
            "insurance_result": str(state.get("insurance_result", "No insurance result"))
        })

        full_text = result.content
        if "DISPUTE LETTER:" in full_text:
            parts = full_text.split("DISPUTE LETTER:")
            state["claim_guide"] = parts[0].replace("CLAIM GUIDE:", "").strip()
            state["dispute_letter"] = parts[1].strip()
        else:
            state["claim_guide"] = full_text
            state["dispute_letter"] = ""

    except Exception as e:
        state["errors"].append(f"Claim error: {str(e)}")
    return state