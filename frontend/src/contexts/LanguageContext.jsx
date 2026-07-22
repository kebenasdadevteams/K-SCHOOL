import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("am");

  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === "en") return "am";
      if (prev === "am") return "or";
      return "en";
    });
  };

  const isAmharic = language === "am";
  const isOromo = language === "or";
  const isEnglish = language === "en";

  const getLanguageName = () => {
    if (language === "en") return "English";
    if (language === "am") return "አማርኛ";
    if (language === "or") return "Afaan Oromoo";
    return "English";
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isAmharic,
        isOromo,
        isEnglish,
        getLanguageName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
