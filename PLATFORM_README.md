# E-Learning Platform - Complete Microservices Architecture

A comprehensive e-learning platform built with modern microservices architecture, featuring course management, user authentication, subscription billing, and real-time messaging capabilities.

## 🏗️ **Architecture Overview**

### **Core Technologies**

- **Backend**: NestJS microservices with TypeScript
- **Frontend**: React microfrontends with Module Federation
- **Database**: PostgreSQL (cold data storage)
- **Cache**: Valkey/Redis (hot data caching & sessions)
- **Message Queue**: AWS SQS with LocalStack (async processing)
- **Authentication**: JWT with bcrypt password hashing
- **Payments**: Stripe integration (subscription billing)

### **Services Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Auth Service  │    │  User Service   │
│   (Port 3000)   │    │   (Port 3001)   │    │   (Port 3002)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Course Service  │    │Subscription Svc│    │Community Service│
│   (Port 3003)   │    │   (Port 3004)   │    │   (Port 3005)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Analytics Svc   │    │  Notification   │    │   File Upload   │
│   (Port 3006)   │    │   Service       │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Implemented Features**

### ✅ **1. Authentication & Security**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for security
- **Session Management**: Valkey-backed user sessions with activity tracking
- **User Registration/Login**: Complete auth flow with validation
- **Role-Based Access**: Different permissions for instructors vs students

### ✅ **2. User Management**

- **User CRUD Operations**: Complete user lifecycle management
- **Profile Management**: Avatar, bio, and personal information
- **User Search & Filtering**: Advanced user discovery
- **Account Status**: Active/inactive user management
- **Email Verification**: Account verification workflow

### ✅ **3. Course Management**

- **Course Catalog**: Comprehensive course marketplace
- **Advanced Filtering**: Category, level, price, and search filters
- **Instructor Dashboard**: Course creation and management
- **Course Publishing**: Draft/published workflow
- **Rating System**: Course reviews and ratings
- **Access Control**: Subscription-based course access

### ✅ **4. Subscription & Payments**

- **Three-Tier Plans**: Basic ($9.99), Premium ($19.99), Enterprise ($49.99)
- **Billing Cycles**: Monthly subscriptions with auto-renewal
- **Payment Processing**: Stripe integration ready
- **Subscription Lifecycle**: Create, cancel, reactivate, upgrade/downgrade
- **Access Validation**: Plan-based feature access control
- **Webhook Integration**: Real-time payment event handling

### ✅ **5. Database & Caching**

- **PostgreSQL**: Robust relational database with 12+ tables
- **Valkey Hot Cache**: Frequently accessed data (1-hour TTL)
- **Valkey Session Store**: User session persistence (7-day TTL)
- **Intelligent Caching**: Automatic cache invalidation
- **Performance Optimization**: Query optimization and indexing

### 🔄 **6. Message Queue (In Progress)**

- **SQS Integration**: AWS SQS with LocalStack for development
- **Event-Driven Architecture**: Async processing for user actions
- **Scalable Processing**: Decoupled service communication
- **Reliable Messaging**: Message persistence and retry logic

### ✅ **7. Quality Assurance**

- **Comprehensive Testing**: Unit and integration tests
- **Type Safety**: Full TypeScript implementation
- **Code Quality**: ESLint with strict rules
- **API Documentation**: RESTful endpoint documentation

## 📊 **Database Schema**

### **Core Tables**

```sql
-- Users
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  first_name, last_name VARCHAR,
  role ENUM('student', 'instructor', 'admin'),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at, updated_at TIMESTAMP
)

-- Courses
courses (
  id UUID PRIMARY KEY,
  title, description TEXT,
  instructor_id UUID REFERENCES users(id),
  category, level VARCHAR,
  access_type ENUM('lifetime', 'subscription'),
  price DECIMAL, currency VARCHAR,
  is_published BOOLEAN DEFAULT false,
  total_students INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at, updated_at TIMESTAMP
)

-- Subscriptions
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_type ENUM('basic', 'premium', 'enterprise'),
  status ENUM('active', 'cancelled', 'expired'),
  start_date, end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR,
  last_payment_date TIMESTAMP,
  created_at, updated_at TIMESTAMP
)

-- Course Progress
user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  progress_percentage DECIMAL(5,2),
  time_spent_seconds INT,
  is_completed BOOLEAN,
  completed_at TIMESTAMP
)

-- Community Features
community_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  title, content TEXT,
  post_type ENUM('discussion', 'question'),
  created_at, updated_at TIMESTAMP
)
```

## 🔧 **Setup & Installation**

### **Prerequisites**

```bash
Node.js 18+
npm or yarn
Docker & Docker Compose
PostgreSQL 15+
Valkey/Redis 8+
```

### **Quick Start**

```bash
# Clone repository
git clone <repository-url>
cd nx-micros

# Install dependencies
npm install

# Start infrastructure
docker-compose up -d

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
docker-compose exec postgres psql -U postgres -d nx_micros -f scripts/init.sql

# Start services
nx serve shell  # Frontend (Port 4200)
nx serve services  # API Gateway (Port 3000)
```

### **Environment Configuration**

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=nx_micros

# Cache
VALKEY_HOT_URL=redis://localhost:6379
VALKEY_SESSION_URL=redis://localhost:6380

# Message Queue
SQS_ENDPOINT=http://localhost:4566

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📡 **API Endpoints**

### **Authentication**

```http
POST /api/auth/register       # User registration
POST /api/auth/login          # User login
GET  /api/auth/me            # Get current user profile
```

### **Users**

```http
GET  /api/users              # List users (paginated)
GET  /api/users/:id          # Get user details
PUT  /api/users/:id          # Update user
DELETE /api/users/:id        # Delete user
GET  /api/users/:id/profile  # Get user profile with stats
```

### **Courses**

```http
GET  /api/courses            # List courses (filtered/paginated)
GET  /api/courses/:id        # Get course details
POST /api/courses            # Create course (instructor only)
PUT  /api/courses/:id        # Update course (owner only)
DELETE /api/courses/:id      # Delete course (owner only)
GET  /api/courses/featured   # Get featured courses
GET  /api/courses/categories # Get course categories
POST /api/courses/:id/rate   # Rate course
```

### **Subscriptions**

```http
GET  /api/subscriptions/plans         # Get available plans
POST /api/subscriptions               # Create subscription
GET  /api/subscriptions/my-subscription # Get user's subscription
GET  /api/subscriptions/history       # Get subscription history
PUT  /api/subscriptions/:id/cancel    # Cancel subscription
PUT  /api/subscriptions/:id/reactivate # Reactivate subscription
PUT  /api/subscriptions/:id/plan      # Change plan
POST /api/subscriptions/check-access  # Check subscription access
```

## 🧪 **Testing**

### **Run All Tests**

```bash
nx run-many --target=test --all
```

### **Run Specific Service Tests**

```bash
nx test services        # API Gateway tests
nx test user-service    # User service tests
nx test auth            # Auth microfrontend tests
nx test shell           # Shell app tests
```

### **API Testing Examples**

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get JWT token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# Access protected endpoints
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/courses
```

## 🚀 **Deployment**

### **Development**

```bash
# Start all services
nx run-many --target=serve --all --parallel

# Start infrastructure only
docker-compose up -d postgres valkey-hot valkey-session localstack
```

### **Production Build**

```bash
# Build all services
nx run-many --target=build --all

# Build specific service
nx build services
nx build shell
```

### **Docker Deployment**

```bash
# Build and run with Docker
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale course-service=3
```

## 📈 **Monitoring & Analytics**

### **Health Checks**

```http
GET /api/health             # Overall system health
GET /api/health/detailed    # Detailed service health
```

### **Metrics Available**

- User registration/login events
- Course enrollment statistics
- Subscription conversion rates
- Payment processing metrics
- System performance monitoring

## 🔒 **Security Features**

- **Password Security**: bcrypt hashing with salt
- **JWT Tokens**: Secure, expirable authentication
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Request throttling protection
- **CORS Configuration**: Secure cross-origin policies

## 📚 **Architecture Decisions**

### **Microservices Benefits**

- **Scalability**: Independent service scaling
- **Technology Diversity**: Different tech stacks per service
- **Fault Isolation**: Service failures don't cascade
- **Team Autonomy**: Independent development teams

### **Database Choices**

- **PostgreSQL**: ACID compliance, complex queries, JSON support
- **Valkey/Redis**: High-performance caching, session storage
- **SQS**: Reliable message queuing for async processing

### **Authentication Strategy**

- **JWT**: Stateless, scalable authentication
- **Session Store**: Additional security layer with Valkey
- **Password Hashing**: Industry-standard bcrypt security

## 🛠️ **Development Guidelines**

### **Code Style**

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with TypeScript rules
- **Prettier**: Consistent code formatting
- **Naming**: camelCase for variables/functions, PascalCase for classes

### **Git Workflow**

```bash
# Feature development
git checkout -b feature/new-feature
# Make changes...
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Hotfixes
git checkout -b hotfix/critical-bug
# Fix bug...
git commit -m "fix: critical bug in auth service"
```

### **API Design Principles**

- **RESTful**: Standard HTTP methods and status codes
- **Versioning**: API versioning strategy ready
- **Documentation**: OpenAPI/Swagger integration ready
- **Error Handling**: Consistent error response format
- **Pagination**: Cursor-based pagination for large datasets

## 🎯 **Future Enhancements**

### **High Priority**

- [ ] **File Upload Service**: Course video/content management
- [ ] **Notification Service**: Email/SMS notifications
- [ ] **Analytics Service**: Learning analytics and reporting
- [ ] **Admin Dashboard**: Comprehensive admin interface

### **Medium Priority**

- [ ] **Mobile App**: React Native mobile application
- [ ] **Video Streaming**: Integrated video player with progress tracking
- [ ] **Certificate Generation**: Course completion certificates
- [ ] **Discussion Forums**: Advanced community features

### **Low Priority**

- [ ] **Multi-tenancy**: White-label solutions
- [ ] **AI Recommendations**: Personalized course suggestions
- [ ] **Gamification**: Badges, points, and leaderboards
- [ ] **Offline Mode**: Download courses for offline viewing

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### **Code Review Checklist**

- [ ] TypeScript types are properly defined
- [ ] Tests are written and passing
- [ ] Code follows established patterns
- [ ] Security considerations addressed
- [ ] Documentation updated
- [ ] Database migrations included

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 **Support**

For support and questions:

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and community support
- **Documentation**: Comprehensive API docs and architecture guides

---

**Built with ❤️ using NestJS, React, PostgreSQL, Valkey, and AWS SQS**

_This platform provides a solid foundation for scalable e-learning solutions with modern architecture and best practices._
