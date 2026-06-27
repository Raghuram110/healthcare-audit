from pydantic import BaseModel
from typing import List, Literal, Optional

class BillingFlag(BaseModel):
    line_item: str
    billed_amount: float
    reference_amount: Optional[float] = None
    flag_type: Literal["duplicate", "inflated", "negotiable", "unauthorised", "unbundled", "ok"]
    excess_amount: float = 0.0
    plain_explanation: str
    action: str

class BillingAuditResult(BaseModel):
    total_billed: float
    estimated_fair_amount: float
    total_potential_savings: float
    flags: List[BillingFlag]
    summary_for_patient: str