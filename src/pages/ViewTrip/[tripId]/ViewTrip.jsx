import Hotels from '@/components/cViewTrip/Hotels';
import InfoSection from '@/components/cViewTrip/InfoSection';
import PlacesToVisit from '@/components/cViewTrip/PlacesToVisit';
import { db } from '@/services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData(tripId);
  }, [tripId]);
  const GetTripData = async (tripId) => {
    const docRef = doc(db, 'AITrip', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
      toast.error("No such trip found!");
    }
  }

  return (
    <div className='min-h-screen bg-white relative overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Information */}
        <InfoSection trip={trip} />

        {/* Recommend Hotel */}
        <Hotels trip={trip} />

        {/* Plan */}
        <PlacesToVisit trip={trip} />
      </div>
    </div>
  )
}

export default ViewTrip