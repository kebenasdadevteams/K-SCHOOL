import React, { useState } from "react";
import { booksData } from "../../data/booksData";
import "./BookSectionPage.css";
import BookCardPage from "./BookCardPage";
import { BookMarked } from "lucide-react";

const BookSectionPage = () => {
  const getText = (amharic) => {
    return amharic;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allBooks = booksData.getAllBooks();
  const featuredBooks = booksData.getFeaturedBooks();

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.topics &&
        book.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Function to handle reading online for featured books
  const handleFeaturedReadOnline = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("ማንበቢያ አገናኝ አልተገኘም");
    }
  };

  // Function to handle reading online for all books
  const handleReadOnline = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("ለዚህ መጽሐፍ ማንበቢያ አገናኝ አልተገኘም");
    }
  };

  return (
    <div className="books-section">
      <div className="books-container">
        {/* Header */}
        <div className="books-header">
          <div className="books-badge">📚 {getText("መንፈሳዊ ቤተ መጻሕፍት")}</div>
          <h1>{getText("የሚመከሩ መጻፎች")}</h1>
          <p className="books-subtitle">
            {getText(
              "እምነትዎን የሚያጠነክሩ እና ከእግዚአብሔር ጋር ያለዎትን ግንኙነት የሚያጠናክሩ አነቃቂ መጻሕፍትን ያግኙ።"
            )}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="books-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder={getText("መጽሐፍትን በርዕስ ወይም በጸሐፊ ይፈልጉ...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                title={getText("ፍለጋ አጥፋ")}
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">{getText("ሁሉም ምድቦች")}</option>
            {booksData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Books */}
        {searchQuery === "" && selectedCategory === "all" && (
          <div className="featured-section">
            <h2>⭐ {getText("ተለይተው የቀረቡ መጻሕፍት")}</h2>
            <div className="books-grid">
              {featuredBooks.map((book) => (
                <div key={book.id} className="book-card featured">
                  <div className="book-header">
                    <span className="featured-badge">
                      {getText("ተለይተው የቀረቡ")}
                    </span>
                  </div>
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-description">{book.description}</p>
                  {book.topics && (
                    <div className="book-topics">
                      {book.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="topic-tag">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="book-meta">
                    <span>
                      📖 {book.pages} {getText("ገጾች")}
                    </span>
                    <span>{book.year}</span>
                  </div>
                  <div className="book-actions">
                    <button
                      className="btn-book"
                      onClick={() => handleFeaturedReadOnline(book.link)}
                    >
                      <BookMarked className="icon" />
                      {getText("በመስመር ላይ ያንብቡ")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Books */}
        <div className="all-books-section">
          <div className="section-header">
            <h2>
              {searchQuery || selectedCategory !== "all"
                ? `${getText("የተገኙ ውጤቶች")} (${filteredBooks.length})`
                : getText("ሁሉም መጻሕፍት")}
            </h2>

            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="reset-filters-btn"
              >
                {getText("ሁሉንም አሳይ")}
              </button>
            )}
          </div>

          {searchQuery || selectedCategory !== "all" ? (
            // Filtered Results
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCardPage
                  key={book.id}
                  book={book}
                  onReadOnline={handleReadOnline}
                />
              ))}
              {filteredBooks.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">📚</div>
                  <p>{getText("ምንም መጽሐፍ አልተገኘም")}</p>
                  <p className="no-results-suggestion">
                    {getText("የተለየ ፍለጋ ቃል ይሞክሩ ወይም ሌላ ምድብ ይምረጡ")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="reset-btn"
                  >
                    {getText("ማጣሪያዎችን አጥፋ")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // By Category
            <div className="categories-section">
              {booksData.categories.map((category) => (
                <div key={category.id} className="category-group">
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                  <div className="books-grid">
                    {category.books.map((book) => (
                      <BookCardPage
                        key={book.id}
                        book={book}
                        onReadOnline={handleReadOnline}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSectionPage;
