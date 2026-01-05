/**
 * MAIN APP COMPONENT - Root component of the GitHub Browser application
 * Sets up client-side routing and renders the application header
 * Defines three main routes: Home (search), User Details, and Repository Details
 */
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import UserDetails from './pages/UserDetails';
import RepoDetails from './pages/RepoDetails';
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          {/* Application header displayed on all pages */}
          <header className="app-header">
            <h1>GitHub Browser</h1>
            <p>Search and explore GitHub users and repositories</p>
          </header>

          {/* Route configuration for different pages */}
          <Routes>
            {/* Home page with search functionality */}
            <Route path="/" element={<Home />} />

            {/* User profile page with dynamic username parameter */}
            <Route path="/user/:username" element={<UserDetails />} />

            {/* Repository details page with owner and repo name parameters */}
            <Route path="/repo/:owner/:repoName" element={<RepoDetails />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
