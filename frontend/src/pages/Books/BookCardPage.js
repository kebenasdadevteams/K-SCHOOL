import React from "react";
import { BookMarked, Download } from "lucide-react";

const BookCard = ({ book, onReadOnline }) => {
  // Function to handle read online click
  const handleReadOnline = () => {
    if (onReadOnline) {
      onReadOnline(book.link);
    } else if (book.link) {
      // Fallback: open directly if handler not provided
      window.open(book.link, "_blank", "noopener,noreferrer");
    } else {
      alert("ማንበቢያ አገናኝ አልተገኘም");
    }
  };

  return (
    <div>
      <div className="book-card">
        <div className="book-icon">📖</div>
        {book.readingLevel && (
          <span className="reading-level">{book.readingLevel}</span>
        )}
        <h4>{book.title}</h4>
        <p className="book-author">{book.author}</p>
        <p className="book-description">{book.description}</p>
        {book.topics && (
          <div className="book-topics">
            {book.topics.slice(0, 3).map((topic, idx) => (
              <span key={idx} className="topic-tag">
                {topic}
              </span>
            ))}
            {book.topics.length > 3 && (
              <span className="topic-tag">+{book.topics.length - 3}</span>
            )}
          </div>
        )}
        <div className="book-meta">
          <span>📖 {book.pages} ገጾች</span>
          <span>{book.year}</span>
        </div>
        <div className="book-actions">
          {/* Download button - uncomment if you want it */}
          {/* {book.downloadLink && (
            <button 
              className="btn-book" 
              onClick={() => window.open(book.downloadLink, "_blank", "noopener,noreferrer")}
            >
              <Download className="icon" /> አውርድ
            </button>
          )} */}
          
          <button className="btn-book" onClick={handleReadOnline}>
            <BookMarked className="icon" /> በመስመር ላይ ያንብቡ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;