import React from 'react';
import { Calendar, Users, Star, MapPin } from 'lucide-react';

function TripDetailsCard({ trip, rating }) {
  return (
    <div className="bg-gradient-to-r from-[var(--color-lightprimary)] to-[var(--color-lightinfo)] rounded-xl p-4 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[var(--color-dark)] text-lg">
          Trip to {trip.destination}
        </h4>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'text-[var(--color-warning)] fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="text-[var(--color-muted)]">{trip.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="text-[var(--color-muted)]">{trip.travelers} travelers</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 text-[var(--color-success)]">💰</span>
          <span className="text-[var(--color-muted)]">{trip.budget}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {trip.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border)]"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Hotels Preview */}
      {trip.hotels && trip.hotels.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <h5 className="text-sm font-medium text-[var(--color-dark)] mb-2">Recommended Hotels:</h5>
          <div className="space-y-1">
            {trip.hotels.slice(0, 2).map((hotel, idx) => (
              <div key={idx} className="text-xs text-[var(--color-muted)]">
                • {hotel.HotelName} - ⭐ {hotel.Rating} ({hotel.Price})
              </div>
            ))}
            {trip.hotels.length > 2 && (
              <div className="text-xs text-[var(--color-primary)]">
                +{trip.hotels.length - 2} more hotels
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Itinerary Preview */}
      {trip.itinerary && trip.itinerary.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <h5 className="text-sm font-medium text-[var(--color-dark)] mb-2">Trip Highlights:</h5>
          <div className="space-y-1">
            {trip.itinerary.slice(0, 3).map((day, idx) => (
              <div key={idx} className="text-xs text-[var(--color-muted)]">
                • {day.day}: {day.places?.length || 0} places to visit
              </div>
            ))}
            {trip.itinerary.length > 3 && (
              <div className="text-xs text-[var(--color-primary)]">
                +{trip.itinerary.length - 3} more days planned
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetailsCard;
