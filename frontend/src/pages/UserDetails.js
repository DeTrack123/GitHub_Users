/**
 * USER DETAILS PAGE - Displays detailed information about a GitHub user
 * Shows user profile information and their repositories
 */
import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import './UserDetails.css';

function UserDetails() {
  // Extract username from URL parameters
  const {username} = useParams();

  // State to store user profile data from GitHub API
  const [user, setUser] = useState(null);
  // State to store array of user's repositories
  const [repos, setRepos] = useState([]);
  // State to store error messages for display
  const [error, setError] = useState('');
  // State to track loading status during API calls
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts or username changes
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  /**
   * Fetches user profile and repository data from backend API
   * Makes two sequential API calls for user details and repositories
   */
  const fetchUserData = async () => {
    // Clear any previous error messages
    setError('');
    // Set loading state to true while fetching
    setLoading(true);

    try {
      // Call backend API to get user profile details
      const userResponse = await fetch(`/api/users/${username}`);
      const userData = await userResponse.json();

      // Check if user exists and request was successful
      if (!userResponse.ok) {
        throw new Error(userData.message || userData.error || 'User not found');
      }

      // Store user profile data in state
      setUser(userData);

      // Call backend API to get user's repositories
      const reposResponse = await fetch(`/api/users/${username}/repos`);
      const reposData = await reposResponse.json();

      // Store repositories array in state
      setRepos(reposData);
    } catch (err) {
      // Display error message to user
      setError(err.message);
      // Log error to console for debugging
      console.error('Error fetching user data:', err);
    } finally {
      // Turn off loading state when fetch completes
      setLoading(false);
    }
  };

  // Display error message if data fetch failed
  if (error) {
    return (
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/" className="back-button">← Back to Search</Link>
        </div>
    );
  }

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading user details...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="user-details-page">
        <div className="container">
          {/* Navigation link back to home page */}
          <Link to="/" className="back-button">← Back to Search</Link>

          {/* User profile section with avatar and bio */}
          <div className="user-profile">
            <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="profile-avatar"
            />
            <div className="profile-info">
              {/* Display real name or fallback to username */}
              <h2>{user.name || user.login}</h2>
              <p className="username">@{user.login}</p>
              {/* External link to user's GitHub profile - styled differently */}
              <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
              >
                View on GitHub →
              </a>
              {/* Conditionally display bio if it exists */}
              {user.bio && <p className="bio">{user.bio}</p>}
            </div>
          </div>

          {/* Section displaying user's repositories as clickable cards */}
          <div className="repositories-section">
            <h3>Repositories ({repos.length})</h3>
            <div className="repos-grid">
              {/* Map through repositories and render clickable cards */}
              {repos.map((repo) => (
                  <Link
                      to={`/repo/${user.login}/${repo.name}`}
                      key={repo.id}
                      className="repo-card"
                  >
                    <h4>{repo.name}</h4>
                    <p className="repo-description">
                      {repo.description || 'No description available'}
                    </p>
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default UserDetails;
