# Quick Start Guide - AI-Driven Life Improvement Platform

## 📋 Project Overview
This guide provides a quick reference for getting started with the AI-Driven Life Improvement Platform development project. For detailed information, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

## 🎯 30-Day Sprint Overview

### Week 1: Planning & Architecture (Days 1-7)
**Focus**: Lay the foundation with proper planning and design
- Complete project setup and repository structure
- Document user stories and requirements
- Design database schema and API architecture
- Create wireframes and security framework
- Set up development environment and CI/CD

**Key Milestone**: All planning documents complete, development environment ready

### Week 2: Backend Foundation (Days 8-14)
**Focus**: Build robust backend infrastructure
- Initialize FastAPI application
- Implement authentication and user management
- Create Health and Productivity module APIs
- Set up comprehensive testing framework
- Database migrations and models

**Key Milestone**: Backend API functional with 2 core modules

### Week 3: Frontend Development (Days 15-20)
**Focus**: Build user interface and integrate with backend
- Scaffold React application with TypeScript
- Implement authentication UI and state management
- Build dashboard and navigation
- Create Health and Productivity module UIs
- Integrate API with error handling

**Key Milestone**: Frontend MVP with full authentication flow

### Week 4: Integration & Polish (Days 21-30)
**Focus**: Complete remaining modules and enhance with AI
- Build Finance and Learning modules (full-stack)
- Integrate OpenAI for AI recommendations
- Implement feedback and analytics systems
- Add notifications and security enhancements
- Performance optimization and comprehensive testing
- Complete documentation and deployment prep

**Key Milestone**: Full-stack application ready for deployment

## 📊 Task Management

### Using the Task Tracker
We provide three formats for task tracking:

1. **Markdown**: [PROJECT_PLAN.md](PROJECT_PLAN.md) - Detailed plan with context
2. **JSON**: [TASK_TRACKER.json](TASK_TRACKER.json) - Structured data for import
3. **CSV**: [TASK_TRACKER.csv](TASK_TRACKER.csv) - Spreadsheet compatible

### Recommended Tools
- **GitHub Projects**: Import tasks as issues
- **Jira**: Use CSV import feature
- **Linear**: API integration with JSON
- **Spreadsheet**: Open CSV in Google Sheets/Excel

### Task Properties
Each task includes:
- **ID**: Unique identifier (1-30)
- **Title**: Clear, actionable description
- **Phase**: Development phase
- **Week/Day**: Specific timeline placement
- **Duration**: Estimated hours (all tasks = 2 hours)
- **Priority**: Critical, High, Medium
- **Dependencies**: Which tasks must complete first
- **Tags**: Categorization for filtering
- **Deliverables**: Expected outputs

## 🚀 Getting Started Today

### Day 1: Project Setup (Task 1)
```bash
# Clone and set up repository
git clone <repo-url>
cd ai-life-platform

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install initial dependencies
pip install fastapi uvicorn sqlalchemy alembic pytest black flake8

# Create project structure
mkdir -p backend/{models,routers,services,tests}
mkdir -p frontend/src/{components,pages,hooks,utils}
mkdir -p docs

# Initialize git
git init
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".env" >> .gitignore

# Create initial README
cat > README.md << EOF
# AI-Driven Life Improvement Platform

[Project description]

## Quick Links
- [Project Plan](PROJECT_PLAN.md)
- [Task Tracker (CSV)](TASK_TRACKER.csv)
- [Task Tracker (JSON)](TASK_TRACKER.json)

## Setup
See QUICK_START.md
EOF

# Commit initial structure
git add .
git commit -m "Initial project setup"
```

### Day 2-7: Continue with Planning Tasks
Follow the sequence in PROJECT_PLAN.md, completing one 2-hour task per day.

## 📝 Daily Workflow

### Recommended 2-Hour Session Structure
```
00:00 - 00:15  Review task objectives, read dependencies
00:15 - 01:45  Development work (coding, designing, documenting)
01:45 - 02:00  Testing, git commit, update task status
```

### Git Workflow
```bash
# Start new task
git checkout -b task-{id}-{short-description}

# Make changes...
# Run tests/linters

# Commit
git add .
git commit -m "Task {id}: {description}"

# Push and create PR
git push origin task-{id}-{short-description}
```

### Progress Tracking
Update task status in your tracking tool:
- **Not Started** → **In Progress** → **Testing** → **Complete**

## 🔧 Development Environment

### Required Software
- **Python 3.11+**: Backend development
- **Node.js 18+**: Frontend development
- **PostgreSQL 14+**: Database
- **Redis 7+**: Caching (optional for early tasks)
- **Docker**: Containerization
- **Git**: Version control

### Recommended IDE Setup
- **VS Code** with extensions:
  - Python
  - Pylance
  - ESLint
  - Prettier
  - React Developer Tools

### Environment Variables
Create `.env` file (see `.env.example`):
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ailife

# Security
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
OPENAI_API_KEY=your-openai-key

# Email (for later tasks)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 📚 Key Documentation

### Phase 1: Planning (Week 1)
- `docs/USER_STORIES.md` - User requirements
- `docs/PERSONAS.md` - Target user profiles
- `docs/DATABASE_SCHEMA.md` - Data model design
- `docs/API_SPECIFICATION.md` - API endpoints
- `docs/DESIGN_SYSTEM.md` - UI/UX guidelines
- `docs/SECURITY_PLAN.md` - Security architecture

### Phase 2: Development (Weeks 2-4)
- `docs/DEVELOPMENT_SETUP.md` - Setup instructions
- `docs/API_DOCUMENTATION.md` - API reference
- `docs/USER_GUIDE.md` - End-user documentation

## 🎓 Learning Resources

### FastAPI
- [Official Docs](https://fastapi.tiangolo.com/)
- [Full Stack FastAPI Template](https://github.com/tiangolo/full-stack-fastapi-postgresql)

### React + TypeScript
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### SQLAlchemy
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/)

### OpenAI
- [OpenAI API Docs](https://platform.openai.com/docs/)

## ⚡ Quick Commands

### Backend
```bash
# Run development server
uvicorn backend.main:app --reload

# Run tests
pytest tests/ -v --cov=backend

# Create migration
alembic revision --autogenerate -m "description"

# Run migration
alembic upgrade head

# Format code
black backend/
flake8 backend/
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint
npm run lint
```

### Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Reset database
dropdb ailife && createdb ailife
alembic upgrade head
```

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Python Virtual Environment Issues
```bash
# Recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📞 Support

### Getting Help
1. Check existing documentation in `docs/`
2. Review task dependencies in PROJECT_PLAN.md
3. Search issue tracker for similar problems
4. Create new issue with:
   - Task ID and title
   - Expected vs actual behavior
   - Steps to reproduce
   - Error messages/logs

## 🎉 Success Metrics

### After Week 1
- ✅ All planning documents created
- ✅ Development environment running
- ✅ CI/CD pipeline functional

### After Week 2
- ✅ Backend API with 2 modules operational
- ✅ Authentication system working
- ✅ Database migrations running
- ✅ Test coverage >70%

### After Week 3
- ✅ Frontend application deployed locally
- ✅ User can register, login, and access dashboard
- ✅ 2 modules have functional UIs
- ✅ API integration working

### After Week 4
- ✅ All 4 modules functional (Health, Productivity, Finance, Learning)
- ✅ AI recommendations generating
- ✅ Security measures implemented
- ✅ Ready for deployment

---

**Last Updated**: 2025-10-17  
**Version**: 1.0  
**Maintainer**: VE Technologies Co.
