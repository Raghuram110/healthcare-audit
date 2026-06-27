from .state import AuditState
from ..parsers.router import route_and_parse

def parser_node(state: AuditState) -> AuditState:
    parsed = {}
    for file_path in state["uploaded_files"]:
        try:
            result = route_and_parse(file_path)
            parsed[file_path] = result
        except Exception as e:
            state["errors"].append(f"Parse error: {str(e)}")
    state["parsed_docs"] = parsed
    return state