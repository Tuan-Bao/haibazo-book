from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True)
    review = Column(Text, nullable=False)
    book_id = Column(Integer, ForeignKey('books.id'))

    book = relationship('Book', back_populates='reviews')