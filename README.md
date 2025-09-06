# HTTP URL Shortener Microservice

A robust microservice for shortening URLs, with analytics and custom logging middleware.

## Features
- Shorten URLs with globally unique shortcodes
- Custom shortcode support
- Default validity: 30 minutes (user can specify validity in minutes)
- Analytics: track visits and expiry
- Custom logging middleware (see `middleware/logger.js`)

## API Endpoints
- `POST /api/shorten` — Shorten a URL
  - Body: `{ originalUrl: string, validity?: number, customCode?: string }`
- `GET /api/:code` — Redirect to original URL
- `GET /api/analytics/:code` — Get analytics for a short URL

## Setup
1. Install dependencies: `npm install`
2. Set up MongoDB and configure `.env`
3. Start server: `node server.js`

## Logging
All requests are logged using the custom middleware in `middleware/logger.js`.

## License
MIT
