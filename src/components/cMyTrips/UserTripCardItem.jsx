import { ROUTES } from '@/routes'
import React from 'react'
import { Link } from 'react-router-dom'

function UserTripCardItem({ trip }) {
    return (
        <Link to={ROUTES.VIEW_TRIP.replace(':tripId', trip?.id)} className='group block'>
            <div className='bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[var(--color-primary)] flex flex-col'>
                <div className='relative overflow-hidden'>
                    <img 
                        src='/banaHills.png' 
                        alt={trip?.userSelection?.location}
                        className='w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-110' 
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
                        <span className='text-sm font-semibold text-[var(--color-dark)]'>{trip?.userSelection?.noOfDays} Days</span>
                    </div>
                </div>
                <div className='p-6 flex-1'>
                    <div className='flex-1'>
                        <h3 className='font-bold text-lg text-[var(--color-dark)] mb-3 line-clamp-2'>{trip?.userSelection?.location}</h3>
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <span className='text-[var(--color-primary)] text-sm'>💰</span>
                                <span className='text-sm text-[var(--color-muted)]'>{trip?.userSelection?.budget} Budget</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='text-[var(--color-secondary)] text-sm'>👥</span>
                                <span className='text-sm text-[var(--color-muted)]'>{trip?.userSelection?.traveller}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCardItem