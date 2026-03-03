# Self-Healing Website - Production Deployment

## Overview
This is the production deployment of the Self-Healing Website, a comprehensive automated repository maintenance system that connects to GitHub repositories and performs complete self-healing cycles.

## Features
- **Repository Scanner**: Enumerates files, detects languages and frameworks
- **Checklist Generator**: Creates comprehensive validation items across 17+ categories
- **Automated Fixing**: Automatically resolves detected issues
- **GitHub Integration**: Commits fixes back to the repository
- **Real-time Monitoring**: Live progress tracking and logging
- **Modern UI**: Beautiful dark-themed responsive interface

## Production Notice
This static deployment shows the frontend interface. For full functionality, you need to run the backend server locally with your GitHub personal access token.

## Local Setup
1. Clone or download the source files
2. Create a `.github_token` file with your GitHub personal access token
3. Install dependencies: `npm install`
4. Start the server: `node server.js`
5. Access at: `http://localhost:3000`

## Target Repository
The system is configured to work with the "storybook" repository and will:
- Create the repository if it doesn't exist
- Scan all files and dependencies
- Generate comprehensive validation checklist
- Execute automated fixes
- Commit changes back to GitHub

## Validation Categories
- File-level validation
- Semantic validation
- Performance optimization
- Security scanning
- Architecture validation
- Documentation checks
- Testing validation
- Configuration validation
- Error handling validation
- And more...

## Technology Stack
- **Backend**: Node.js, Express, Octokit (GitHub API)
- **Frontend**: Vanilla JavaScript, Modern CSS
- **Deployment**: Static hosting with S3 web pages

## Demo Mode
This production deployment includes a demo mode that simulates the self-healing process for demonstration purposes.