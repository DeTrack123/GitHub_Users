require('dotenv').config();          // Load environment variables from .env file
const express = require('express');  // Web framework for creating the server
const cors = require('cors');        // Allows cross-origin requests (React → Express)
const helmet = require('helmet');    // Security middleware (adds protective HTTP headers)
const fetch = require('node-fetch'); // Makes HTTP requests to GitHub API

const app = express();
const PORT = 5000;

// HELMET: Adds security headers to every response
app.use(helmet());

// CORS: Allows React (localhost:3000) to call this API (localhost:5000)
app.use(cors());

// JSON PARSER: Converts incoming JSON data to JavaScript objects
app.use(express.json());

// GITHUB API CONFIGURATION
// Base URL for all GitHub API calls
const GITHUB_API_BASE = 'https://api.github.com';
// Required headers for GitHub API requests
const githubHeaders = {
  // Tells GitHub we want version 3 API responses in JSON format
  'Accept': 'application/vnd.github.v3+json',
  // Identifies your app (GitHub requires this header)
  'User-Agent': 'GitHub-Browser-App'
};


// Add authentication token if available
if (process.env.GITHUB_TOKEN) {
  githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
}

// HELPER FUNCTION
//Makes a request to GitHub API and returns the data
async function fetchFromGitHub(githubUrl) {
  // Send GET request to GitHub with required headers
  const response = await fetch(githubUrl, { headers: githubHeaders });
  // Convert response to JavaScript object
  const data = await response.json();
  // Return both response and data (we need response.ok and response.status)
  return { response, data };
}

// API ROUTES (Your endpoints)
// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running'
  });
});

// Search GitHub Users
app.get('/api/search/users', async (req, res) => {
  try {
    // Extract search query from URL
    const { q } = req.query;
    
    // Validate - make sure 'q' was provided
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Build GitHub API URL
    const githubUrl = `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(q)}&per_page=5`;
    
    // Call GitHub API using our helper function
    const { data } = await fetchFromGitHub(githubUrl);
    
    // Send GitHub's response back to React app
    res.json(data);
    
  } catch (error) {
    // If anything goes wrong, log it and send error response
    console.error('Error searching users:', error.message);
    res.status(500).json({ 
      error: 'Failed to search users',
      message: error.message 
    });
  }
});

// Get User Details
app.get('/api/users/:username', async (req, res) => {
  try {
    // Extract username from URL path
    const { username } = req.params;
    
    // Build GitHub API URL
    const githubUrl = `${GITHUB_API_BASE}/users/${username}`;
    
    // Call GitHub API
    const { response, data } = await fetchFromGitHub(githubUrl);
    
    // Check if user exists
    if (!response.ok) {
      // User not found - send GitHub's error message back
      return res.status(response.status).json(data);
    }
    
    // User found - send their details back
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch user details',
      message: error.message 
    });
  }
});

// Get User's Repositories
app.get('/api/users/:username/repos', async (req, res) => {
  try {
    // Extract username from URL
    const { username } = req.params;
    
    // Build GitHub API URL
    const githubUrl = `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=30`;
    
    // Call GitHub API
    const { data } = await fetchFromGitHub(githubUrl);
    
    // Send repositories back
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching user repos:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch repositories',
      message: error.message 
    });
  }
});


// Get Repository Details
app.get('/api/repos/:owner/:repo', async (req, res) => {
  try {
    // Extract both owner and repo name from URL
    const { owner, repo } = req.params;
    
    // Build GitHub API URL
    const githubUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    
    // Call GitHub API
    const { data } = await fetchFromGitHub(githubUrl);
    
    // Send repository details back
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching repo:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch repository details',
      message: error.message 
    });
  }
});


// Get Repository Commits
app.get('/api/repos/:owner/:repo/commits', async (req, res) => {
  try {
    // Extract owner and repo from URL
    const { owner, repo } = req.params;
    
    // Build GitHub API URL
    const githubUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=5`;
    
    // Call GitHub API
    const { data } = await fetchFromGitHub(githubUrl);
    
    // Send commits back
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch commits',
      message: error.message 
    });
  }
});


// START THE SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api/health`);
  });
}

// EXPORT FOR TESTING
module.exports = app;
