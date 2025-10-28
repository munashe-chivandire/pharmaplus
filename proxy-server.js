const http = require('http');
const https = require('https');
const url = require('url');

// Load configuration from environment variables
const API_URL = process.env.API_URL || 'https://www.my.pharmaplus.uk/api/quest-med/admin/applications';
const API_PHOTO_URL = process.env.API_PHOTO_URL || 'https://www.my.pharmaplus.uk/api/quest-med/applications/photo';
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!API_KEY) {
    console.error('ERROR: API_KEY environment variable is required');
    console.error('Please set it by running: set API_KEY=your_api_key_here (Windows) or export API_KEY=your_api_key_here (Mac/Linux)');
    process.exit(1);
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle GET requests to /api/applications
    if (req.method === 'GET' && req.url === '/api/applications') {
        console.log('Fetching applications from API...');

        const options = {
            headers: {
                'x-api-key': API_KEY
            }
        };

        https.get(API_URL, options, (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                console.log('Response received from API');
                try {
                    // Parse the API response
                    const apiData = JSON.parse(data);

                    // Extract the data array from {success: true, data: [...]}
                    const applications = apiData.success && apiData.data ? apiData.data : [];

                    console.log(`Sending ${applications.length} applications to client`);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(applications));
                } catch (error) {
                    console.error('Error parsing API response:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to parse API response' }));
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching from API:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });
    }
    // Handle GET requests to /api/photo?path=filename
    else if (req.method === 'GET' && req.url.startsWith('/api/photo')) {
        const parsedUrl = url.parse(req.url, true);
        const photoPath = parsedUrl.query.path;

        if (!photoPath) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing path parameter' }));
            return;
        }

        // Validate path to prevent directory traversal attacks
        if (photoPath.includes('..') || photoPath.includes('/') || photoPath.includes('\\')) {
            console.warn(`Blocked potentially malicious path: ${photoPath}`);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid path parameter' }));
            return;
        }

        console.log(`Fetching photo from API: ${photoPath}`);

        const photoUrl = `${API_PHOTO_URL}?path=${encodeURIComponent(photoPath)}`;
        const options = {
            headers: {
                'Authorization': API_KEY,
                'x-api-key': API_KEY
            }
        };

        console.log(`[DEBUG] Full photo URL: ${photoUrl}`);
        console.log(`[DEBUG] Using API key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);

        // Step 1: Get signed URL from photo API
        https.get(photoUrl, options, (apiRes) => {
            let data = '';

            // Check if the response is successful
            if (apiRes.statusCode !== 200) {
                console.error(`Failed to fetch signed URL: ${apiRes.statusCode} ${apiRes.statusMessage}`);

                // Read error body
                apiRes.on('data', chunk => data += chunk);
                apiRes.on('end', () => {
                    console.error(`[DEBUG] API error response:`, data);
                });

                // Return error status without body to trigger browser onerror handler
                res.writeHead(apiRes.statusCode);
                res.end();
                return;
            }

            // Collect the JSON response
            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                try {
                    console.log(`[DEBUG] Photo API response:`, data);

                    // Parse the JSON response to get the signed URL
                    const jsonResponse = JSON.parse(data);
                    const signedUrl = jsonResponse.url || jsonResponse.signedUrl || jsonResponse.photoUrl || jsonResponse.data?.url;

                    if (!signedUrl) {
                        console.error('[DEBUG] No signed URL found in response. Full response:', jsonResponse);
                        res.writeHead(500);
                        res.end();
                        return;
                    }

                    console.log(`[DEBUG] Signed URL: ${signedUrl}`);

                    // Step 2: Fetch the actual image from the signed URL
                    const urlModule = signedUrl.startsWith('https') ? https : http;
                    urlModule.get(signedUrl, (imageRes) => {
                        if (imageRes.statusCode !== 200) {
                            console.error(`Failed to fetch image from signed URL: ${imageRes.statusCode}`);
                            res.writeHead(imageRes.statusCode);
                            res.end();
                            return;
                        }

                        // Forward the content-type from the image response
                        const contentType = imageRes.headers['content-type'] || 'image/jpeg';
                        res.writeHead(200, { 'Content-Type': contentType });

                        // Pipe the image data directly to the response
                        imageRes.pipe(res);
                    }).on('error', (error) => {
                        console.error('Error fetching image from signed URL:', error);
                        res.writeHead(500);
                        res.end();
                    });

                } catch (error) {
                    console.error('Error parsing photo API response:', error);
                    res.writeHead(500);
                    res.end();
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching from photo API:', error);
            res.writeHead(500);
            res.end();
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
    console.log(`Open application-viewer.html in your browser and click "Load Applications"`);
});
