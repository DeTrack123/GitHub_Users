/**
 * HOME PAGE - Main landing page with GitHub user search functionality
 * Displays a search box for finding GitHub users and shows search results
 */
import {useState} from 'react';
import SearchBox from '../components/SearchBox';
import UserList from '../components/UserList';
import './Home.css';

function Home() {
  // State to store array of GitHub user search results
  const [users, setUsers] = useState([]);
  // State to store error messages for display to user
  const [error, setError] = useState('');
  // State to track loading status during API calls
  const [loading, setLoading] = useState(false);

  //Handles user search requests by calling the backend API
  const handleSearch = async (searchTerm) => {
    // Clear previous results and errors
    setError('');
    setUsers([]);
    // Set loading state to true while fetching
    setLoading(true);

    try {
      // Call backend API with encoded search term
      const response = await fetch(
          `/api/search/users?q=${encodeURIComponent(searchTerm)}`
      );
      // Parse JSON response from server
      const data = await response.json();

      // Check if HTTP status indicates error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search users');
      }

      // Update state with search results from GitHub API
      setUsers(data.items || []);

      // Display message if no users found
      if (data.items.length === 0) {
        setError('No users found. Try a different search term.');
      }
    } catch (err) {
      // Display error message to user
      setError(err.message || 'Something went wrong. Please try again.');
      // Log error to console for debugging
      console.error('Search error:', err);
    } finally {
      // Turn off loading state when fetch completes
      setLoading(false);
    }
  };

  return (
      <div className="home-page">
        <div className="container">
          {/* Search input component */}
          <SearchBox onSearch={handleSearch} />
          
          {/* Display loading indicator while fetching data */}
          {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Searching GitHub users...</p>
              </div>
          )}
          
          {/* Display error message if exists */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Display user results if search returned users */}
          {users.length > 0 && <UserList users={users} />}
        </div>
      </div>
  );
}

export default Home;
