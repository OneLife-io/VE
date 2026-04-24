# VE Full-Stack E-Commerce Application

Complete e-commerce platform built with Node.js, Express, and vanilla JavaScript.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

1. **Install Backend Dependencies**

```bash
cd server
npm install
```text

2. **Install Dependencies (if needed for VE resources)**

```bash
cd ..
npm install
```text

### Running the Application

1. **Start the Backend Server**

```bash
cd server
npm run dev
```text

Server will run on <http://localhost:3000>

2. **Start the Frontend** (in a new terminal)

```bash
cd client
# Use a simple HTTP server
npx serve .
# Or use Python
python3 -m http.server 8080
```text

Frontend will be available at <http://localhost:8080>

## 📁 Project Structure

```text
VE/
├── src/                    # VE Resources Library
│   ├── constants/         # Application constants
│   ├── formulas/          # Calculation formulas
│   ├── config/            # Configuration management
│   └── index.js           # Main entry point
├── server/                # Backend API Server
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── client/               # Frontend Application
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── index.html       # Products page
│   ├── cart.html        # Shopping cart
│   └── login.html       # Authentication
├── ROADMAP.md           # Development roadmap
├── roadmap-tasks.csv    # Task breakdown (CSV)
├── GITHUB_ISSUES.md     # GitHub issues export
└── create-github-issues.sh  # Issue creation script
```text

## 🎯 Features Implemented

### Backend (Express.js API)

- ✅ RESTful API with Express.js
- ✅ JWT Authentication
- ✅ User Registration & Login
- ✅ Product Management (CRUD)
- ✅ Shopping Cart System
- ✅ Order Management
- ✅ Search, Filter & Sort
- ✅ Rate Limiting
- ✅ CORS & Security Headers (Helmet)
- ✅ Request Logging
- ✅ Error Handling

### Frontend (Vanilla JS)

- ✅ Product Catalog with Search
- ✅ Product Filtering & Sorting
- ✅ Shopping Cart
- ✅ User Authentication (Login/Register)
- ✅ Responsive Design
- ✅ Cart Management
- ✅ Order Checkout

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/me` - Update profile

### Products

- `GET /api/v1/products` - Get all products (with search/filter)
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (admin/manager)
- `PUT /api/v1/products/:id` - Update product (admin/manager)
- `DELETE /api/v1/products/:id` - Delete product (admin/manager)

### Cart

- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:productId` - Update item quantity
- `DELETE /api/v1/cart/items/:productId` - Remove item
- `DELETE /api/v1/cart` - Clear cart

### Orders

- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id/status` - Update order status (admin)
- `DELETE /api/v1/orders/:id` - Cancel order

## 🧪 Testing the Application

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```text

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```text

### 3. Get Products

```bash
curl http://localhost:3000/api/v1/products
```text

### 4. Add to Cart (requires token)

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":1,"quantity":2}'
```text

## 🎨 Frontend Usage

1. **Browse Products** - Visit `http://localhost:8080/index.html`
2. **Register/Login** - Click "Login" in navigation
3. **Add to Cart** - Click "Add to Cart" on products (requires login)
4. **View Cart** - Click "Cart" in navigation
5. **Checkout** - Click "Proceed to Checkout" in cart

## 🗺️ Development Roadmap

The complete development roadmap is available in:

- **ROADMAP.md** - Full project plan with phases and sprints
- **roadmap-tasks.csv** - Detailed task breakdown (148 tasks)
- **GITHUB_ISSUES.md** - Formatted GitHub issues

### Creating GitHub Issues

```bash
# Install GitHub CLI
brew install gh  # macOS
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Create issues
./create-github-issues.sh
```text

## 📊 Project Metrics

- **Total Tasks**: 148
- **Estimated Duration**: 13 sprints (26 weeks / ~6 months)
- **API Endpoints**: 20+
- **Frontend Pages**: 3 (Products, Cart, Login)
- **Test Coverage**: To be implemented in Phase 6

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- SQL injection prevention (when DB is integrated)

## 🛠️ Next Steps

### Phase 1: Database Integration

- [ ] Set up PostgreSQL
- [ ] Create database schema
- [ ] Implement migrations
- [ ] Replace mock data with real database

### Phase 2: Payment Integration

- [ ] Integrate Stripe
- [ ] Add payment processing
- [ ] Implement webhooks

### Phase 3: Admin Panel

- [ ] Create admin dashboard
- [ ] Product management UI
- [ ] Order management UI
- [ ] Analytics dashboard

### Phase 4: Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing

### Phase 5: Deployment

- [ ] Set up CI/CD
- [ ] Configure production environment
- [ ] Deploy to cloud (AWS/Heroku/Vercel)
- [ ] Set up monitoring

## 📝 Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=3000
HOST=localhost

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h

# Database (for future use)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ve_db
DB_USER=postgres
DB_PASSWORD=

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```text

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👥 Author

VETCO - VE E-Commerce Platform

---

**Built with the VE Resources Library** - A comprehensive constants, formulas, and configuration management system.
