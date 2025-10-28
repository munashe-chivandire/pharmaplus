# PharmPlus Application Viewer

A simple web application to view and print PharmPlus job applications.

## What's the CORS Issue?

The CORS (Cross-Origin Resource Sharing) error occurs because web browsers block requests from a webpage (running on `http://127.0.0.1:5500`) to an API on a different domain (`https://www.my.pharmaplus.uk`) unless the API explicitly allows it.

**Solution**: We created a local proxy server that:
- Runs on your computer
- Receives requests from the web page
- Forwards them to the actual API with the API key
- Returns the response with CORS headers enabled

## How to Use

### Step 1: Set Up Environment Variables

Before starting the proxy server, you need to set your API key as an environment variable.

**Option A: Create a .env file (Recommended)**
1. Copy `.env.example` to create a new file called `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace `your_api_key_here` with your actual API key
3. The `.env` file is automatically ignored by git and won't be committed

**Option B: Set environment variable manually**

**Windows (Command Prompt):**
```bash
set API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:API_KEY="your_api_key_here"
```

**Mac/Linux:**
```bash
export API_KEY=your_api_key_here
```

**Note:** Replace `your_api_key_here` with your actual PharmPlus API key.

### Step 2: Start the Proxy Server

Open a terminal in this folder and run:

```bash
node proxy-server.js
```

You should see:
```
Proxy server running at http://localhost:3000
Open application-viewer.html in your browser and click "Load Applications"
```

### Step 2: Open the Application Viewer

- Open `application-viewer.html` in your browser
- Click "Load Applications" button
- Select an application from the list to view details
- Click "Print Selected" to print the application

## Files

- `application-viewer.html` - The main viewer interface
- `proxy-server.js` - The local proxy server to bypass CORS
- `README.md` - This file

## Features

- Fetches all applications from the API
- Displays applications in a clean, organized format
- Print-friendly layout
- Sections include:
  - Personal Information
  - Professional Information
  - References
  - Documents
  - Application Status
  - Complete JSON data

## Troubleshooting

**Error: "Make sure the proxy server is running"**
- Ensure you've started the proxy server with `node proxy-server.js`
- Check that it's running on port 3000

**Error: "ECONNREFUSED"**
- The proxy server is not running or crashed
- Restart it with `node proxy-server.js`

**No applications showing**
- Check the browser console for errors
- Verify the API is accessible
- Check the proxy server terminal for error messages
