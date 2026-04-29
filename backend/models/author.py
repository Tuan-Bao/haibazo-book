from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Author(Base):
    __tablename__ = 'authors'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    books = relationship('Book', back_populates='author', cascade='all, delete-orphan')