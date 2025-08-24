# Roadmap Builder

A modern web application that allows users to build, manage, and share product roadmaps in a Now/Next/Later format with objective-based swimlanes.

## Features

- **Now/Next/Later Format**: Organize roadmap items across three time horizons
- **Multi-Column Spanning**: Items can span across multiple time periods (e.g., Now→Next→Later)
- **Objective-Based Swimlanes**: Group items by strategic objectives
- **Multiple View Modes**: Read-only and edit modes for different user contexts
- **Detail Levels**: Compact, standard, and rich views for different information density needs
- **Comments & Tags**: Collaborate and categorize items with comments and tags
- **Categories**: Classify items as Tech, Business, or Mixed
- **Public Sharing**: Share read-only roadmaps via public links
- **Export Options**: Export roadmaps as PNG, PDF, or CSV
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase for database and authentication
- **Deployment**: Vercel
- **UI Components**: Custom components built with Tailwind CSS
- **Drag & Drop**: @dnd-kit for reordering items
- **Export**: html2canvas and jsPDF for image/PDF export

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Quick Start

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd roadmap
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL from `database-schema.sql` in your Supabase SQL Editor
   - Get your project URL and anon key from Settings > API

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`

4. **Start development:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001)

📋 **See [SETUP.md](./SETUP.md) for detailed setup instructions**

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel app URL)
3. Deploy automatically on push to main branch

## Architecture

### Database Schema

- **roadmaps**: Main roadmap entities with title, description, and sharing settings
- **objectives**: Strategic objectives that group roadmap items
- **roadmap_items**: Individual features/initiatives with status (now/next/later)
- **comments**: User comments on roadmap items

### Key Components

- **RoadmapBoard**: Main board component with controls and layout
- **ObjectiveSwimLane**: Individual objective rows with status columns
- **RoadmapItem**: Individual feature cards with details and actions
- **AuthGuard**: Authentication wrapper for protected routes

### Authentication

Uses Supabase Auth with email/password authentication. Row Level Security (RLS) ensures users can only access their own roadmaps unless shared publicly.

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details