import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// Remove direct import of appRouter since we'll be proxying requests instead
// import { appRouter } from "@feast/api";

const handler = async (req: Request) => {
  const apiUrl = "https://feast-cudw.onrender.com";
  
  if (!apiUrl) {
    throw new Error('FEAST_API_URL environment variable is not set');
  }

  // Get the specific procedure path from the URL
  const url = new URL(req.url);
  const procedurePath = url.pathname.replace('/api/trpc/', '');

  // Forward the request to the API server
  const response = await fetch(`${apiUrl}/trpc/${procedurePath}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // Forward cookies for authentication
      Cookie: req.headers.get('cookie') || '',
    },
    // Forward the request body
    body: req.method !== 'GET' ? await req.text() : undefined,
    // Required for cookies
    credentials: 'include',
  });

  // Forward the response back to the client
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
};

export { handler as GET, handler as POST };