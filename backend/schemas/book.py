from pydantic import BaseModel, Field
from typing import Optional, List
from .author import Author

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="The title of the book", example="Harry Potter and the Sorcerer's Stone")
    author_id: int = Field(..., description="The ID of the author", example=1)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="The title of the book", example="Harry Potter and the Sorcerer's Stone")

class Book(BookBase):
    id: int
    title: str
    author_id: int
    author: Optional[Author] = None

    class Config:
        from_attributes = True

class BookResponse(BaseModel):
    items: List[Book]
    total: int
    page: int
    size: int