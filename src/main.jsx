import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTrip from './pages/CreateTrip';
import Header from './layout/Header';
import { ROUTES } from './routes';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './pages/ViewTrip/[tripId]/ViewTrip';
import Footer from './layout/Footer';
import MyTrips from './pages/MyTrips';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Community from './pages/Community';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/UserList';
import AdminPosts from './pages/Admin/AdminPosts';
import AdminGuard from './components/AdminGuard';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <>
        <Header />
        <App />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignUp />,
  },
  {
    path: ROUTES.CREATE_TRIP,
    element: (
      <>
        <Header />
        <CreateTrip />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.VIEW_TRIP,
    element: (
      <>
        <Header />
        <ViewTrip />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.MY_TRIPS,
    element: (
      <>
        <Header />
        <MyTrips />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.COMMUNITY,
    element: (
      <>
        <Header />
        <Community />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.EDIT_PROFILE,
    element: (
      <>
        <Header />
        <EditProfile />
        <Footer />
      </>
    ),
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: <AdminGuard><AdminDashboard /></AdminGuard>,
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: <AdminGuard><UserList /></AdminGuard>,
  },
  {
    path: ROUTES.ADMIN_POSTS,
    element: <AdminGuard><AdminPosts /></AdminGuard>,
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_FIREBASE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
