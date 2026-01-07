# AI Trip Planner

A smart travel planning web application powered by Google Gemini AI, helping users create detailed itineraries based on location, budget, and preferences.

## Features

- **AI-Powered Planning**: Automatically generate detailed travel itineraries including hotels, tourist attractions, and travel times using Google Gemini AI.
- **Trip Management**: Save and review created travel plans in "My Trips".
- **Community**: Share and explore trips from the user community.
- **Google Authentication**: Secure and fast login via Google.

## Technologies Used

- **Frontend**: React, Vite
- **Styling**: Tailwind CSS, Shadcn/ui (via components library)
- **Backend / Database**: Firebase (Authentication, Firestore)
- **AI**: Google Gemini API (`gemini-2.5-pro`)
- **HTTP Client**: Axios

## Installation & Setup

### Prerequisites

- **Node.js** (latest version recommended)
- **Google Cloud Account** (for Gemini API Key)
- **Firebase Project** (for Auth and Firestore)

### Step-by-Step Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/bichle04/trip-planner.git
   cd trip-planner
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: Firebase configuration is embedded in `src/services/firebaseConfig.jsx` or you can move it to `.env` for better security.*

4. **Run the Application**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

5. **Build for Production**
   ```bash
   npm run build
   ```
