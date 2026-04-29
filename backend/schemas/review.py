from pydantic import BaseModel, Field
from typing import List, Optional

class AuthorInReview(BaseModel):
    name: str
    class Config:
        from_attributes = True

class BookInReview(BaseModel):
    title: str
    author: AuthorInReview
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    review: str = Field(..., min_length=1, max_length=1000, description="The content of the review", example="This book was fantastic! I couldn't put it down.")
    book_id: int = Field(..., description="The ID of the book being reviewed", example=1)

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    review: str = Field(..., min_length=1, max_length=1000, description="The content of the review", example="This book was fantastic! I couldn't put it down.")

class Review(ReviewBase):
    id: int
    book: Optional[BookInReview]

    class Config:
        from_attributes = True

class ReviewResponse(BaseModel):
    items: List[Review]
    total: int
    page: int
    size: int
    