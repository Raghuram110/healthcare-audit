import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.embeddings import FakeEmbeddings
from langchain_community.vectorstores import Chroma
from ..agents.llm import get_llm
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = os.getenv("CHROMA_DIR", "./data/chroma")

embeddings = FakeEmbeddings(size=384)

def get_vectorstore():
    return Chroma(
        collection_name="insurance",
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )

INSURANCE_PROMPT = """
You are an insurance claim expert in India.
Based on these policy clauses, determine if this charge is covered.

Policy clauses:
{context}

Hospital charge: {charge}
Patient admission date: {admission_date}
Policy start date: {policy_start}

Answer clearly:
- Covered: yes / no / partial
- Reason (mention the clause)
- Deductible or copay amount if any
- Any waiting period issue
"""

def check_coverage(charge: str, admission_date: str = "unknown", policy_start: str = "unknown") -> str:
    try:
        vs = get_vectorstore()
        docs = vs.similarity_search(charge, k=4)
        context = "\n".join([d.page_content for d in docs])
        if not context.strip():
            return "No policy document found. Please upload your insurance policy."
        llm = get_llm()
        prompt = ChatPromptTemplate.from_template(INSURANCE_PROMPT)
        chain = prompt | llm
        result = chain.invoke({
            "context": context,
            "charge": charge,
            "admission_date": admission_date,
            "policy_start": policy_start
        })
        return result.content
    except Exception as e:
        return f"Coverage check error: {str(e)}"