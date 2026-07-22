import React from 'react';
import Footer from '../components/Contact/Footer';
import BookSectionPage from './Books/BookSectionPage';

const ResourcesPage = () => {
  return (
    <main>
      {/* Full Book/Resources Section */}
      <section id="resources">
        <BookSectionPage showMoreResources={false} />
      </section>

      {/* Footer */}
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
};

export default ResourcesPage;
