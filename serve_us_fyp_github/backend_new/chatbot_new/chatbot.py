from sentence_transformers import SentenceTransformer
import numpy as np
from llama_cpp import Llama
import pickle


KB_FILENAME = "knowledge_base_latest.pkl"
LLAMA_MODEL_PATH = "/content/drive/MyDrive/llamaModel/llama-2-7b.Q4_K_M.gguf"

embedder = SentenceTransformer('all-MiniLM-L6-v2')
llama = Llama(model_path=LLAMA_MODEL_PATH, n_ctx=2048)

def load_knowledge_base(filename=KB_FILENAME):
    with open(filename, "rb") as f:
        data = pickle.load(f)
    return data["chunks"], data["embeddings"]

chunks, chunk_embeddings = load_knowledge_base()

def find_similar_chunk(question, chunks, chunk_embeddings, model, top_k=1):
    q_emb = model.encode([question])[0]
    sims = np.dot(chunk_embeddings, q_emb) / (
        np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(q_emb)
    )
    top_k_idx = sims.argsort()[-top_k:][::-1]
    return "\n\n".join([chunks[i] for i in top_k_idx])


def chat():
    chunks, chunk_embeddings = load_knowledge_base(fileName=KB_FILENAME)
    print("Chatbot ready! Ask questions about the PDF.")
    while True:
        question = input("You: ")
        if question.lower() in ['exit', 'quit']:
            break
        context = find_similar_chunk(question, chunks, chunk_embeddings, embedder)
        prompt = f"Context: {context}\n\nQuestion: {question}\nAnswer:"
        output = llama(prompt, max_tokens=256, stop=["\n"])
        print("Bot:", output['choices'][0]['text'].strip())
    

