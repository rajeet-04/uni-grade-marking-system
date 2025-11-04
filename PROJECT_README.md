# University Grade & Exam Management System

A comprehensive full-stack web application for managing university grades, exams, and student records.

## Features

- **Role-based Access Control**: Admin, Faculty, and Student roles with different permissions
- **User Management**: Manage students, faculty, and admin accounts
- **Course Management**: Create and manage courses, subjects, and departments
- **Exam Management**: Schedule exams, manage exam sessions
- **Grade Management**: Faculty can enter and manage student marks
- **Result Generation**: Automatic CGPA/SGPA calculation and result generation
- **PDF Generation**: Generate printable marksheets and results
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Well-documented API with Swagger/OpenAPI
- **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js with TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **API Documentation**: Swagger/OpenAPI
- **Queue**: BullMQ with Redis
- **Email**: Nodemailer (with MailHog for development)

### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form with Zod

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Mail Testing**: MailHog

## Project Structure

```
.
├── backend/                # Backend API (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── students/      # Student management
│   │   ├── faculties/     # Faculty management
│   │   ├── courses/       # Course management
│   │   ├── subjects/      # Subject management
│   │   ├── exams/         # Exam management
│   │   ├── marks/         # Marks management
│   │   ├── results/       # Result generation
│   │   └── prisma/        # Database service
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seeding
│   └── Dockerfile
├── frontend/              # Frontend (Next.js)
│   ├── src/
│   │   ├── pages/         # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── styles/        # Global styles
│   └── Dockerfile
├── docker-compose.yml     # Docker Compose configuration
├── Makefile              # Development commands
└── README.md

```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uni-grade-marking-system
   ```

2. **Build and start all services**
   ```bash
   make build
   make up
   ```

3. **Wait for services to be healthy (about 30 seconds), then run migrations and seed**
   ```bash
   sleep 30
   make migrate
   make seed
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api/docs
   - MailHog UI: http://localhost:8025

5. **Login with default admin credentials**
   - Email: `admin@university.edu`
   - Password: `admin123`

### Development without Docker

#### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start development server
npm run start:dev
```

Backend will be available at http://localhost:4000

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will be available at http://localhost:3000

## Available Make Commands

- `make help` - Show all available commands
- `make up` - Start all services
- `make down` - Stop all services
- `make build` - Build Docker images
- `make rebuild` - Rebuild without cache
- `make migrate` - Run database migrations
- `make seed` - Seed database with initial data
- `make logs` - Show logs from all services
- `make logs-backend` - Show backend logs
- `make logs-frontend` - Show frontend logs
- `make backup-db` - Backup database
- `make clean` - Clean up containers and volumes
- `make reset` - Full reset (clean + rebuild + migrate + seed)
- `make status` - Show service status

## API Documentation

Once the backend is running, you can access the interactive API documentation at:

http://localhost:4000/api/docs

The API follows RESTful conventions and includes endpoints for:

- `/api/v1/auth` - Authentication (login, register)
- `/api/v1/users` - User management
- `/api/v1/students` - Student management
- `/api/v1/faculties` - Faculty management
- `/api/v1/courses` - Course management
- `/api/v1/subjects` - Subject management
- `/api/v1/exams` - Exam management
- `/api/v1/marks` - Marks management
- `/api/v1/results` - Result generation and retrieval

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - Base user table with authentication
- **Students** - Student profiles linked to users
- **Faculties** - Faculty profiles linked to users
- **Admins** - Admin profiles linked to users
- **Departments** - Academic departments
- **Courses** - Degree programs
- **Subjects** - Individual subjects/courses
- **AcademicYears** - Academic year definitions
- **Exams** - Exam definitions
- **ExamSessions** - Individual exam sessions
- **Marks** - Student marks for exams
- **Results** - Compiled student results with CGPA/SGPA
- **Grades** - Grade definitions and scales
- **Notifications** - System notifications
- **AuditLogs** - Audit trail for important actions

## Default Credentials

After seeding, the following account is available:

- **Admin**
  - Email: `admin@university.edu`
  - Password: `admin123`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://gradeuser:gradepass123@localhost:5432/grade_management"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-in-production"
REDIS_URL="redis://localhost:6379"
SMTP_HOST="localhost"
SMTP_PORT="1025"
API_PORT="4000"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing

### Backend Tests

```bash
cd backend
npm test                 # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:cov        # Run tests with coverage
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Production Deployment

For production deployment:

1. Update environment variables with secure values
2. Change default passwords
3. Use proper SSL/TLS certificates
4. Configure proper CORS settings
5. Set up proper backup strategies
6. Use managed database services
7. Implement proper monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.

## Roadmap

- [ ] PDF generation with QR code verification
- [ ] Email notifications
- [ ] Bulk import/export functionality
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Attendance management
- [ ] Assignment submission system
- [ ] Online examination system

## Acknowledgments

Built with best practices for educational institution management systems.
