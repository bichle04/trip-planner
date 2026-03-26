import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { ROUTES } from '@/routes';
import { FcPlus } from "react-icons/fc";
import { logout } from '@/services/authService'
import { FcStackOfPhotos } from "react-icons/fc";
import { FcImport } from "react-icons/fc";
import { FcBusinessContact } from "react-icons/fc";
import { FcManager } from "react-icons/fc";
import UserAvatar from '@/components/UserAvatar';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeRes) => GetUserProfile(codeRes),
    onError: (error) => console.error('Login Failed:', error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    })
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setOpenDialog(false);
        window.location.reload();
      })
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <a href={ROUTES.HOME} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <img 
              src="/logo.png" 
              alt="Trip Planner Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Trip Planner
            </span>
          </a>

          {/* Navigation Section */}
          <div>
            {user ? (
              <div className='flex items-center gap-4'>
                <a href={ROUTES.CREATE_TRIP}>
                  <Button 
                    variant='outline' 
                    className='flex items-center gap-2 rounded-full text-[var(--color-dark)] border-[var(--color-border)] hover:bg-[var(--color-lightinfo)] hover:text-[var(--color-primary)] hover:border-[var(--color-info)] transition-all duration-200 font-medium'
                  >
                    <FcPlus className="w-4 h-4" />
                    Create Trip
                  </Button>
                </a>
                
                <a href={ROUTES.MY_TRIPS}>
                  <Button 
                    variant='outline' 
                    className='flex items-center gap-2 rounded-full text-[var(--color-dark)] border-[var(--color-border)] hover:bg-[var(--color-lightinfo)] hover:text-[var(--color-primary)] hover:border-[var(--color-info)] transition-all duration-200 font-medium'
                  >
                    <FcStackOfPhotos className="w-4 h-4" />
                    My Trips
                  </Button>
                </a>

                <a href={ROUTES.COMMUNITY}>
                  <Button 
                    variant='outline' 
                    className='flex items-center gap-2 rounded-full text-[var(--color-dark)] border-[var(--color-border)] hover:bg-[var(--color-lightinfo)] hover:text-[var(--color-primary)] hover:border-[var(--color-info)] transition-all duration-200 font-medium'
                  >
                    <FcBusinessContact className="w-4 h-4" />
                    Community
                  </Button>
                </a>
                
                <Popover>
                  <PopoverTrigger className="border-none bg-transparent p-1 rounded-full hover:bg-[var(--color-lightgray)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all duration-200 flex items-center justify-center">
                    <UserAvatar 
                      user={user}
                      className='h-9 w-9' 
                    />
                  </PopoverTrigger>
                  <PopoverContent className='w-48 p-2 bg-white border border-[var(--color-border)] rounded-lg shadow-lg'>
                    <div className="space-y-1">
                      <a href={ROUTES.EDIT_PROFILE} className='flex items-center gap-2 w-full p-2 text-left hover:bg-[var(--color-lightgray)] rounded-md transition-colors duration-200'>
                        <FcManager className="w-4 h-4" />
                        <span className="text-[var(--color-dark)] font-medium">Edit Profile</span>
                      </a>
                      <button 
                        className='flex items-center gap-2 w-full p-2 text-left hover:bg-[var(--color-lightgray)] rounded-md transition-colors duration-200'
                        onClick={async () => {
                          try {
                            // Use authService logout
                            await logout();
                            // Sign out from Google
                            googleLogout();
                            // Reload page
                            window.location.reload();
                          } catch (error) {
                            console.error('Error signing out:', error);
                            // Still reload on error
                            window.location.reload();
                          }
                        }}
                      >
                        <FcImport className="w-4 h-4" />
                        <span className="text-[var(--color-dark)] font-medium">Sign Out</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <a href={ROUTES.LOGIN}>
                  <Button 
                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-emphasis)] hover:to-[var(--color-secondary-emphasis)] text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    Login
                  </Button>
                </a>
                <a href={ROUTES.SIGNUP}>
                  <Button 
                    variant='outline'
                    className="border-[var(--color-border)] text-[var(--color-dark)] hover:bg-[var(--color-lightgray)] hover:border-[var(--color-primary)] font-semibold px-4 py-2 rounded-full transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white border border-[var(--color-border)] rounded-2xl shadow-2xl">
          <DialogHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/logo.png" 
                alt="Trip Planner Logo" 
                className="h-12 w-12 object-contain"
              />
              <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent'>
                Trip Planner
              </DialogTitle>
            </div>
            <DialogDescription className="text-[var(--color-muted)] text-lg leading-relaxed">
              Please login to continue generating your personalized trip itinerary.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              onClick={login}
              className='w-full flex gap-3 items-center bg-white text-[var(--color-dark)] border-2 border-[var(--color-border)] hover:bg-[var(--color-lightgray)] hover:border-[var(--color-primary)] rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md'>
              <FcGoogle className='h-6 w-6' />
              Continue with Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header