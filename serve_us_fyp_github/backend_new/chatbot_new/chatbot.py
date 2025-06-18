# import PyPDF2
# from sentence_transformers import SentenceTransformer
# import numpy as np
# from llama_cpp import Llama

# # 1. Extract text from PDF
# def extract_pdf_text(pdf_path):
#     with open(pdf_path, 'rb') as f:
#         reader = PyPDF2.PdfReader(f)
#         text = ""
#         for page in reader.pages:
#             text += page.extract_text() + "\n"
#     return text

# # 2. Split text into chunks
# def chunk_text(text, chunk_size=500):
#     words = text.split()
#     return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# # 3. Embed chunks
# def embed_chunks(chunks, model):
#     return model.encode(chunks)

# # 4. Find most similar chunk
# def find_similar_chunk(question, chunks, chunk_embeddings, model):
#     q_emb = model.encode([question])[0]
#     sims = np.dot(chunk_embeddings, q_emb) / (np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(q_emb))
#     idx = np.argmax(sims)
#     return chunks[idx]

# # 5. Chatbot loop
# def chatbot(pdf_path, llama_model_path):
#     # Load models
#     embedder = SentenceTransformer('all-MiniLM-L6-v2')
#     llama = Llama(model_path=llama_model_path, n_ctx=2048)
#     # Prepare knowledge base
#     text = extract_pdf_text(pdf_path)
#     chunks = chunk_text(text)
#     chunk_embeddings = embed_chunks(chunks, embedder)
#     print("Chatbot ready! Ask questions about the PDF.")
#     while True:
#         question = input("You: ")
#         if question.lower() in ['exit', 'quit']:
#             break
#         context = find_similar_chunk(question, chunks, chunk_embeddings, embedder)
#         prompt = f"Context: {context}\n\nQuestion: {question}\nAnswer:"
#         output = llama(prompt, max_tokens=256, stop=["\n"])
#         print("Bot:", output['choices'][0]['text'].strip())

# # Example usage:
# # chatbot("yourfile.pdf", "llama-2-7b.Q4_K_M.gguf")




from sentence_transformers import SentenceTransformer
import numpy as np
from llama_cpp import Llama
import pickle





KB_FILENAME = "knowledge_base.pkl"
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
    

