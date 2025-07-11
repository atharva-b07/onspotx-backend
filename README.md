# 🌍 OnSpotX Backend - Real-Time Location Discovery API

A professional NestJS backend service for discovering nearby places with real-time location-based queries, distance calculations, and category filtering.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **🌍 Real-time Location Discovery**: Find nearby places using latitude/longitude coordinates
- **📍 Distance Calculation**: Accurate distance computation using Haversine formula
- **🏷️ Category Filtering**: Filter results by place categories (restaurants, cafes, bars, etc.)
- **📊 Configurable Search**: Customizable radius (0.1-50km) and result limits (1-50)
- **🔒 Security**: Rate limiting, CORS, helmet security headers
- **📚 API Documentation**: Interactive Swagger/OpenAPI documentation
- **🧪 Comprehensive Testing**: Unit tests and E2E tests with >90% coverage
- **📈 Health Monitoring**: Health check endpoints for monitoring
- **⚡ High Performance**: Optimized for speed and scalability

## 🏗️ Architecture

```
src/
├── common/                 # Shared utilities and interfaces
│   ├── interfaces/         # TypeScript interfaces
│   └── utils/             # Utility functions (distance calculations)
├── config/                # Configuration management
├── discovery/             # Main discovery feature module
│   ├── controllers/       # HTTP controllers
│   ├── dto/              # Data Transfer Objects
│   └── services/         # Business logic services
├── health/               # Health check module
└── main.ts              # Application bootstrap
```

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd onspotx-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run start:dev
```

## 🚦 Quick Start

1. **Start the server**:
   ```bash
   npm run start:dev
   ```

2. **Access the API**:
   - API Base URL: `http://localhost:3000/api/v1`
   - Swagger Documentation: `http://localhost:3000/api/docs`

3. **Test the discovery endpoint**:
   ```bash
   curl "http://localhost:3000/api/v1/discover?latitude=40.7128&longitude=-74.0060&radius=5"
   ```

## 📖 API Documentation

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/discover` | GET | Discover nearby places |
| `/api/v1/discover/categories` | GET | Get available categories |
| `/api/v1/discover/stats` | GET | Get service statistics |
| `/api/v1/discover/nearest` | GET | Find nearest place |
| `/api/v1/health` | GET | Health check |

### Discovery API

**Endpoint**: `GET /api/v1/discover`

**Query Parameters**:
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)
- `radius` (optional): Search radius in km (0.1 to 50, default: 5)
- `category` (optional): Filter by category
- `limit` (optional): Max results (1 to 50, default: 10)

**Example Request**:
```bash
GET /api/v1/discover?latitude=40.7128&longitude=-74.0060&radius=2&category=restaurant
```

**Example Response**:
```json
{
  "results": [
    {
      "id": "rest_001",
      "name": "Trattoria Alfredo",
      "category": "restaurant",
      "description": "Authentic Italian pasta, great ambiance.",
      "distance_km": 0.5,
      "open_now": true,
      "image_url": "https://cdn.onspotx.ai/spots/alfredo.jpg",
      "location": {
        "lat": 40.7130,
        "lng": -74.0050,
        "address": "123 Main St, New York, NY 10001"
      }
    }
  ],
  "total": 1,
  "query": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 2,
    "category": "restaurant",
    "limit": 10
  },
  "metadata": {
    "processing_time_ms": 45,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Available Categories

- `restaurant` - Restaurants and dining
- `cafe` - Cafes and coffee shops
- `bar` - Bars and nightlife
- `shop` - Retail stores
- `hotel` - Hotels and accommodation
- `attraction` - Tourist attractions
- `park` - Parks and recreation
- `hospital` - Healthcare facilities
- `gas_station` - Gas stations
- `bank` - Banks and ATMs
- `gym` - Fitness centers
- `pharmacy` - Pharmacies
- `event` - Events and venues
- `entertainment` - Entertainment venues
- `service` - Service providers

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Coverage

The project maintains >90% test coverage across:
- Unit tests for services and utilities
- Integration tests for controllers
- E2E tests for complete API workflows

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DEFAULT_RADIUS` | Default search radius (km) | `5.0` |
| `MAX_RADIUS` | Maximum search radius (km) | `50.0` |
| `MAX_RESULTS` | Maximum results per query | `50` |
| `RATE_LIMIT_TTL` | Rate limit time window (seconds) | `60` |
| `RATE_LIMIT_MAX` | Max requests per time window | `100` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

### Rate Limiting

The API implements three-tier rate limiting:
- **Short**: 10 requests per second
- **Medium**: 100 requests per minute  
- **Long**: 1000 requests per 15 minutes

## 📊 Monitoring

### Health Checks

- **Basic**: `GET /api/v1/health`
- **Detailed**: `GET /api/v1/health/detailed`

### Metrics

- Response times
- Memory usage
- Request counts
- Error rates

## 🔧 Development

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run build
```

### Development Scripts

```bash
# Start development server
npm run start:dev

# Start with debugging
npm run start:debug

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Configure SSL/TLS
- [ ] Set up database (for future versions)
- [ ] Configure caching (Redis)

### Cloud Deployment

The application is ready for deployment on:
- **AWS**: ECS, Elastic Beanstalk, Lambda
- **Google Cloud**: Cloud Run, App Engine
- **Azure**: Container Instances, App Service
- **Heroku**: Git-based deployment
- **DigitalOcean**: App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use proper JSDoc comments
- Follow NestJS conventions
- Maintain >90% test coverage

## 📝 API Examples

### Discover Restaurants

```bash
curl "http://localhost:3000/api/v1/discover?latitude=40.7128&longitude=-74.0060&category=restaurant&radius=2"
```

### Find Nearest Cafe

```bash
curl "http://localhost:3000/api/v1/discover/nearest?latitude=40.7128&longitude=-74.0060&category=cafe"
```

### Get Service Statistics

```bash
curl "http://localhost:3000/api/v1/discover/stats"
```

## 🔮 Future Enhancements

- **Database Integration**: PostgreSQL/MongoDB support
- **Real-time Updates**: WebSocket notifications
- **Caching**: Redis integration for performance
- **Authentication**: JWT-based user authentication
- **Geofencing**: Advanced location-based features
- **Machine Learning**: Personalized recommendations
- **Analytics**: Advanced usage analytics
- **Multi-language**: Internationalization support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS**: For the powerful Node.js framework
- **TypeScript**: For type safety and developer experience
- **Swagger**: For API documentation
- **Jest**: For testing framework

## 📞 Support

For support and questions:
- 📧 Email: support@onspotx.com
- 🐛 Issues: [GitHub Issues](https://github.com/onspotx/backend/issues)
- 📖 Documentation: [API Docs](http://localhost:3000/api/docs)

---

**Made with ❤️ by the OnSpotX Team**