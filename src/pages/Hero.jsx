import { Button } from '@/components/ui/button'
import { ROUTES } from '@/routes'
import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='relative min-h-screen flex flex-col items-center px-4 py-20 overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-[var(--color-lightinfo)] via-[var(--color-lightsecondary)] to-[var(--color-lightprimary)]'></div>
      
      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-20 h-20 rounded-full bg-[var(--color-secondary)] opacity-20 animate-pulse'></div>
      <div className='absolute top-40 right-20 w-16 h-16 rounded-full bg-[var(--color-success)] opacity-30 animate-bounce'></div>
      <div className='absolute bottom-40 left-20 w-12 h-12 rounded-full bg-[var(--color-warning)] opacity-25 animate-pulse'></div>
      <div className='absolute bottom-20 right-40 w-24 h-24 rounded-full bg-[var(--color-info)] opacity-20 animate-bounce'></div>
      
      {/* Content container */}
      <div className='relative z-10 max-w-5xl mx-auto text-center space-y-8 flex-grow flex flex-col justify-center'>
        {/* Main heading */}
        <div className='space-y-4'>
          <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl leading-tight'>
            <span className='block text-[var(--color-dark)] mb-2'>
              Discover Your Next Adventure
            </span>
            <span className='block text-[var(--color-primary)] mb-2'>
              with AI:
            </span>
            <span className='block text-[var(--color-muted)] text-3xl md:text-4xl lg:text-5xl font-semibold'>
              Personalized Itineraries at Your Fingertips
            </span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className='max-w-3xl mx-auto'>
          <p className='text-lg md:text-xl text-[var(--color-bodytext)] leading-relaxed font-medium'>
            Your personal AI-powered travel planner and advisor, creating customized itineraries tailored to your preferences and budget.
          </p>
        </div>
        
        {/* Call to action */}
        <div className='pt-8'>
          <Link to={ROUTES.CREATE_TRIP}>
            <Button className='bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-emphasis)] hover:to-[var(--color-secondary-emphasis)] text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0'>
              Get Started, It's Free
            </Button>
          </Link>
        </div>
        
        {/* Additional features highlight */}
        <div className='pt-12 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[var(--color-border)]'>
            <div className='w-12 h-12 bg-[var(--color-lightinfo)] rounded-xl flex items-center justify-center mb-4 mx-auto'>
              <div className='w-6 h-6 bg-[var(--color-info)] rounded-md'></div>
            </div>
            <h3 className='font-semibold text-[var(--color-dark)] mb-2'>AI-Powered Planning</h3>
            <p className='text-[var(--color-muted)] text-sm'>Smart algorithms create perfect itineraries based on your preferences</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[var(--color-border)]'>
            <div className='w-12 h-12 bg-[var(--color-lightsuccess)] rounded-xl flex items-center justify-center mb-4 mx-auto'>
              <div className='w-6 h-6 bg-[var(--color-success)] rounded-md'></div>
            </div>
            <h3 className='font-semibold text-[var(--color-dark)] mb-2'>Budget Optimization</h3>
            <p className='text-[var(--color-muted)] text-sm'>Plan amazing trips that fit perfectly within your budget</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[var(--color-border)]'>
            <div className='w-12 h-12 bg-[var(--color-lightwarning)] rounded-xl flex items-center justify-center mb-4 mx-auto'>
              <div className='w-6 h-6 bg-[var(--color-warning)] rounded-md'></div>
            </div>
            <h3 className='font-semibold text-[var(--color-dark)] mb-2'>Instant Results</h3>
            <p className='text-[var(--color-muted)] text-sm'>Get your personalized travel plan in just a few clicks</p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className='relative z-10 w-full bg-white/90 backdrop-blur-sm py-16 mt-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-4'>
              How It Works
            </h2>
            <p className='text-lg text-[var(--color-muted)] max-w-2xl mx-auto'>
              Creating your perfect trip is simple with our AI-powered platform
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold'>
                1
              </div>
              <h3 className='text-xl font-semibold text-[var(--color-dark)] mb-3'>Tell Us Your Preferences</h3>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                Share your destination, budget, travel dates, and preferences. Our AI will understand your unique travel style.
              </p>
            </div>
            
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-success)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold'>
                2
              </div>
              <h3 className='text-xl font-semibold text-[var(--color-dark)] mb-3'>AI Creates Your Itinerary</h3>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                Our smart algorithms analyze thousands of options to create a personalized itinerary just for you.
              </p>
            </div>
            
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-warning)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold'>
                3
              </div>
              <h3 className='text-xl font-semibold text-[var(--color-dark)] mb-3'>Enjoy Your Perfect Trip</h3>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                Get detailed suggestions for hotels, restaurants, and activities. Your dream vacation awaits!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className='relative z-10 w-full py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[var(--color-border)]'>
              <div className='text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2'>10K+</div>
              <div className='text-[var(--color-muted)] font-medium'>Trips Planned</div>
            </div>
            
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[var(--color-border)]'>
              <div className='text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-2'>50+</div>
              <div className='text-[var(--color-muted)] font-medium'>Countries</div>
            </div>
            
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[var(--color-border)]'>
              <div className='text-3xl md:text-4xl font-bold text-[var(--color-success)] mb-2'>95%</div>
              <div className='text-[var(--color-muted)] font-medium'>Satisfaction Rate</div>
            </div>
            
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-[var(--color-border)]'>
              <div className='text-3xl md:text-4xl font-bold text-[var(--color-warning)] mb-2'>24/7</div>
              <div className='text-[var(--color-muted)] font-medium'>Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className='relative z-10 w-full bg-white/90 backdrop-blur-sm py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-4'>
              What Our Customers Say
            </h2>
            <p className='text-lg text-[var(--color-muted)] max-w-2xl mx-auto'>
              Real experiences from real travelers who have used our platform
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white rounded-2xl p-8 shadow-lg border border-[var(--color-border)] hover:shadow-xl transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-bold mr-4'>
                  L
                </div>
                <div>
                  <h4 className='font-semibold text-[var(--color-dark)]'>Minh Anh Le</h4>
                  <p className='text-sm text-[var(--color-muted)]'>Tokyo, Japan</p>
                </div>
              </div>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                "Amazing experience! The AI created a perfect itinerary for my Tokyo trip. Every suggestion was spot on!"
              </p>
            </div>
            
            <div className='bg-white rounded-2xl p-8 shadow-lg border border-[var(--color-border)] hover:shadow-xl transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-success)] rounded-full flex items-center justify-center text-white font-bold mr-4'>
                  T
                </div>
                <div>
                  <h4 className='font-semibold text-[var(--color-dark)]'>Minh Hoang Tran</h4>
                  <p className='text-sm text-[var(--color-muted)]'>Paris, France</p>
                </div>
              </div>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                "Saved me hours of planning! The budget suggestions were exactly what I needed for my Paris adventure."
              </p>
            </div>
            
            <div className='bg-white rounded-2xl p-8 shadow-lg border border-[var(--color-border)] hover:shadow-xl transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-warning)] rounded-full flex items-center justify-center text-white font-bold mr-4'>
                  N
                </div>
                <div>
                  <h4 className='font-semibold text-[var(--color-dark)]'>Thu Ha Nguyen</h4>
                  <p className='text-sm text-[var(--color-muted)]'>Bali, Indonesia</p>
                </div>
              </div>
              <p className='text-[var(--color-muted)] leading-relaxed'>
                "The personalized recommendations made my Bali trip unforgettable. Highly recommend this platform!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent'></div>
    </div>
  )
}

export default Hero