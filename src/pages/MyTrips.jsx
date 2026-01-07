import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/services/firebaseConfig';
import UserTripCardItem from '@/components/cMyTrips/UserTripCardItem';

function MyTrips() {
    const navigation = useNavigation();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    /**
     * Used to Get All User Trips
     * @returns 
     */
    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigation('/');
            return;
        }

        const q = query(collection(db, "AITrip"), where("userEmail", "==", user?.email));
        const querySnapshot = await getDocs(q);
        
        const trips = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            trips.push(doc.data());
        });
        
        setUserTrips(trips);
    }

    return (
        <div className='min-h-screen bg-white relative overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <div className='flex items-center justify-center space-x-4 mb-6'>
                        <div>
                            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-dark)]'>My Trips</h1>
                        </div>
                    </div>
                </div>

                {/* Trips Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {userTrips?.length > 0 ? userTrips?.map((trip, index) => (
                        <UserTripCardItem trip={trip} key={index} />
                    )) : [1,2,3,4,5,6].map((item, index) => (
                        <div key={index} className='bg-gray-200 animate-pulse rounded-3xl shadow-lg border-2 border-gray-300 flex flex-col'>
                            <div className='h-[220px] bg-gray-300 rounded-t-3xl'></div>
                            <div className='p-6 space-y-4 flex-1'>
                                <div className='h-6 bg-gray-300 rounded-lg w-3/4'></div>
                                <div className='space-y-3'>
                                    <div className='h-4 bg-gray-300 rounded-lg w-full'></div>
                                    <div className='h-4 bg-gray-300 rounded-lg w-5/6'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyTrips