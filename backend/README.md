# SmartCampus Nexus Backend

Express + MongoDB backend for SmartCampus Nexus.

## Run

```bash
npm install
npm run dev
```

## Environment

Create .env from .env.example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcampusnexus
JWT_SECRET=replace_with_super_secret_key
OPENAI_API_KEY=
```

## Main API Groups

- /api/auth
- /api/dashboard
- /api/timetables
- /api/attendance
- /api/assignments
- /api/notices
- /api/chat
- /api/results
- /api/complaints
- /api/chatbot
- /api/face

## Socket Events

- join_room
- send_message
- receive_message
