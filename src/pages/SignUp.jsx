import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FcGoogle } from "react-icons/fc"
import { Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { ROUTES } from '@/routes'
import { signUpWithEmail, signInWithGoogle } from '@/services/authService'

function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [emailError, setEmailError] = useState('')

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        // Validate email on change
        if (name === 'email') {
            if (value.trim() && !validateEmail(value)) {
                setEmailError('Email không đúng định dạng')
            } else {
                setEmailError('')
            }
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        
        const result = await signUpWithEmail(formData)
        if (result.success) {
            // Kiểm tra xem có form data từ CreateTrip không
            const savedFormData = localStorage.getItem('createTripFormData');
            if (savedFormData) {
                // Nếu có, chuyển về trang CreateTrip
                window.location.href = ROUTES.CREATE_TRIP;
            } else {
                // Nếu không, chuyển về trang chủ
                window.location.href = '/';
            }
        }
    }

    const login = useGoogleLogin({
        onSuccess: (codeRes) => GetUserProfile(codeRes),
        onError: (error) => console.error('Login Failed:', error)
    });

    const GetUserProfile = async (tokenInfo) => {
        const result = await signInWithGoogle(tokenInfo)
        if (result.success) {
            // Kiểm tra xem có form data từ CreateTrip không
            const savedFormData = localStorage.getItem('createTripFormData');
            if (savedFormData) {
                // Nếu có, chuyển về trang CreateTrip
                window.location.href = ROUTES.CREATE_TRIP;
            } else {
                // Nếu không, chuyển về trang chủ
                window.location.href = ROUTES.HOME;
            }
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-[var(--color-lightinfo)] via-[var(--color-lightsecondary)] to-[var(--color-lightprimary)] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            {/* Decorative background elements */}
            <div className='absolute top-20 left-10 w-16 h-16 rounded-full bg-[var(--color-secondary)] opacity-15 animate-pulse'></div>
            <div className='absolute top-40 right-20 w-12 h-12 rounded-full bg-[var(--color-success)] opacity-20 animate-bounce'></div>
            <div className='absolute bottom-40 left-20 w-10 h-10 rounded-full bg-[var(--color-warning)] opacity-15 animate-pulse'></div>
            <div className='absolute bottom-20 right-40 w-18 h-18 rounded-full bg-[var(--color-info)] opacity-10 animate-bounce'></div>

            <div className='max-w-md w-full space-y-8 relative z-10'>
                {/* Header */}
                <div className='text-center'>
                    <div className='flex items-center justify-center space-x-3 mb-6'>
                        <img
                            src="/logo.png"
                            alt="Trip Planner Logo"
                            className="h-12 w-12 object-contain"
                        />
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent'>
                            Trip Planner
                        </h1>
                    </div>
                    <h2 className='text-2xl font-bold text-[var(--color-dark)] mb-2'>
                        Create your account
                    </h2>
                </div>

                {/* Sign Up Form */}
                <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-300'>
                    <form onSubmit={handleSignUp} className='space-y-6'>
                        <div>
                            <label htmlFor='fullName' className='block text-sm font-medium text-[var(--color-dark)] mb-2'>
                                Full Name
                            </label>
                            <Input
                                id='fullName'
                                name='fullName'
                                type='text'
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder='Enter your full name'
                                className='w-full border-2 border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-[var(--color-dark)] mb-2'>
                                Email Address
                            </label>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Enter your email'
                                className={`w-full border-2 focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base ${
                                    emailError 
                                        ? 'border-red-500 focus:border-red-500' 
                                        : 'border-gray-300 focus:border-[var(--color-primary)]'
                                }`}
                                required
                            />
                            {emailError && (
                                <p className='text-red-500 text-sm mt-1'>{emailError}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-[var(--color-dark)] mb-2'>
                                Password
                            </label>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='Create a password'
                                className='w-full border-2 border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-[var(--color-dark)] mb-2'>
                                Confirm Password
                            </label>
                            <Input
                                id='confirmPassword'
                                name='confirmPassword'
                                type='password'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder='Confirm your password'
                                className='w-full border-2 border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base'
                                required
                            />
                        </div>

                        <div className='flex items-center'>
                            <input
                                id='agree-terms'
                                name='agree-terms'
                                type='checkbox'
                                className='h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded'
                                required
                            />
                            <label htmlFor='agree-terms' className='ml-2 block text-sm text-[var(--color-muted)]'>
                                I agree to the{' '}
                                <Link to='/terms' className='text-[var(--color-primary)] hover:text-[var(--color-primary-emphasis)]'>
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to='/privacy' className='text-[var(--color-primary)] hover:text-[var(--color-primary-emphasis)]'>
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            type='submit'
                            className='w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-emphasis)] hover:to-[var(--color-secondary-emphasis)] text-white font-semibold text-base py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0'
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300' />
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-[var(--color-muted)]'>Or continue with</span>
                            </div>
                        </div>
                    </div>

                    {/* Google Login */}
                    <div className='mt-6'>
                        <Button
                            onClick={login}
                            className='w-full flex items-center justify-center gap-3 bg-white text-[var(--color-dark)] border-2 border-gray-300 hover:bg-[var(--color-lightgray)] hover:border-[var(--color-primary)] rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md'
                        >
                            <FcGoogle className='h-6 w-6' />
                            Continue with Google
                        </Button>
                    </div>

                    {/* Login Link */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-[var(--color-muted)]'>
                            Already have an account?{' '}
                            <Link to='/login' className='font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-emphasis)]'>
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
