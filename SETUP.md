# Setup Instructions

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready (2-3 minutes)

### Run Database Schema

**For New Projects:**
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the entire contents of `database-schema.sql`
3. Click "Run" to execute the SQL

**For Existing Projects (adding spanning feature):**
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the entire contents of `database-migration-spanning.sql`
3. Click "Run" to execute the SQL migration

### Get Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy your project URL and anon public key

## 2. Local Development Setup

### Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3001](http://localhost:3001)

## 3. Verify Setup

1. Open the app in your browser
2. Try creating an account
3. Create your first roadmap
4. Add an objective and some items

## 4. Deploy to Vercel

### Connect Repository
1. Go to [vercel.com](https://vercel.com) and import your Git repository
2. Vercel will auto-detect it's a Next.js project

### Set Environment Variables
In your Vercel project settings, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key  
- `NEXT_PUBLIC_APP_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)

### Deploy
Push to your main branch and Vercel will automatically deploy.

## Troubleshooting

### Database Issues
- Make sure you're running the SQL in the Supabase SQL Editor, not a regular PostgreSQL client
- The schema includes Row Level Security policies that only work in Supabase
- If you get permission errors, make sure you're using the project owner account

### Authentication Issues
- Double-check your Supabase URL and anon key
- Make sure RLS policies were created correctly
- Check the browser network tab for 400/401 errors

### Build Issues
- Run `npm run type-check` to check for TypeScript errors
- Run `npm run build` locally to test the build process
- Check that all dependencies are installed correctly