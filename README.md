# ERP System for Educational Institutions

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for educational institutions to manage admissions, fees, hostel accommodations, and generate automated reports.

## 🏗️ Architecture

This project follows a modern full-stack architecture:

- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **Automation**: n8n workflows for automated processes
- **Database**: MongoDB with structured schemas

## 📁 Project Structure

```
erp-system/
├── backend/                # Server-side API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   └── index.js        # Main server file
│   ├── package.json
│   └── .env                # Environment variables
│
├── frontend/               # React dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application screens
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication
│   │   └── styles/         # CSS configurations
│   └── package.json
│
├── automation/             # n8n automation workflows
├── database/               # Database setup and migrations
├── docs/                   # Project documentation
└── package.json            # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erp-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all workspaces
- `npm run build` - Build the frontend for production

### Backend
- `npm run dev:backend` - Start backend development server
- `npm start --workspace=backend` - Start backend in production mode

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build --workspace=frontend` - Build frontend for production

## 🏢 Core Features

### 1. Admissions Management
- Student registration and enrollment
- Document upload and verification
- Application status tracking
- Automated notifications

### 2. Fee Management
- Configurable fee structures
- Payment processing and tracking
- Receipt generation
- Due date reminders

### 3. Hostel Management
- Room allocation and management
- Occupancy tracking
- Maintenance requests
- Integrated billing

### 4. Reports & Analytics
- Student enrollment reports
- Financial reports
- Hostel occupancy reports
- Automated report generation

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **File Upload**: Multer
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query
- **Forms**: React Hook Form
- **Charts**: Recharts

### DevOps & Automation
- **Automation**: n8n workflows
- **Process Management**: PM2 (production)
- **Development**: Concurrently for multi-process development

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [System Requirements](docs/requirements.md)
- [API Documentation](docs/api.md) *(coming soon)*
- [Deployment Guide](docs/deployment.md) *(coming soon)*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder

---

**Happy Coding! 🎉**