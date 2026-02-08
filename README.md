# ERP System - Educational Resource Planning

A comprehensive ERP system for educational institutions built with modern web technologies.

## 🏗️ Architecture

This project uses a **dual backend architecture**:

| Backend | Technology | Purpose |
|---------|------------|---------|
| **Node.js API** | Express.js + MongoDB | Core CRUD operations, authentication, real-time data |
| **Python API** | FastAPI + Motor | Advanced analytics, report generation, data exports |

## 📁 Project Structure

```
ERP_System/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # API services & utilities
│   └── package.json
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── seed.js        # Database seeder
│   └── package.json
├── python-backend/    # Python/FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt
├── automation/        # n8n automation workflows
└── database/          # Database migrations & seeds
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/hschinmayabharadwaj/ERP_System.git
cd ERP_System

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Install Python dependencies
cd ../python-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

**backend/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/erp_system
JWT_SECRET=your-secret-key
```

**python-backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=erp_system
JWT_SECRET=your-secret-key
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_PYTHON_API_URL=http://localhost:8000/api/py
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Start All Services

**Terminal 1 - Node.js Backend:**
```bash
cd backend && npm run dev
# Running on http://localhost:5000
```

**Terminal 2 - Python Backend:**
```bash
cd python-backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
# Running on http://localhost:8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend && npm run dev
# Running on http://localhost:3000
```

## � Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@erpsystem.com | password123 |
| Staff | staff@erpsystem.com | password123 |
| Accountant | accountant@erpsystem.com | password123 |
| Warden | warden@erpsystem.com | password123 |

## 📚 API Documentation

### Node.js API (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/students` | GET/POST | Students CRUD |
| `/api/students/:id` | GET/PUT/DELETE | Single student |
| `/api/fees` | GET/POST | Fee records |
| `/api/payments` | GET/POST | Payment records |
| `/api/hostel/rooms` | GET/POST | Room management |
| `/api/admissions` | GET/POST | Admission applications |
| `/api/dashboard/overview` | GET | Dashboard data |

### Python API (Port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/py/analytics/overview` | GET | Analytics overview |
| `/api/py/analytics/trends` | GET | Trend data |
| `/api/py/analytics/predictions` | GET | Predictive analytics |
| `/api/py/reports/students/export` | GET | Export students (CSV/Excel) |
| `/api/py/reports/fees/export` | GET | Export fees (CSV/Excel) |
| `/api/py/reports/payments/export` | GET | Export payments (CSV/Excel) |
| `/api/py/reports/financial/summary` | GET | Financial summary |
| `/api/py/reports/hostel/occupancy` | GET | Hostel report |

**Swagger Docs:** http://localhost:8000/api/py/docs

## 🏢 Core Features

### 1. Admissions Management
- Student registration and enrollment
- Document upload and verification
- Application status tracking
- Interview scheduling

### 2. Fee Management
- Configurable fee structures by course/semester
- Multiple payment method support
- Receipt generation
- Due date reminders

### 3. Hostel Management
- Room allocation and management
- Block-wise occupancy tracking
- Multiple room types (Single, Double, Triple)
- Check-in/Check-out tracking

### 4. Reports & Analytics (Python API)
- Student enrollment reports
- Financial reports with Excel/CSV export
- Hostel occupancy reports
- Predictive analytics

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Radix UI | Accessible Components |
| Framer Motion | Animations |
| React Query | Server State |
| React Hook Form + Zod | Forms & Validation |
| Recharts | Data Visualization |

### Node.js Backend
| Technology | Purpose |
|------------|---------|
| Express.js | Web Framework |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Joi | Validation |

### Python Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Web Framework |
| Motor | Async MongoDB |
| Pandas | Data Processing |
| OpenPyXL | Excel Export |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
