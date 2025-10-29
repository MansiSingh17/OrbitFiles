# ☁️ OrbitFiles - Cloud Storage Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![ImageKit](https://img.shields.io/badge/ImageKit-FF6B6B?style=for-the-badge&logo=image&logoColor=white)

**A full-stack cloud storage platform built with modern web technologies**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Tech Stack](#tech-stack)

</div>

---

## 🌟 About OrbitFiles

**OrbitFiles** is a feature-rich cloud storage platform, built with cutting-edge technologies. It provides secure file management, seamless uploads, and optimized file delivery, all wrapped in a beautiful and intuitive user interface.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- ✅ **Clerk Authentication**
  - Secure user sign-up/sign-in
  - Social OAuth providers
  - Session management
  - Protected routes

### 📁 File Management
- ✅ **Upload Files**
  - Drag-and-drop support
  - Multiple file uploads
  - Progress indicators
- ✅ **Organize Files**
  - Star important files
  - Move files to trash
  - Restore deleted files
- ✅ **File Actions**
  - View file details
  - Download files
  - Delete permanently

</td>
<td width="50%">

### 🚀 Performance & Optimization
- ✅ **ImageKit Integration**
  - CDN-powered delivery
  - Automatic image optimization
  - Fast load times
  - Responsive images

### 🗄️ Database & Storage
- ✅ **Neon PostgreSQL**
  - Serverless PostgreSQL
  - Type-safe queries with Drizzle ORM
  - Data validation with Zod
- ✅ **AWS S3**
  - Secure cloud storage
  - Scalable file storage
  - Reliable data persistence

### 🎨 User Experience
- ✅ **Modern UI with HeroUI**
- ✅ **Responsive Design**
- ✅ **Dark Mode Support**
- ✅ **Intuitive Navigation**

</td>
</tr>
</table>

---

## 🚀 Demo

<!-- Add your demo link or screenshot here -->
```bash
# Coming Soon!
Live Demo: [OrbitFiles Demo](https://your-demo-url.com)
```

---

## 📸 Screenshots

<div align="center">

<!-- Add screenshots here -->
| Homepage | File Management | Upload Interface |
|----------|-----------------|------------------|
| ![Home](link-to-screenshot) | ![Files](link-to-screenshot) | ![Upload](link-to-screenshot) |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Core Technologies

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)

</div>

### 🔧 Key Dependencies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org) | React framework with SSR/SSG |
| **Authentication** | [Clerk](https://clerk.com) | User authentication & management |
| **Database** | [Neon PostgreSQL](https://neon.tech) | Serverless PostgreSQL database |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe database queries |
| **Validation** | [Zod](https://zod.dev) | Schema validation |
| **File Delivery** | [ImageKit](https://imagekit.io) | CDN & image optimization |
| **Storage** | [AWS S3](https://aws.amazon.com/s3/) | Cloud file storage |
| **UI Components** | [HeroUI](https://www.heroui.com) | Modern UI component library |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### 🔑 Required API Keys

You'll need accounts and API keys from:
1. **Clerk** - [Sign up here](https://clerk.com)
2. **ImageKit** - [Sign up here](https://imagekit.io)
3. **Neon PostgreSQL** - [Sign up here](https://neon.tech)
4. **AWS S3** (Optional) - [Sign up here](https://aws.amazon.com/s3/)

### 📥 Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-username/orbitfiles.git

# Navigate to project directory
cd orbitfiles
```

### ⚙️ Environment Setup

Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

### 📦 Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 🗄️ Database Setup
```bash
# Generate Drizzle schema
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio
npm run db:studio
```

### 🚀 Run Development Server
```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 🏗️ Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure
```
orbitfiles/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── file-upload/      # File upload components
│   └── file-list/        # File listing components
├── lib/                   # Utility functions
│   ├── db/               # Database configuration
│   ├── imagekit/         # ImageKit setup
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── drizzle/              # Database schema & migrations
├── types/                # TypeScript type definitions
├── .env.local           # Environment variables
├── drizzle.config.ts    # Drizzle ORM configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tailwind.config.js   # Tailwind CSS configuration
```

---

## 🔧 Configuration

### Clerk Authentication

1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure sign-in/sign-up URLs

**Clerk Documentation:** [https://clerk.com/docs](https://clerk.com/docs)

### ImageKit Setup

1. Sign up at [ImageKit](https://imagekit.io)
2. Get your Public Key, Private Key, and URL Endpoint
3. Add credentials to `.env.local`
4. Configure upload settings in your dashboard

**ImageKit Documentation:** [https://docs.imagekit.io](https://docs.imagekit.io)

### Neon PostgreSQL

1. Create account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env.local` as `DATABASE_URL`

### Drizzle ORM

Configure `drizzle.config.ts`:
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## 🎯 Key Features Explained

### 1. File Upload System
```typescript
// Drag-and-drop with progress tracking
- Multiple file selection
- Real-time upload progress
- Error handling
- Success notifications
```

### 2. File Management
```typescript
// Organize your files efficiently
- Star/favorite files
- Move to trash
- Restore deleted files
- Permanent deletion
- File search & filtering
```

### 3. Secure Authentication
```typescript
// Clerk handles everything
- Email/password authentication
- Social OAuth (Google, GitHub, etc.)
- Session management
- Protected API routes
```

### 4. Optimized Delivery
```typescript
// ImageKit CDN integration
- Automatic image optimization
- Responsive images
- Fast global delivery
- Bandwidth optimization
```

---

## 📊 Database Schema
```typescript
// Example Drizzle schema structure
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size'),
  fileType: text('file_type'),
  isStarred: boolean('is_starred').default(false),
  isTrashed: boolean('is_trashed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## 🚦 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/files` | GET | Get all user files |
| `/api/files` | POST | Upload new file |
| `/api/files/[id]` | GET | Get file details |
| `/api/files/[id]` | PATCH | Update file (star/trash) |
| `/api/files/[id]` | DELETE | Delete file permanently |
| `/api/upload` | POST | Handle file upload |

---

## 🧪 Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🎨 UI Components

Built with **HeroUI** and styled with **Tailwind CSS**:

- 🎴 **File Cards** - Beautiful file preview cards
- 📤 **Upload Modal** - Drag-and-drop upload interface
- 🗑️ **Trash Bin** - Manage deleted files
- ⭐ **Starred Files** - Quick access to favorites
- 🔍 **Search Bar** - Find files instantly
- 📱 **Responsive Layout** - Works on all devices

---

## 🔐 Security Features

- ✅ **Authentication** - Clerk-powered secure authentication
- ✅ **Protected Routes** - Middleware protection for sensitive routes
- ✅ **Data Validation** - Zod schema validation for all inputs
- ✅ **SQL Injection Prevention** - Drizzle ORM parameterized queries
- ✅ **CORS Protection** - Configured CORS policies
- ✅ **Rate Limiting** - API rate limiting (optional)

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/orbitfiles)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add all environment variables from `.env.local` to your Vercel project settings.

### Other Platforms

- **Netlify**: Compatible with Next.js deployment
- **Railway**: Easy deployment with database hosting
- **AWS**: Deploy with Amplify or EC2

---

## 📈 Performance Optimization

- ⚡ **Next.js 14+** - Latest features and optimizations
- 🖼️ **ImageKit CDN** - Global content delivery
- 🗄️ **Neon Serverless** - Instant database scaling
- 📦 **Code Splitting** - Automatic by Next.js
- 🎯 **Edge Runtime** - Fast API responses
- 💾 **Caching** - Optimized caching strategies

---

## 🛣️ Roadmap

- [ ] **File Sharing** - Share files with other users
- [ ] **Folder Structure** - Organize files in folders
- [ ] **File Preview** - In-app file preview
- [ ] **Mobile App** - React Native mobile application
- [ ] **Collaborative Editing** - Real-time collaboration
- [ ] **Version Control** - File version history
- [ ] **Advanced Search** - Full-text search
- [ ] **Storage Analytics** - Usage statistics dashboard

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 🐛 Known Issues

- File upload size limited to 10MB (configurable)
- Bulk operations coming in future updates
- Mobile responsive design improvements ongoing

Report issues at: [GitHub Issues](https://github.com/your-username/orbitfiles/issues)

---



## 🙏 Acknowledgments


- **Clerk** - Authentication solution
- **ImageKit** - CDN and image optimization
- **Neon** - Serverless PostgreSQL
- **Vercel** - Deployment platform
- **Next.js Team** - Amazing framework

---

## 📚 Resources

### Official Documentation

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🔐 [Clerk Documentation](https://clerk.com/docs)
- 🖼️ [ImageKit Documentation](https://docs.imagekit.io)
- 🗄️ [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- 🐘 [Neon Docs](https://neon.tech/docs/introduction)
- ✅ [Zod Documentation](https://zod.dev)

### Tutorials & Guides

- [Next.js 14 Tutorial](https://nextjs.org/learn)
- [Clerk Integration Guide](https://clerk.com/docs/quickstarts/nextjs)
- [ImageKit Next.js Guide](https://docs.imagekit.io/getting-started/quickstart-guides/nextjs)

---

## 📞 Contact & Support

<div align="center">

**Need help? Have questions?**

[![GitHub Issues](https://img.shields.io/badge/Issues-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username/orbitfiles/issues)
[![Discussions](https://img.shields.io/badge/Discussions-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username/orbitfiles/discussions)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your-email@example.com)

</div>

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ by [Your Name](https://github.com/your-username)**

![GitHub Stars](https://img.shields.io/github/stars/your-username/orbitfiles?style=social)
![GitHub Forks](https://img.shields.io/github/forks/your-username/orbitfiles?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/your-username/orbitfiles?style=social)

---

*Inspired by Dropbox • Powered by Next.js • Secured by Clerk • Optimized by ImageKit*

</div>
