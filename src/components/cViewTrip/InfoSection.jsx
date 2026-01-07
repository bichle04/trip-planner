import React, { useState } from 'react'
import { FcPlanner } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { FcSportsMode } from "react-icons/fc";
import { GrSend } from "react-icons/gr";
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';

function InfoSection({ trip }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [caption, setCaption] = useState('');

  const handleShareTrip = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
    setCaption('');
  };

  const handlePostToCommunnity = () => {
    // TODO: Implement actual posting logic
    console.log('Posting to community:', {
      caption,
      trip: trip
    });
    
    // Reset and close modal
    setCaption('');
    setIsShareModalOpen(false);
    
    // You can add success toast here
    // toast.success('Trip shared to community successfully!');
  };
  return (
    <div className='mb-12'>
      {/* Hero Image */}
      <div className='relative rounded-3xl overflow-hidden shadow-xl mb-8'>
        <img 
          src='/trips.jpg' 
          alt='Trip' 
          className='w-full h-[300px] md:h-[400px] object-cover' 
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>
        <div className='absolute bottom-6 left-6 text-white'>
          <h1 className='text-3xl md:text-4xl font-bold mb-2'>{trip?.userSelection?.location}</h1>
        </div>
      </div>

      {/* Trip Details */}
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8'>
        <div className='flex-1'>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2 bg-[var(--color-lightprimary)] px-4 py-2 rounded-xl border border-[var(--color-primary)]'>
              <FcPlanner className='text-xl' />
              <span className='font-medium text-[var(--color-dark)]'>{trip?.userSelection?.noOfDays} Days</span>
            </div>
            <div className='flex items-center gap-2 bg-[var(--color-lightsecondary)] px-4 py-2 rounded-xl border border-[var(--color-secondary)]'>
              <FcMoneyTransfer className='text-xl' />
              <span className='font-medium text-[var(--color-dark)]'>{trip?.userSelection?.budget} Budget</span>
            </div>
            <div className='flex items-center gap-2 bg-[var(--color-lightsuccess)] px-4 py-2 rounded-xl border border-[var(--color-success)]'>
              <FcSportsMode className='text-xl' />
              <span className='font-medium text-[var(--color-dark)]'>{trip?.userSelection?.traveller} Travelers</span>
            </div>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <Button 
            onClick={handleShareTrip}
            className='bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-emphasis)] hover:to-[var(--color-secondary-emphasis)] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0'
          >
            <GrSend className='mr-2' />
            Share Trip
          </Button>
        </div>
      </div>

      {/* Share to Community Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <GrSend className="w-5 h-5 text-blue-600" />
              Share Trip to Community
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Share your travel experience with the community to help others discover amazing travel ideas!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Caption Input */}
            <div className="space-y-2">
              <label htmlFor="caption" className="text-sm font-medium text-gray-700">
                Share your thoughts about this trip *
              </label>
              <textarea
                id="caption"
                placeholder="Share your experience, interesting spots, or helpful tips about this trip..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              />
              <p className="text-xs text-gray-500">
                Share real experiences, favorite places, or advice for other travelers.
              </p>
            </div>

            {/* Trip Details Card Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Trip details to be shared
              </label>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                {/* Trip Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src='/trips.jpg' 
                      alt='Trip thumbnail' 
                      className='w-full h-full object-cover' 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {trip?.userSelection?.location || 'Location not specified'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Trip created by AI Trip Planner
                    </p>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{trip?.userSelection?.noOfDays || 0} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>{trip?.userSelection?.budget || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>{trip?.userSelection?.traveller || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Detailed itinerary</span>
                  </div>
                </div>

                {/* Preview Notice */}
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 Detailed information about hotels, attractions, and itinerary will be included in the post.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostToCommunnity}
              disabled={!caption.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <GrSend className="w-4 h-4" />
              Post to Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InfoSection