import React from 'react'
import { Link } from 'react-router-dom'

function PlaceCardItem({ place }) {
    return (
        <Link 
            to={'https://www.google.com/maps/search/?api=1&query=' + place?.placename} 
            target='_blank'
            className='group block'
        >
            <div className='bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[var(--color-primary)] cursor-pointer'>
                <div className='flex flex-col sm:flex-row'>
                    <div className='relative overflow-hidden sm:w-40 sm:flex-shrink-0'>
                        <img 
                            src='/banaHills.png' 
                            alt={place?.placename}
                            className='w-full h-40 sm:h-full object-cover transition-transform duration-300 group-hover:scale-110' 
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                    <div className='p-4 flex-1'>
                        <h3 className='font-bold text-lg text-[var(--color-dark)] mb-2 line-clamp-2'>{place?.placename}</h3>
                        <p className='text-sm text-[var(--color-muted)] leading-relaxed mb-3 line-clamp-3'>{place?.PlaceDetails}</p>
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <span className='text-[var(--color-info)] text-sm'>🕓</span>
                                <span className='text-sm text-[var(--color-dark)] font-medium'>{place?.timeTravel}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='text-[var(--color-success)] text-sm'>💵</span>
                                <span className='text-sm text-[var(--color-dark)] font-medium'>{place?.ticketPricing}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PlaceCardItem