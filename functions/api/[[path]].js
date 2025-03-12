/**
 * Cloudflare Function to proxy requests to Splitwise API
 * This will be deployed at {domain}/api/* and proxy to secure.splitwise.com/api/v3.0/*
 */
export async function onRequest(context) {
    // Get request details
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, '');
    
    // Construct the target URL for the Splitwise API
    const targetUrl = `https://secure.splitwise.com/api/v3.0${path}${url.search}`;
    
    // Clone the headers to modify them
    const headers = new Headers(request.headers);
    
    // Handle the Splitwise cookie - fetch it from the x-splitwise-cookie header
    // that our frontend sends, and convert it to a proper Cookie header
    const splitwiseCookie = headers.get('x-splitwise-cookie');
    if (splitwiseCookie) {
      headers.set('Cookie', `user_credentials=${splitwiseCookie}`);
      headers.delete('x-splitwise-cookie'); // Remove the custom header
    }
    
    // Add any other necessary headers
    headers.set('Origin', 'https://secure.splitwise.com');
    headers.set('Referer', 'https://secure.splitwise.com/');
    
    // Create new request to forward to Splitwise
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow',
    });
    
    try {
      // Forward the request to Splitwise API
      const response = await fetch(proxyRequest);
      
      // Clone and modify the response headers if needed
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', url.origin);
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, x-splitwise-cookie');
      
      // Return the response with modified headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      // Handle errors
      return new Response(JSON.stringify({ error: 'Failed to proxy request', message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': url.origin,
        },
      });
    }
  }
  
  /**
   * Handle preflight OPTIONS requests
   */
  export function onRequestOptions(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-splitwise-cookie',
        'Access-Control-Max-Age': '86400',
      },
    });
  }