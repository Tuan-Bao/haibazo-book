from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Book(Base):
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    author_id = Column(Integer, ForeignKey('authors.id'))

    author = relationship('Author', back_populates='books')
    reviews = relationship('Review', back_populates='book', cascade='all, delete-orphan')