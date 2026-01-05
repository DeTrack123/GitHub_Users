// REPOSITORY DETAILS PAGE Displays detailed information about a specific GitHub repository
// Shows repository metadata and the last 5 commits with author information
import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import './RepoDetails.css';

function RepoDetails() {
  // Extract owner username and repository name from URL parameters
  const {owner, repoName} = useParams();

  // State to store repository details fetched from API
  const [repo, setRepo] = useState(null);
  // State to store array of commit objects
  const [commits, setCommits] = useState([]);
  // State to store error messages for display
  const [error, setError] = useState('');
  // State to track loading status during API calls
  const [loading, setLoading] = useState(true);

  // Fetch repository data when component mounts or when owner/repoName changes
  useEffect(() => {
    fetchRepoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repoName]);

  /**
   * Fetches repository details and commit history from backend API
   * Makes two API calls: one for repo details, one for commits
   */
  const fetchRepoData = async () => {
    // Clear any previous error messages
    setError('');
    // Set loading state to true while fetching
    setLoading(true);

    try {
      // Call backend API to get repository details
      const repoResponse = await fetch(`/api/repos/${owner}/${repoName}`);
      const repoData = await repoResponse.json();

      // Check if repository exists and request was successful
      if (!repoResponse.ok) {
        throw new Error(repoData.error || 'Repository not found');
      }

      // Store repository data in state
      setRepo(repoData);

      // Call backend API to get last 5 commits
      const commitsResponse = await fetch(
          `/api/repos/${owner}/${repoName}/commits`
      );
      const commitsData = await commitsResponse.json();

      // Store commits array in state, ensure it's always an array
      setCommits(Array.isArray(commitsData) ? commitsData : []);
    } catch (err) {
      // Display error message to user
      setError(err.message);
      // Log error to console for debugging
      console.error('Error fetching repo data:', err);
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
          <Link to={`/user/${owner}`} className="back-button">
            ← Back to User
          </Link>
        </div>
    );
  }

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading repository details...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="repo-details-page">
        <div className="container">
          {/* Navigation link back to user profile */}
          <Link to={`/user/${owner}`} className="back-button">
            ← Back to {owner}
          </Link>

          {/* Repository name and description header */}
          <div className="repo-header">
            <h2>
              {owner} / <strong>{repo.name}</strong>
            </h2>
            <p className="repo-description-main">
              {repo.description || 'No description available'}
            </p>
            {/* External link to repository on GitHub - styled differently */}
            <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
            >
              View on GitHub →
            </a>
            <div className="repo-meta">
              <span>Created: {new Date(repo.created_at).toLocaleDateString()}</span>
              <span>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
              {repo.language && <span>Language: {repo.language}</span>}
            </div>
          </div>

          {/* Section displaying last 5 commits */}
          <div className="commits-section">
            <h3>Last 5 Commits</h3>
            {commits.length === 0 ? (
                <p>No commits found</p>
            ) : (
                <div className="commits-list">
                  {/* Map through commits array and render each commit card */}
                  {commits.map((commit, index) => (
                      <div key={commit.sha} className="commit-card">
                        <div className="commit-header">
                          <span className="commit-number">#{index + 1}</span>
                        </div>
                        <p className="commit-message">{commit.commit.message}</p>
                        <div className="commit-author">
                          {/* Show avatar only if author data exists */}
                          {commit.author && commit.author.avatar_url && (
                              <img
                                  src={commit.author.avatar_url}
                                  alt={commit.commit.author.name}
                                  className="commit-avatar"
                              />
                          )}
                          {/* Display author name with fallback to 'Unknown' */}
                          <span>{commit.commit?.author?.name || 'Unknown'}</span>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default RepoDetails;
