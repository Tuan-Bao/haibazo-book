from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from api import author_router, book_router, review_router

app = FastAPI(
    title="Haibazo Book API",
    description="API for managing authors, books, and reviews in the Haibazo Book application.",
    version="1.0.0",
)


frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
origins = [frontend_origin] if frontend_origin != '*' else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(author_router)
app.include_router(book_router)
app.include_router(review_router)

@app.get("/", tags=["Health Check"])
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)