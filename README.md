# 🏀 Sports Matchmaking App (MERN)

A full-stack MERN application that allows users to:
- Sign up / Log in (with authentication & protected routes)
- Create and join sports matches
- Choose teams (A / B) while joining
- Host can start matches using a secure 4-digit PIN
- Players can update scores during matches
- Host can end matches → stats are updated (wins/losses, match history)
- Chat with other participants in real-time (via Socket.io)

---

## ⚙️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- React Router DOM
- Socket.io Client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (`jsonwebtoken`)
- bcrypt.js (password hashing)
- dotenv (environment variables)
- cookie-parser (auth cookies)
- cors, helmet (security)
- multer + cloudinary (image uploads, optional for avatars)
- socket.io (real-time events)

---

## 🚀 Setup & Installation

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/sports-matchmaking-app.git
cd sports-matchmaking-app
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create `.env` file in `backend/`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sports-app
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

#### Run backend
```bash
npm run dev
```
Backend runs on [http://localhost:5000](http://localhost:5000)

---

### 3. Frontend Setup
```bash
cd frontend
npm install
```
#### Run frontend
```bash
npm run dev
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

---

## 🔑 Authentication Flow
1. Users can **Sign Up** → redirected to Login
2. Users **Login** → JWT stored in cookies
3. Protected routes (Home, Match pages) are accessible only if logged in
4. Logout clears cookies and redirects to login page

---

## 🏆 Match Flow
1. Host creates a match → it appears in **Home feed**
2. Other users can **Join** match (choose Team A or B)
3. Inside Match page:
   - Host can **Start Match** (via 4-digit PIN)
   - Players can **Update Scores**
   - Scores are shown in real-time
4. Host **Ends Match**
   - Winner is determined automatically
   - Players’ win/loss stats are updated

---

## 📊 User Stats
- Matches Played
- Wins
- Losses
- Match History

---

## 🛠️ Deployment
- **Backend**: Render / Railway / Heroku
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas
- Set correct **CORS + environment variables** in production

---

## 🤝 Contributing
1. Fork project
2. Create feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m "Add awesome feature"`)
4. Push to branch (`git push origin feature/awesome`)
5. Open a Pull Request

