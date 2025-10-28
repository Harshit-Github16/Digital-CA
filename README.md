# Digital CA - Complete SaaS Platform

A comprehensive SaaS platform for accounting, GST, TDS, payroll, and compliance management built with Next.js 14.

## 🚀 Features

- **GST Management**: GSTR-1, GSTR-3B, GSTR-9 auto-calculation
- **Accounting System**: P&L, Balance Sheet, Trial Balance
- **Invoicing & Billing**: GST-compliant invoices with PDF generation
- **Tax Compliance**: TDS calculation and return filing
- **Client Management**: Multi-client support with role-based access
- **Payroll & HR**: Employee management and payslip generation
- **Analytics Dashboard**: Dynamic charts and reports
- **AI Assistant**: Compliance help and error detection
- **Notifications**: Email and WhatsApp alerts

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + Redux Toolkit
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Charts**: Recharts
- **Payments**: Razorpay integration
- **UI Components**: Lucide React icons

## 📁 Project Structure

```
digital-ca/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── auth/           # Authentication pages
│   │   ├── clients/        # Client management
│   │   ├── invoices/       # Invoice management
│   │   └── ...
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication APIs
│   │   ├── dashboard/      # Dashboard APIs
│   │   ├── clients/        # Client APIs
│   │   └── ...
│   ├── components/         # React components
│   ├── lib/               # Utilities and store
│   ├── models/            # MongoDB models
│   └── types/             # TypeScript types
├── package.json
└── README.md
```

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Run the installation script
./install.sh
```

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 🎨 UI Theme

- **Primary Blue**: #0952A1
- **White**: #FFFFFF  
- **Accent Orange**: #FAD456
- **Light theme only** with modern, minimal design

## 📊 Core Modules

1. **GST Management** - Auto-calculation and filing
2. **Accounting** - Complete bookkeeping system
3. **Invoicing** - GST-compliant billing
4. **Tax Compliance** - TDS and income tax
5. **Client Management** - Multi-tenant support
6. **Payroll** - HR and salary management
7. **Analytics** - Dynamic reporting dashboard
8. **AI Assistant** - Compliance help
9. **Notifications** - Multi-channel alerts
10. **Payments** - Razorpay integration

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Admin, Staff, Client)
- Secure password hashing with bcrypt
- Protected API routes

## 📱 Mobile Responsive

Fully responsive design optimized for desktop, tablet, and mobile devices.

## 🗄️ Database Models

- **User**: Authentication and user management
- **Client**: Client information and business details
- **Invoice**: GST-compliant invoicing system
- **GSTFiling**: GST return filing and tracking
- **Employee**: HR and payroll management
- **Payroll**: Salary calculations and payslips

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/digital-ca

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS
- DigitalOcean
- Heroku

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.
# Digital-CA
# Digital-CA
# GST
# Digital-CA
# Digital-CA
