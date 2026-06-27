import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = os.getenv("CHROMA_DIR", "./data/chroma")

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

def embed_policy(policy_text: str, collection: str = "insurance"):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=50
    )
    chunks = splitter.split_text(policy_text)
    vectorstore = Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        collection_name=collection,
        persist_directory=CHROMA_DIR
    )
    return vectorstore

def get_vectorstore(collection: str = "insurance"):
    return Chroma(
        collection_name=collection,
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )