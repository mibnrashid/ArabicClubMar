# نادي العربية - Live Event App

A real-time multiple-choice event web application for ~20 attendees. Built with Next.js App Router and Firebase Firestore.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore (test mode is fine for development)
   - Copy `.env.example` to `.env.local` and fill in your Firebase config values

3. **Initialize gameState**
   - In Firebase Console, create a document:
     - Collection: `gameState`
     - Document ID: `current`
     - Fields: `currentQuestionId` (string, e.g. "q1"), `isActive` (boolean, false), `updatedAt` (string, ISO timestamp)

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   - Connect your repo to Vercel
   - Add environment variables from `.env.local`
   - Deploy

## Routes

- `/` - Redirects to `/play`
- `/play` - User experience (register, answer questions)
- `/admin67762005` - Admin dashboard (start/stop/next question, live results)

## Questions

Edit `data/questions.json` to add or modify questions. Each question needs: `id`, `text`, `options` (A–D), `correctAnswer`.
