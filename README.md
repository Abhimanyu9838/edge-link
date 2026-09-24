# EdgeLink 🔗

**Scalable URL Shortener with Geolocation-Based Edge Redirection & Analytics**

A high-performance URL shortener built with Node.js, Redis, and PostgreSQL. Features distributed ID generation, Base62 encoding, geolocation-based redirection, and real-time analytics.

## ✨ Features

- **URL Shortening** — Snowflake-style distributed ID + Base62 encoding
- **Geolocation Redirection** — Route users to country-specific destinations using GeoIP
- **Real-time Analytics** — Track clicks by country
- **Redis Caching** — Sub-millisecond resolution for hot URLs
- **EdgeLink Dashboard** — Modern dark UI with live telemetry

## 🏗️ Architecture

Frontend → Express Backend → PostgreSQL (Neon)
                ↓
           Redis Cloud (Cache)

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| Cache | Redis Cloud |
| ID Generation | flake-idgen |
| Encoding | Base62 |
| GeoIP | geoip-lite |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /shorten | Create short URL |
| GET | /resolve/:code | Resolve to destination |
| GET | /:code | Redirect with tracking |
| GET | /analytics/:code | Click analytics |
