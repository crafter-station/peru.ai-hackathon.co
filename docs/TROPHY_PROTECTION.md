# Trophy Asset Protection

This document explains how the trophy STL asset is protected from direct access.

## Overview

The trophy STL file is served through a server-side API proxy route instead of being directly accessible from blob storage. This prevents users from easily discovering and downloading the asset URL from the client-side code.

## Architecture

1. **Environment Variable**: The actual STL URL is stored in `TROPHY_STL_URL` environment variable (not exposed to client)
2. **API Proxy Route**: `/api/trophy/stl` fetches the file server-side and streams it to the client
3. **Protection Layers**:
   - Referrer/Origin checking (only allows requests from the same domain)
   - Rate limiting (10 requests per minute per IP/user-agent)
   - Server-side fetching (URL never exposed to client)

## Setup

1. Add the `TROPHY_STL_URL` environment variable to your `.env` file:
   ```bash
   TROPHY_STL_URL=https://your-blob-storage-url.com/trophy.stl
   ```

2. The component automatically uses the protected API route (`/api/trophy/stl`)

## Security Features

### Referrer/Origin Protection
- Only allows requests from the configured `NEXT_PUBLIC_BASE_URL` or `localhost:3000` (for development)
- Blocks direct access attempts from other domains

### Rate Limiting
- In-memory rate limiting: 10 requests per minute per IP/user-agent combination
- Prevents abuse and excessive requests
- Automatically resets after the time window

### Server-Side Rendering
- The STL URL is never exposed in client-side code
- All fetching happens server-side in the API route
- Even if someone inspects the network requests, they only see the proxy endpoint

## Limitations

⚠️ **Note**: This protection is not foolproof. Determined users can still:
- Access the API endpoint directly if they know the URL
- Download the file through browser dev tools
- Extract the file from memory during rendering

However, it provides:
- ✅ Protection against casual discovery of the asset URL
- ✅ Prevention of direct linking/sharing of the blob storage URL
- ✅ Rate limiting to prevent abuse
- ✅ Server-side control over access

For stronger protection, consider:
- Adding authentication/authorization
- Using signed URLs with expiration
- Implementing watermarking or DRM solutions
- Moving to a private blob storage with access tokens

## API Route

The API route is located at `/app/api/trophy/stl/route.ts` and handles:
- Environment variable validation
- Rate limiting
- Referrer checking
- Server-side fetching from blob storage
- Streaming the file to the client with appropriate headers
