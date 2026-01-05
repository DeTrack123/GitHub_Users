# Backend - Express Server

## 📚 What We've Built

This is the backend API for your GitHub Browser application. It acts as a **proxy** between your React frontend and the GitHub API.

### Why use a backend proxy?
- **Security**: Keeps API tokens server-side (not exposed in browser)
- **Control**: You can add rate limiting, caching, or data transformation
- **CORS**: Avoids CORS issues when calling external APIs from the browser

---

## 🛠️ Key Technologies

### **1. Express.js**
- Minimal web framework for Node.js
- Handles routing and HTTP requests/responses

### **2. Helmet**
- Security middleware
- Sets HTTP headers to protect against common attacks (XSS, clickjacking, etc.)

### **3. CORS (Cross-Origin Resource Sharing)**
- Allows your React app (localhost:3000) to call this API (localhost:5000)
- Without it, browsers block cross-origin requests

### **4. Axios**
- HTTP client for making requests to GitHub API
- Modern alternative to fetch with better error handling

### **5. Mocha + Chai + Chai-HTTP**
- **Mocha**: Test framework (organizes and runs tests)
- **Chai**: Assertion library (expect, should)
- **Chai-HTTP**: Plugin for testing HTTP endpoints

---

## 📁 File Structure

```
backend/
├── server.js           # Main Express server with all routes
├── test/
│   └── api.test.js     # API endpoint tests
├── package.json        # Dependencies and scripts
└── .gitignore          # Files to exclude from git
```

---

## 🚀 Available Scripts

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev

# Run tests
npm test
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if server is running |
| GET | `/api/search/users?q=username` | Search GitHub users |
| GET | `/api/users/:username` | Get user profile |
| GET | `/api/users/:username/repos` | Get user repositories |
| GET | `/api/repos/:owner/:repo` | Get repository details |
| GET | `/api/repos/:owner/:repo/commits` | Get last 5 commits |

---

## 🧪 Testing

Run `npm test` to execute the test suite. The tests verify:
- ✅ Server health check works
- ✅ User search returns results
- ✅ Error handling for missing parameters
- ✅ User details endpoint works
- ✅ Repository and commit endpoints work

---

## 🔍 Code Walkthrough

### **server.js Structure:**

1. **Imports & Setup** (lines 1-10)
   - Load required packages
   - Initialize Express app

2. **Middleware** (lines 12-24)
   - `helmet()` - Security headers
   - `cors()` - Allow cross-origin requests
   - `express.json()` - Parse JSON bodies

3. **GitHub Config** (lines 26-33)
   - API base URL
   - Headers for GitHub requests

4. **Routes** (lines 35-150)
   - Each route follows this pattern:
     1. Extract parameters/query
     2. Validate input
     3. Make GitHub API request with axios
     4. Return data or handle errors

5. **Server Start** (lines 152-160)
   - Start listening on port 5000
   - Export app for testing

---

## 📝 Next Steps

1. ✅ Backend is complete!
2. ⏭️ Next: Build the React frontend
3. 🔗 Then: Connect frontend to this backend

---

**Questions?** Ask me about any part of the code! 🎓
