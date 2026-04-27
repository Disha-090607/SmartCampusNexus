# SmartCampus Nexus

SmartCampus Nexus is a full-stack smart campus management system with:

- Student interface in React
- Admin panel in Angular
- Backend APIs in Node.js + Express
- MongoDB database
- Real-time chat via Socket.io

## Project Structure

```text
SmartCampusNexus/
  backend/
  frontend-react/
  frontend-angular/
```

## Core Features

1. JWT authentication for student, faculty, admin
2. Role-based dashboards
3. Smart timetable generator with conflict detection
4. Attendance with percentage calculation
5. Assignment upload/submission with deadline handling
6. Notice board
7. Real-time chat with Socket.io
8. Result management
9. Complaint and feedback workflow
10. AI chatbot support (rule-based fallback + OpenAI placeholder)
11. Optional face attendance prototype endpoint

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB local or cloud connection string

## Step-by-Step Setup

### 0) Recommended Root Setup (Avoid Wrong Folder Issues)

From project root, install helper dependency once:

```bash
npm install
```

Then you can use:

```bash
npm run dev:backend
npm run dev:react
```

or run both together:

```bash
npm run dev:all
```

These root scripts prevent common errors like running `npm run dev` in the wrong folder.

### 1) Configure Backend

- Go to backend folder.
- Copy .env.example to .env.
- Update values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcampusnexus
JWT_SECRET=replace_with_super_secret_key
OPENAI_API_KEY=
```

- Install and run:

```bash
npm install
npm run dev
```

Backend runs on http://localhost:5000

If you see `Missing script: dev`, you are likely in the wrong directory. Use root scripts above or run inside `backend/`.

### 2) Start React Student App

- Open new terminal.
- Go to frontend-react.
- Optional: create .env from .env.example and update API URLs.
- Install and run:

```bash
npm install
npm start
```

React app runs on http://localhost:3000

### 3) Start Angular Admin App

- Open new terminal.
- Go to frontend-angular.
- Install and run:

```bash
npm install
npm start
```

Angular app runs on http://localhost:4200

## API Health Check

- GET /api/health

Expected response:

```json
{ "message": "SmartCampus Nexus API is running" }
```

## Suggested First Test Flow

1. Register one admin, one faculty, one student.
2. Login as admin and create notices + timetable.
3. Login as faculty and mark attendance / publish results.
4. Login as student and view attendance, submit assignment, raise complaint.
5. Test chat and chatbot modules.

## Notes

- Face attendance endpoint is a prototype stub. Replace with real model service for production.
- OpenAI chatbot integration is currently placeholder-friendly via OPENAI_API_KEY.
