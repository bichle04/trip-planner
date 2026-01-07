import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip }) {
    return (
        <div className='mb-12'>
            {/* Section Header */}
            <div className='flex items-center space-x-3 mb-8'>
                <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-[var(--color-dark)]'>Places to Visit</h2>
                </div>
            </div>

            {/* Itinerary */}
            <div className='space-y-12'>
                {trip?.tripData?.itinerary?.map((item, dayIndex) => (
                    <div key={dayIndex}>
                        <div className='flex items-center space-x-3 mb-6'>
                            <h3 className='text-lg md:text-xl font-bold text-orange-600'>{item?.day}</h3>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {item?.places?.map((place, placeIndex) => (
                                <div key={placeIndex}>
                                    <PlaceCardItem place={place} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlacesToVisit