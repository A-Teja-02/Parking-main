# Parking Reservation System

An internal company parking reservation application built with a FastAPI (Python) backend and a React (TypeScript) + Vite frontend.

## Features
- **Interactive Parking Map**: View and reserve parking spots in real-time.
- **Admin Dashboard**: Manage floors, slots, users, and reservations.
- **Role-based Access**: Custom interfaces for Employees, Managers, and HR/Admin.
- **Automatic Releases**: Managers can release their assigned slots for others to book.

## Project Structure
- `/client`: Frontend codebase (React, Vite, Tailwind CSS / Vanilla CSS).
- `/server`: Backend API (FastAPI, SQLite / local JSON database).
- `render.yaml`: Configuration for deploying the backend service to Render.

## Getting Started

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database (optional):
   ```bash
   python seed.py
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

Refer to the [Deployment Guide](deployment_guide.md) for full instructions on deploying the backend to Render and the frontend to Vercel.
