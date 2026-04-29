
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchAuthors = (page = 1, size = 5) =>
	axios.get(`${API_BASE}/authors/?page=${page}&size=${size}`);

export const createAuthor = (data) =>
	axios.post(`${API_BASE}/authors/`, data);

export const updateAuthor = (id, data) =>
    axios.patch(`${API_BASE}/authors/${id}`, data);

export const deleteAuthor = (id) =>
	axios.delete(`${API_BASE}/authors/${id}`);

export const fetchBooks = (page = 1, size = 5) =>
    axios.get(`${API_BASE}/books/?page=${page}&size=${size}`);

export const createBook = (data) =>
    axios.post(`${API_BASE}/books/`, data);

export const updateBook = (id, data) =>
    axios.patch(`${API_BASE}/books/${id}`, data);

export const deleteBook = (id) =>
    axios.delete(`${API_BASE}/books/${id}`);

export const fetchReviews = (page = 1, size = 5) =>
    axios.get(`${API_BASE}/reviews/?page=${page}&size=${size}`);

export const createReview = (data) =>
    axios.post(`${API_BASE}/reviews/`, data);

export const updateReview = (id, data) =>
    axios.patch(`${API_BASE}/reviews/${id}`, data);

export const deleteReview = (id) =>
    axios.delete(`${API_BASE}/reviews/${id}`);