/**
 * USER LIST COMPONENT - Displays GitHub user search results
 * Renders a grid of clickable user cards with avatars and usernames
 */
import {Link} from 'react-router-dom';
import './UserList.css';

function UserList({users}) {
  return (
      <div className="user-list">
        {/* Display count of search results */}
        <h2>Search Results ({users.length} users found)</h2>
        
        {/* Grid container for user cards */}
        <div className="user-grid">
          {/* Map through users array and render clickable cards */}
          {users.map((user) => (
              <Link
                  to={`/user/${user.login}`}
                  key={user.id}
                  className="user-card"
              >
                {/* User avatar image */}
                <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="user-avatar"
                />
                {/* User's GitHub username */}
                <h3>{user.login}</h3>
              </Link>
          ))}
        </div>
      </div>
  );
}

export default UserList;
