# PharmPlus - Medical Scheme Administration Platform

A comprehensive SaaS platform for managing medical scheme membership applications, member management, and healthcare benefits administration.

## Features

### Core Functionality
- **Application Management** - Process membership applications with automated workflows
- **Member Portal** - Self-service portal for members to submit applications and track status
- **Admin Dashboard** - Comprehensive dashboard with real-time analytics
- **Multi-tenant Architecture** - Support multiple organizations with isolated data

### Application Workflow
- New membership applications
- Add/remove dependents
- Package changes
- Banking detail updates
- Application approval/rejection workflow

### Payment Integration (Zimbabwe)
- **EcoCash** - Mobile money payments
- **OneMoney** - Mobile money payments
- **InnBucks** - Digital wallet payments
- **Visa/Mastercard** - Card payments
- **Bank Transfer** - Direct bank transfers
- Powered by **Paynow Zimbabwe**

### Analytics & Reporting
- Application statistics
- Member demographics
- Revenue tracking
- Approval rates
- Custom reports

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment Gateway**: Paynow Zimbabwe

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/pharmaplus.git
cd pharmaplus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
PAYNOW_INTEGRATION_ID="your-paynow-id"
PAYNOW_INTEGRATION_KEY="your-paynow-key"
```

5. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pharmaplus/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (dashboard)/   # Dashboard pages
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   ├── paynow.ts      # Paynow integration
│   │   └── utils.ts       # Helper functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Subscription Plans

| Plan | Price (USD) | Price (ZWL) | Members |
|------|-------------|-------------|---------|
| Starter | $99/mo | ZWL 2,500/mo | Up to 500 |
| Professional | $299/mo | ZWL 7,500/mo | Up to 5,000 |
| Enterprise | $599/mo | ZWL 15,000/mo | Unlimited |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@pharmplus.co.zw or visit our [documentation](https://docs.pharmplus.co.zw).
