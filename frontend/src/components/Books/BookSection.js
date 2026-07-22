import React from "react";
import { BookOpen } from "lucide-react";
import BookCard from "./BookCard.js";
import "../../pages/Books/BookSectionPage.css";
import "./BookSection.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const BookSection = () => {
  const { language, isAmharic, isOromo } = useLanguage();
  const navigate = useNavigate();

  // Helper function to get text in current language
  const getText = (english, amharic, oromo) => {
    if (isOromo) return oromo;
    if (isAmharic) return amharic;
    return english;
  };

  // Multilingual content
  const content = {
    title: getText(
      "Recommended Reading",
      "የሚመከሩ መጽሐፎች",
      "Kitaabota Hayyamamtan"
    ),
    subtitle: getText(
      "Deepen your faith and understanding with these inspirational books",
      "እምነትዎን እና ግንዛቤዎን በእነዚህ መነቃቂያ መጽሐፎች ያብሉ",
      "Kitaabota kana qalbii kennan iimaanaa fi hubannoo kee dhiphisaa"
    ),
    moreBooks: getText("More Books", "ተጨማሪ መጽሐፎች", "Kitaabota Dabalataa"),
  };

  // Book data with translations and URLs
  const books = [
    {
      id: 1,
      title: getText("The Great Controversy", "ታላቁ ተጋድሎ", "Waldhaansaa Guddaa"),
      author: "Ellen G. White",
      authorAmharic: "ኤለን ጂ ዋይት",
      authorOromo: "Ellen G. White",
      description: getText(
        "A prophetic overview of the battle between good and evil",
        "በመልካም እና በክፋት መካከል ያለው ውግያ የሚያሳይ የትንቢት አጠቃላይ እይታ",
        "Ilaalcha nabiyyummaa waldhaansaa gaarii fi hammeenya gidduu jiru"
      ),
      // Replace these with actual book URLs or PDF links
      url: "https://m.egwwritings.org/am/book/14653.1#0",
      downloadUrl:
        "https://www.ellenwhite.org/downloads/the-great-controversy.pdf",
    },
    {
      id: 2,
      title: getText(
        "Steps to Christ",
        "ወደ ክርስቶስ የሚያደርሱ እርምጃዎች",
        "Gamolee gara Kiristoos"
      ),
      author: "Ellen G. White",
      authorAmharic: "ኤለን ጂ ዋይት",
      authorOromo: "Ellen G. White",
      description: getText(
        "A guide to personal relationship with Jesus",
        "ከኢየሱስ ጋር የግል ግንኙነት መመሪያ",
        "Qajeelfama qunnamtii dhuunfaa Yesus waliin"
      ),
      url: "https://m.egwwritings.org/am/book/14077.2#0",
      downloadUrl: "https://www.ellenwhite.org/downloads/steps-to-christ.pdf",
    },
    {
      id: 3,
      title: getText("The Desire of Ages", "የዘመናት ምኞት", "Fedhii Waggaa"),
      author: "Ellen G. White",
      authorAmharic: "ኤለን ጂ ዋይት",
      authorOromo: "Ellen G. White",
      description: getText(
        "The life and ministry of Jesus Christ",
        "የኢየሱስ ክርስቶስ ሕይወት እና አገልግሎት",
        "Jireenya fi tajaajilaa Yesus Kiristoos"
      ),
      url: "https://shalomtel.com/desire_of_ages.html",
      downloadUrl:
        "https://www.ellenwhite.org/downloads/the-desire-of-ages.pdf",
    },
    {
      id: 4,
      title: getText("Early Writings", "ቀደምት ጽሑፎች", "Barreeffama duraa"),
      author: "Ellen G. White",
      authorAmharic: "ኤለን ጂ ዋይት",
      authorOromo: "Ellen G. White",
      description: getText(
        "messages full of hope, warning, and heavenly insight that reveal the spiritual battles and divine guidance behind the Christian journey.",
        "በተስፋ፣ በማስጠንቀቂያ እና በሰማያዊ ጥበብ የተሞሉ መልኦች የክርስቲያን ጉዞ ከፍተኛ መከላከያዎችን እና ከፍተኛ መምሪያዎችን የሚገልጹ መልኦች።",
        "Seenaa waldhaansaa gaarii fi hammeenya gidduu jiru Uumama irraa ka'ee Mootii Daawititti"
      ),
      url: "https://m.egwwritings.org/am/book/14679.1#0",
      downloadUrl:
        "https://www.ellenwhite.org/downloads/patriarchs-and-prophets.pdf",
    },
  ];

  const handleMoreBooks = () => {
    navigate("/resources");
  };

  // Handle Read Online click
  const handleReadOnline = (bookUrl) => {
    // Open book URL in a new tab
    if (bookUrl) {
      window.open(bookUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Handle Download click (if you add download button later)
  const handleDownload = (downloadUrl, bookTitle) => {
    if (downloadUrl) {
      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${bookTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="books-section-preview">
      <div className="title-w-desc">
        <BookOpen className="book-icon" />
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
      <div className="books-preview">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={
              isAmharic
                ? book.authorAmharic
                : isOromo
                ? book.authorOromo
                : book.author
            }
            description={book.description}
            // Pass the handler with the book's URL
            onReadOnline={() => handleReadOnline(book.url)}
            // Optional: Pass download handler if you enable download button
            // onDownload={() => handleDownload(book.downloadUrl, book.title)}
          />
        ))}
      </div>
      <button className="read-more" onClick={handleMoreBooks}>
        {content.moreBooks}
        <span className="arrow">→</span>
      </button>
    </div>
  );
};

export default BookSection;
