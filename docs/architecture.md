# ERP System Architecture

## Overview
This ERP system is built with a modern full-stack architecture designed for educational institutions to manage admissions, fees, hostel accommodations, and generate automated reports.

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
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
- **Icons**: Lucide React

### Automation
- **Workflow Engine**: n8n
- **Purpose**: Automated report generation, receipt processing, notifications

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Automation    │    │   File System   │
│   (n8n)         │    │   (Uploads)     │
│   Port: 5678    │    │                 │
└─────────────────┘    └─────────────────┘
```

## Core Modules

### 1. Admissions Management
- Student registration and enrollment
- Document upload and verification
- Application status tracking
- Automated notifications

### 2. Fee Management
- Fee structure configuration
- Payment processing and tracking
- Receipt generation
- Due date reminders

### 3. Hostel Management
- Room allocation and management
- Occupancy tracking
- Maintenance requests
- Fee integration

### 4. Reporting System
- Student reports
- Financial reports
- Occupancy reports
- Custom report builder

## Security Features
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- Environment-based configuration