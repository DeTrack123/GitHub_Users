/**
 * Backend API Tests
 * Tests for Express server endpoints using fetch
 */

const chai = require('chai');
const fetch = require('node-fetch');
const app = require('../server');

const expect = chai.expect;

// Base URL for testing
const BASE_URL = 'http://localhost:5000';
let server;


describe('GitHub Browser API Tests', () => {
  
  // Start server before tests
  before((done) => {
    server = app.listen(5000, () => {
      console.log('Test server started on port 5000');
      done();
    });
  });

  // Close server after all tests
  after((done) => {
    server.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  // Test 1: Health check endpoint
  describe('GET /api/health', () => {
    it('should return server status', async () => {
      const res = await fetch(`${BASE_URL}/api/health`);
      const data = await res.json();
      
      expect(res.status).to.equal(200);
      expect(data).to.be.an('object');
      expect(data).to.have.property('status').equal('ok');
      expect(data).to.have.property('message');
    });
  });

  // Test 2: User search endpoint
  describe('GET /api/search/users', () => {
    it('should return search results for valid query', async () => {
      const res = await fetch(`${BASE_URL}/api/search/users?q=DeTrack`);
      const data = await res.json();
      
      expect(data).to.be.an('object');
      expect(data).to.have.property('items');
      expect(data.items).to.be.an('array');
    });

    it('should return error when query is missing', async () => {
      const res = await fetch(`${BASE_URL}/api/search/users`);
      const data = await res.json();
      
      expect(data).to.have.property('error');
    });
  });

  // Test 3: User details endpoint
  describe('GET /api/users/:username', () => {
    it('should return user details for valid username', async () => {
      const res = await fetch(`${BASE_URL}/api/users/DeTrack`);
      const data = await res.json();
      
      expect(res.status).to.equal(200);
      expect(data).to.be.an('object');
      expect(data).to.have.property('login');
      expect(data).to.have.property('name');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await fetch(`${BASE_URL}/api/users/thisuserdoesnotexist123456789`);
      
      expect(res.status).to.equal(404);
    });
  });

  // Test 4: User repositories endpoint
  describe('GET /api/users/:username/repos', () => {
    it('should return user repositories', async () => {
      const res = await fetch(`${BASE_URL}/api/users/DeTrack/repos`);
      const data = await res.json();
      
      expect(res.status).to.equal(200);
      expect(data).to.be.an('array');
      if (data.length > 0) {
        expect(data[0]).to.have.property('name');
        expect(data[0]).to.have.property('description');
      }
    });
  });

  // Test 5: Repository details endpoint
  describe('GET /api/repos/:owner/:repo', () => {
    it('should return repository details', async () => {
      const res = await fetch(`${BASE_URL}/api/repos/facebook/react`);
      const data = await res.json();
      
      expect(res.status).to.equal(200);
      expect(data).to.be.an('object');
      expect(data).to.have.property('name');
      expect(data).to.have.property('created_at');
      expect(data).to.have.property('description');
    });
  });

});
