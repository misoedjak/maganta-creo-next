const http = require('http');

// Step 1: Get CSRF token
http.get('http://localhost:3000/api/auth/csrf', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const { csrfToken } = JSON.parse(data);
      console.log('Got CSRF Token:', csrfToken);

      // Step 2: POST credentials with CSRF token
      const postData = JSON.stringify({
        email: 'admin@magantakreasi.com',
        password: 'admin123',
        csrfToken: csrfToken,
        callbackUrl: 'http://localhost:3000/admin',
        redirect: false,
        json: true
      });

      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/callback/credentials',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (postRes) => {
        let postResult = '';
        postRes.on('data', chunk => postResult += chunk);
        postRes.on('end', () => {
          console.log('POST Response Status:', postRes.statusCode);
          console.log('POST Response Data:', postResult);
        });
      });

      req.on('error', e => console.error('POST Error:', e));
      req.write(postData);
      req.end();
    } catch(err) {
      console.error('Failed to parse CSRF response:', data, err);
    }
  });
}).on('error', e => console.error('CSRF Fetch Error:', e));
