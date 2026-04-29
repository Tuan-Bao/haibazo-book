from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.review import Review as ReviewModel
from models.book import Book as BookModel
from schemas.review import Review, ReviewCreate, ReviewUpdate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/", response_model=ReviewResponse)
def get_reviews(
    page: int = Query(1, ge=1), 
    size: int = Query(10, ge=1, le=100), 
    db: Session = Depends(get_db)
):
    offset = (page - 1) * size
    total = db.query(ReviewModel).count()
    reviews = db.query(ReviewModel).options(joinedload(ReviewModel.book).joinedload(BookModel.author)).offset(offset).limit(size).all()
    return ReviewResponse(items=reviews, total=total, page=page, size=size)

@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate, 
    db: Session = Depends(get_db)
):
    new_review = ReviewModel(review=review.review, book_id=review.book_id)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.patch("/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    review: ReviewUpdate,
    db: Session = Depends(get_db)
):
    existing_review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not existing_review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    if review.review is not None:
        existing_review.review = review.review
    db.commit()
    db.refresh(existing_review)
    return existing_review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    existing_review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not existing_review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    db.delete(existing_review)
    db.commit()
    return {"message": "Review deleted successfully"}