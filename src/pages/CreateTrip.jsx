import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AutocompleteInput from '@/components/ui/autocomplete-input';
import { SelectBudgeOptions, SelectTravelerList, PopularDestinations, AI_PROMT } from '@/constants/option';
import { GetTripData } from '@/services/AIModel';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

function CreateTrip() {
  const [place, setPlace] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);

  // Khôi phục form data từ localStorage khi component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('createTripFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setPlace(parsedData.location || '');
      // Xóa dữ liệu đã lưu sau khi khôi phục
      localStorage.removeItem('createTripFormData');
    }
  }, []);

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Lưu form data trước khi chuyển hướng
      localStorage.setItem('createTripFormData', JSON.stringify(formData));
      // Chuyển hướng đến trang Login
      navigate(ROUTES.LOGIN);
      return;
    }

    if (formData?.noOfDays > 14 || !formData?.noOfDays || !formData?.location || !formData?.budget || !formData?.traveller) {
      if (formData?.noOfDays > 14) {
        toast.error("Please Enter number of days less than or equal to 14!")
      }
      if (!formData?.noOfDays || !formData?.location || !formData?.budget || !formData?.traveller) {
        toast.error("Please fill all details!")
      }
      return;
    }

    setLoading(true);

    const FINAL_PROMT = AI_PROMT.replace('{location}', formData?.location)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveller)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);

    try {
      const result = await GetTripData(FINAL_PROMT);
      toast.success("Trip generated successfully!");
      SaveAITrip(result);
    } catch (error) {
      console.error('Error generating trip:', error);
      toast.error("Failed to generate trip. Please try again!");
    } finally {
      setLoading(false);
    }
  }

  const SaveAITrip = async (tripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrip", docId), {
      userSelection: formData,
      tripData: JSON.parse(tripData),
      userEmail: user?.email,
      userUid: user?.uid,  // Thêm UID từ Firebase Auth
      id: docId
    });

    setLoading(false);
    navigate(`/view-trip/${docId}`);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[var(--color-lightinfo)] via-[var(--color-lightsecondary)] to-[var(--color-lightprimary)] relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-20 left-10 w-16 h-16 rounded-full bg-[var(--color-secondary)] opacity-15 animate-pulse'></div>
      <div className='absolute top-40 right-20 w-12 h-12 rounded-full bg-[var(--color-success)] opacity-20 animate-bounce'></div>
      <div className='absolute bottom-40 left-20 w-10 h-10 rounded-full bg-[var(--color-warning)] opacity-15 animate-pulse'></div>
      <div className='absolute bottom-20 right-40 w-18 h-18 rounded-full bg-[var(--color-info)] opacity-10 animate-bounce'></div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-[var(--color-border)] max-w-6xl mx-auto'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-[var(--color-dark)] mb-4'>
              Tell us your travel preferences
            </h2>
            <p className='text-base md:text-lg text-[var(--color-bodytext)] leading-relaxed max-w-4xl mx-auto'>
              Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl border border-[var(--color-border)] max-w-6xl mx-auto'>
          {/* Basic Information Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
            {/* Destination Selection */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>1</span>
                </div>
                <h2 className='text-lg md:text-xl font-semibold text-[var(--color-dark)]'>What is destination of choice?</h2>
              </div>
              <div className='bg-[var(--color-lightgray)] rounded-xl p-4 border border-[var(--color-border)]'>
                <AutocompleteInput
                  suggestions={PopularDestinations}
                  placeholder="Search for destinations..."
                  value={place}
                  onChange={(value) => { setPlace(value); handleInputChange('location', value) }}
                  className="border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base"
                />
              </div>
            </div>

            {/* Trip Duration */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-success)] rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>2</span>
                </div>
                <h2 className='text-lg md:text-xl font-semibold text-[var(--color-dark)]'>How many days are you planning your trip?</h2>
              </div>
              <div className='bg-[var(--color-lightgray)] rounded-xl p-4 border border-[var(--color-border)]'>
                <Input 
                  placeholder={'Ex. 3'} 
                  type='number'
                  value={formData?.noOfDays || ''}
                  className='border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] text-[var(--color-dark)] bg-white rounded-lg h-12 text-base'
                  onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Budget Selection */}
          <div className='space-y-6 mb-12'>
            <div className='flex items-center space-x-3 mb-6'>
              <div className='w-8 h-8 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-warning)] rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>3</span>
              </div>
              <h2 className='text-lg md:text-xl font-semibold text-[var(--color-dark)]'>What is Your Budget?</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {SelectBudgeOptions.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`px-6 py-4 bg-white rounded-xl cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:scale-102 hover:border-[var(--color-primary)]
                  ${formData?.budget === item.title ? 'shadow-lg border-[var(--color-primary)] bg-[var(--color-lightprimary)]' : 'border-[var(--color-border)] hover:border-[var(--color-secondary)]'}`}>
                  <div className='flex items-center space-x-4'>
                    <div className='text-4xl flex-shrink-0'>{item.icon}</div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-base text-[var(--color-dark)] mb-1 leading-tight'>{item.title}</h3>
                      <p className='text-sm text-[var(--color-muted)] leading-relaxed'>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Companions */}
          <div className='space-y-6 mb-8'>
            <div className='flex items-center space-x-3 mb-6'>
              <div className='w-8 h-8 bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-error)] rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>4</span>
              </div>
              <h2 className='text-lg md:text-xl font-semibold text-[var(--color-dark)]'>Who do you plan on traveling with on your next adventure?</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {SelectTravelerList.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('traveller', item.people)}
                  className={`px-6 py-4 bg-white rounded-xl cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:scale-102 hover:border-[var(--color-secondary)]
                  ${formData?.traveller === item.people ? 'shadow-lg border-[var(--color-secondary)] bg-[var(--color-lightsecondary)]' : 'border-[var(--color-border)] hover:border-[var(--color-info)]'}`}>
                  <div className='flex items-center space-x-4'>
                    <div className='text-4xl flex-shrink-0'>{item.icon}</div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-base text-[var(--color-dark)] mb-1 leading-tight'>{item.title}</h3>
                      <p className='text-sm text-[var(--color-muted)] leading-relaxed'>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className='bg-[var(--color-lightgray)] rounded-xl p-6 border border-[var(--color-border)] mb-8'>
            <div className='flex items-center justify-center space-x-6 md:space-x-8'>
              <div className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${formData?.location ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`}></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${formData?.location ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}>Destination</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${formData?.noOfDays ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`}></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${formData?.noOfDays ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}>Duration</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${formData?.budget ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`}></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${formData?.budget ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}>Budget</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${formData?.traveller ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`}></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${formData?.traveller ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}>Travelers</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className='text-center'>
            <Button
              disabled={loading}
              onClick={OnGenerateTrip}
              className='bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-emphasis)] hover:to-[var(--color-secondary-emphasis)] text-white font-semibold text-base px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
              {loading ? (
                <div className='flex items-center space-x-2'>
                  <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin' />
                  <span>Generating Your Perfect Trip...</span>
                </div>
              ) : (
                <span>Generate Trip</span>
              )}
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreateTrip