import React from "react";
import { BookMarked, Download } from "lucide-react";

const BookCard = ({ title, author, description, onReadOnline, onDownload }) => {
  return (
    <div className="book-card book-card-preview">
      <div className="book-card-title">
        <h2 className="book-title">{title}</h2>
        <span className="book-author">by {author}</span>
      </div>
      <p className="description">{description}</p>
      <div className="book-actions">
        {/* Uncomment if you want download button */}
        {/* {onDownload && (
          <button className="btn-book" onClick={onDownload}>
            <Download className="icon" /> Download
          </button>
        )} */}

        <button className="btn-book" onClick={onReadOnline}>
          <BookMarked className="icon" /> Read Online
        </button>
      </div>
    </div>
  );
};

export default BookCard;
