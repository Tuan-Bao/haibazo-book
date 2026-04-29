from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.author import Author as AuthorModel
from models.book import Book as BookModel
from schemas.author import Author, AuthorCreate, AuthorUpdate, AuthorResponse

router = APIRouter(prefix="/authors", tags=["Authors"])

@router.get("/", response_model=AuthorResponse)
def get_authors(
    page: int = Query(1, ge=1), 
    size: int = Query(10, ge=1, le=100), 
    db: Session = Depends(get_db)
):
    offset = (page - 1) * size
    total = db.query(AuthorModel).count()
    
    query = db.query(
        AuthorModel, 
        func.count(BookModel.id).label("books_count")
    ).outerjoin(BookModel).group_by(AuthorModel.id)

    results = query.offset(offset).limit(size).all()

    authors_with_count = []
    for author, books_count in results:
        author.books_count = books_count
        authors_with_count.append(author)

    return AuthorResponse(items=authors_with_count, total=total, page=page, size=size)

@router.post("/", response_model=Author, status_code=status.HTTP_201_CREATED)
def create_author(
    author: AuthorCreate, 
    db: Session = Depends(get_db)
):
    new_author = AuthorModel(name=author.name)
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    return new_author

@router.patch("/{author_id}", response_model=Author)
def update_author(
    author_id: int,
    author: AuthorUpdate,
    db: Session = Depends(get_db)
):
    existing_author = db.query(AuthorModel).filter(AuthorModel.id == author_id).first()
    if not existing_author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    existing_author.name = author.name
    db.commit()
    db.refresh(existing_author)
    return existing_author

@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(
    author_id: int,
    db: Session = Depends(get_db)
):
    existing_author = db.query(AuthorModel).filter(AuthorModel.id == author_id).first()
    if not existing_author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    db.delete(existing_author)
    db.commit()
    return {"message": "Author deleted successfully"}