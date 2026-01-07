import React from 'react'
import { Link } from 'react-router-dom'

function Hotels({ trip }) {
  return (
    <div className='mb-12'>
      {/* Section Header */}
      <div className='flex items-center space-x-3 mb-8'>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-[var(--color-dark)]'>Hotel Recommendations</h2>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link 
            key={index} 
            to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.HotelName + ',' + hotel?.HotelAddress} 
            target='_blank'
            className='group'
          >
            <div className='bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[var(--color-primary)]'>
              <div className='relative overflow-hidden'>
                <img 
                  src='/hotel.jpg' 
                  alt={hotel?.HotelName}
                  className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110' 
                />
                <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg'>
                  <span className='text-sm font-semibold text-[var(--color-dark)]'>⭐ {hotel?.Rating}</span>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='font-bold text-lg text-[var(--color-dark)] mb-2 line-clamp-2'>{hotel?.HotelName}</h3>
                <div className='space-y-2'>
                  <div className='flex items-start gap-2'>
                    <span className='text-[var(--color-primary)] text-sm'>📍</span>
                    <p className='text-sm text-[var(--color-muted)] line-clamp-2'>{hotel?.HotelAddress}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-[var(--color-success)] text-sm'>💵</span>
                    <p className='text-sm font-semibold text-[var(--color-dark)]'>{hotel?.Price}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Hotels