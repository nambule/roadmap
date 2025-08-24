# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern product roadmap application built with Next.js and Supabase that allows users to create, manage, and share roadmaps in Now/Next/Later format with objective-based swimlanes. Features a beautiful matrix layout with gradients, glassmorphism effects, multi-column spanning items, and full responsive design.

## Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Set up Supabase project and run SQL from `database-schema.sql`
3. Fill in Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`

## Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI**: Custom components with Tailwind
- **Drag & Drop**: @dnd-kit (for future implementation)
- **Export**: html2canvas + jsPDF (for future implementation)

### Database Schema
- `roadmaps` - Main roadmap entities with sharing settings
- `objectives` - Strategic objectives grouping roadmap items
- `roadmap_items` - Individual features with now/next/later status
- `comments` - User comments on roadmap items

### Key Components
- `RoadmapBoard` - Main board with controls and swimlanes
- `ObjectiveSwimLane` - Objective row with 3 status columns
- `RoadmapItem` - Individual feature cards
- `AuthGuard` - Authentication wrapper

### Authentication
- Email/password via Supabase Auth
- Row Level Security enforces ownership
- Public sharing via share tokens

## Deployment

- Configured for Vercel deployment
- Uses `@supabase/ssr` for server-side rendering
- Database migrations via SQL files
- Environment variables set in Vercel dashboard