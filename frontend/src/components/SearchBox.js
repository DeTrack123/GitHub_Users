/**
 * SEARCH BOX COMPONENT - Input field for searching GitHub users
 * Provides a controlled form input that triggers search on submission
 */
import {useState} from 'react';
import './SearchBox.css';

function SearchBox({onSearch}) {
  // State to track user input in the search field
  const [searchTerm, setSearchTerm] = useState('');

  // Handles form submission and triggers search
  const handleSubmit = (e) => {
    // Prevent default form submission that would reload the page
    e.preventDefault();

    // Only trigger search if user entered non-empty text
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <div className="search-input-group">
            {/* Controlled input that updates state on every keystroke */}
            <input
                type="text"
                placeholder="Search GitHub users... (e.g., 'DeTrack')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            {/* Submit button to trigger search */}
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
      </div>
  );
}

export default SearchBox;
