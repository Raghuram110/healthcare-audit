from langgraph.graph import StateGraph, END
from .state import AuditState
from .parser_node import parser_node
from .billing_node import billing_node
from .insurance_node import insurance_node
from .claim_node import claim_node

def build_graph():
    graph = StateGraph(AuditState)

    graph.add_node("parser", parser_node)
    graph.add_node("billing", billing_node)
    graph.add_node("insurance", insurance_node)
    graph.add_node("claim", claim_node)

    graph.set_entry_point("parser")
    graph.add_edge("parser", "billing")
    graph.add_edge("billing", "insurance")
    graph.add_edge("insurance", "claim")
    graph.add_edge("claim", END)

    return graph.compile()

audit_graph = build_graph()