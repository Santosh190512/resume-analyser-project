import pdfplumber
import docx


def extract_text(file_path):
    text = ""
    lower_path = file_path.lower()

    if lower_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
                text += "\n"
    elif lower_path.endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        raise ValueError("Only PDF and DOCX resume files are supported.")

    return text.strip()
