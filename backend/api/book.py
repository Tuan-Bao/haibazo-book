from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.book import Book as BookModel
from schemas.book import Book, BookCreate, BookUpdate, BookResponse

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/", response_model=BookResponse)
def get_books(
    page: int = Query(1, ge=1), 
    size: int = Query(10, ge=1, le=100), 
    db: Session = Depends(get_db)
):
    offset = (page - 1) * size
    total = db.query(BookModel).count()
    books = db.query(BookModel).options(joinedload(BookModel.author)).offset(offset).limit(size).all()
    return BookResponse(items=books, total=total, page=page, size=size)

@router.post("/", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(
    book: BookCreate, 
    db: Session = Depends(get_db)
):
    new_book = BookModel(title=book.title, author_id=book.author_id)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.patch("/{book_id}", response_model=Book)
def update_book(
    book_id: int,
    book: BookUpdate,
    db: Session = Depends(get_db)
):
    existing_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not existing_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    if book.title is not None:
        existing_book.title = book.title
    db.commit()
    db.refresh(existing_book)
    return existing_book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    existing_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not existing_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    db.delete(existing_book)
    db.commit()
    return {"message": "Book deleted successfully"}