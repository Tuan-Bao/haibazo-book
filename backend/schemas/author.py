from pydantic import BaseModel, Field
from typing import Optional, List

class AuthorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="The name of the author", example="J.K. Rowling")

class AuthorCreate(AuthorBase):
    pass

class AuthorUpdate(AuthorBase):
    pass
    
class Author(AuthorBase):
    id: int
    books_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class AuthorResponse(BaseModel):
    items: List[Author]
    total: int
    page: int
    size: int