import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Heart, MessageCircle, Send, MoreHorizontal, Star } from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import TripDetailsCard from '@/components/cCommunity/TripDetailsCard';

function Community() {
  const [newPost, setNewPost] = useState('');
  const [commentTexts, setCommentTexts] = useState({});
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetCommunityPosts();
  }, []);

  const GetCommunityPosts = async () => {
    try {
      // Lấy các trip từ Firebase - chỉ lấy những trip có đủ dữ liệu
      const q = query(
        collection(db, "AITrip"), 
        orderBy("id", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      
      const posts = [];
      querySnapshot.forEach((doc) => {
        const tripData = doc.data();
        // Chỉ tạo post nếu trip có đủ thông tin cơ bản
        if (tripData.userSelection?.location && tripData.tripData) {
          const post = createPostFromTrip(tripData, doc.id);
          posts.push(post);
        }
      });
      
      // Nếu không có đủ posts thực, thêm một số mock posts
      if (posts.length < 3) {
        const mockTrips = generateMockTrips();
        posts.push(...mockTrips);
      }
      
      setCommunityPosts(posts.slice(0, 10)); // Giới hạn 10 posts
    } catch (error) {
      console.error('Error fetching community posts:', error);
      // Fallback to mock data if Firebase fails
      setCommunityPosts(generateMockTrips());
    } finally {
      setLoading(false);
    }
  };

  const createPostFromTrip = (trip, docId) => {
    // Tạo mock user review và các thông tin khác
    const mockReviews = [
      "Just got back from this amazing trip! The AI planner suggestions were spot on! 🌟",
      "What an incredible adventure! Every recommendation was perfect for our budget and preferences. Highly recommend this itinerary! ✨",
      "This trip exceeded all our expectations! The places suggested were absolutely beautiful and the hotels were fantastic. Thank you AI Trip Planner! 🙌",
      "Perfect itinerary for our family vacation! The kids loved every moment and we discovered some hidden gems we never would have found otherwise. 💕",
      "Amazing experience following this AI-generated plan! Every detail was perfectly planned and executed. Will definitely use this for future trips! 🎉"
    ];

    const mockUserNames = [
      "Sarah Johnson", "Mike Chen", "Emma Wilson", "David Rodriguez", "Lisa Thompson",
      "James Kim", "Maria Garcia", "Alex Turner", "Jennifer Lee", "Robert Brown"
    ];

    const mockLocations = [
      "New York, USA", "Los Angeles, USA", "London, UK", "Toronto, Canada", "Sydney, Australia",
      "Paris, France", "Tokyo, Japan", "Berlin, Germany", "Rome, Italy", "Madrid, Spain"
    ];

    const mockAvatars = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    ];

    const randomIndex = Math.floor(Math.random() * mockUserNames.length);
    
    return {
      id: docId,
      user: {
        name: mockUserNames[randomIndex],
        avatar: mockAvatars[randomIndex % mockAvatars.length],
        location: mockLocations[randomIndex % mockLocations.length]
      },
      trip: {
        destination: trip?.userSelection?.location || 'Unknown Destination',
        duration: `${trip?.userSelection?.noOfDays || 0} days`,
        budget: trip?.userSelection?.budget || 'Not specified',
        travelers: trip?.userSelection?.traveller || '1',
        tags: generateTagsFromTrip(trip),
        hotels: trip?.tripData?.hotels?.slice(0, 3) || [],
        itinerary: trip?.tripData?.itinerary || []
      },
      content: mockReviews[randomIndex % mockReviews.length],
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      likes: Math.floor(Math.random() * 300) + 50,
      comments: Math.floor(Math.random() * 50) + 5,
      timestamp: generateRandomTimestamp(),
      isLiked: Math.random() > 0.7
    };
  };

  const generateTagsFromTrip = (trip) => {
    const allTags = ['Culture', 'Food', 'Adventure', 'Nature', 'History', 'Art', 'Romance', 'Family', 'Budget', 'Luxury', 'Beach', 'Mountains', 'City', 'Shopping'];
    const budget = trip?.userSelection?.budget?.toLowerCase();
    const destination = trip?.userSelection?.location?.toLowerCase() || '';
    
    let tags = [];
    
    // Add budget-based tag
    if (budget?.includes('cheap') || budget?.includes('budget')) tags.push('Budget');
    if (budget?.includes('luxury')) tags.push('Luxury');
    if (budget?.includes('moderate')) tags.push('Mid-range');
    
    // Add destination-based tags
    if (destination.includes('paris') || destination.includes('rome')) tags.push('Romance', 'Art');
    if (destination.includes('tokyo') || destination.includes('japan')) tags.push('Culture', 'Food');
    if (destination.includes('bali') || destination.includes('thailand')) tags.push('Adventure', 'Nature');
    if (destination.includes('new york') || destination.includes('london')) tags.push('City', 'Shopping');
    
    // Add random tags if none match
    if (tags.length < 2) {
      const shuffled = allTags.sort(() => 0.5 - Math.random());
      tags = tags.concat(shuffled.slice(0, 3 - tags.length));
    }
    
    return tags.slice(0, 3);
  };

  const generateRandomTimestamp = () => {
    const timestamps = ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago'];
    return timestamps[Math.floor(Math.random() * timestamps.length)];
  };

  const generateMockTrips = () => {
    const mockTripsData = [
      {
        id: 'mock1',
        userSelection: { location: 'Paris, France', noOfDays: 5, budget: 'Luxury', traveller: '2' },
        tripData: {
          hotels: [
            { HotelName: 'Hotel Plaza Athénée', Rating: '5', Price: '$500-800/night' },
            { HotelName: 'Le Meurice', Rating: '5', Price: '$400-700/night' }
          ],
          itinerary: [
            { day: 'Day 1', places: [{ placename: 'Eiffel Tower' }, { placename: 'Louvre Museum' }] },
            { day: 'Day 2', places: [{ placename: 'Notre-Dame' }, { placename: 'Champs-Élysées' }] }
          ]
        }
      },
      {
        id: 'mock2', 
        userSelection: { location: 'Tokyo, Japan', noOfDays: 7, budget: 'Mid-range', traveller: '1' },
        tripData: {
          hotels: [
            { HotelName: 'Hotel Gracery Shinjuku', Rating: '4', Price: '$150-250/night' }
          ],
          itinerary: [
            { day: 'Day 1', places: [{ placename: 'Senso-ji Temple' }] },
            { day: 'Day 2', places: [{ placename: 'Tokyo Skytree' }] }
          ]
        }
      },
      {
        id: 'mock3',
        userSelection: { location: 'Bali, Indonesia', noOfDays: 10, budget: 'Budget', traveller: '4' },
        tripData: {
          hotels: [
            { HotelName: 'Ubud Village Hotel', Rating: '4', Price: '$50-100/night' }
          ],
          itinerary: [
            { day: 'Day 1', places: [{ placename: 'Ubud Rice Terraces' }] }
          ]
        }
      }
    ];

    return mockTripsData.map(trip => createPostFromTrip(trip, trip.id));
  };

  const mockComments = {
    [communityPosts[0]?.id]: [
      {
        id: 1,
        user: { name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
        content: 'This looks incredible! How was the overall experience?',
        timestamp: '1 hour ago'
      },
      {
        id: 2,
        user: { name: 'Maria Garcia', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
        content: 'Adding this destination to my bucket list right now! 🙌',
        timestamp: '45 minutes ago'
      }
    ]
  };

  const handleCommentChange = (postId, value) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-lightprimary)] via-[var(--color-lightinfo)] to-[var(--color-lightsuccess)]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4">Loading Community Posts...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-lightprimary)] via-[var(--color-lightinfo)] to-[var(--color-lightsuccess)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">
            Travel Community
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Post Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-lightprimary)] to-[var(--color-lightinfo)] border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-primary)] font-bold">
              U
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your amazing trip experience with the community..."
                className="w-full p-4 border border-[var(--color-border)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                rows="3"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4 text-[var(--color-muted)]">
                  <button className="!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] flex items-center space-x-2 hover:!bg-[var(--color-lightprimary)] hover:text-[var(--color-primary)] transition-all duration-200 px-3 py-2 rounded-lg">
                    <MapPin className="w-5 h-5" />
                    <span>Add Trip</span>
                  </button>
                  <button className="!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] flex items-center space-x-2 hover:!bg-[var(--color-lightprimary)] hover:text-[var(--color-primary)] transition-all duration-200 px-3 py-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                    <span>Photos</span>
                  </button>
                </div>
                <button className="!bg-[var(--color-primary)] !text-white !border-2 !border-[var(--color-primary)] px-6 py-2 rounded-xl hover:!bg-[var(--color-primary-emphasis)] hover:!border-[var(--color-primary-emphasis)] transition-all duration-200 font-medium shadow-sm">
                  Share Trip
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {communityPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--color-dark)]">{post.user.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-[var(--color-muted)]">
                        <MapPin className="w-4 h-4" />
                        <span>{post.user.location}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] text-[var(--color-muted)] hover:!bg-[var(--color-lightprimary)] hover:text-[var(--color-primary)] transition-all duration-200 p-2 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-[var(--color-dark)] leading-relaxed">{post.content}</p>
              </div>

              {/* Trip Info Card */}
              <div className="px-6 pb-4">
                <TripDetailsCard trip={post.trip} rating={post.rating} />
              </div>

              {/* Post Images - Remove since we're using real trip data */}
              
              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className={`!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] flex items-center space-x-2 ${post.isLiked ? 'text-[var(--color-danger)] !bg-red-50 !border-red-200' : 'text-[var(--color-muted)]'} hover:!bg-red-50 hover:text-[var(--color-danger)] hover:!border-red-200 transition-all duration-200 px-3 py-2 rounded-lg`}>
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] flex items-center space-x-2 text-[var(--color-muted)] hover:!bg-[var(--color-lightprimary)] hover:text-[var(--color-primary)] hover:!border-[var(--color-primary)] transition-all duration-200 px-3 py-2 rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-6 pb-6">
                {/* Existing Comments */}
                {mockComments[post.id] && (
                  <div className="space-y-4 mb-4">
                    {mockComments[post.id].map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-[var(--color-lightgray)] rounded-2xl px-4 py-2">
                            <h5 className="font-medium text-[var(--color-dark)] text-sm">{comment.user.name}</h5>
                            <p className="text-[var(--color-muted)] text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-[var(--color-muted)]">
                            <span>{comment.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-lightprimary)] to-[var(--color-lightinfo)] border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-primary)] text-sm font-bold">
                    U
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-[var(--color-lightgray)] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white border border-transparent focus:border-[var(--color-primary)]"
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <button className="!bg-[var(--color-lightprimary)] !text-[var(--color-primary)] !border-2 !border-[var(--color-primary)] hover:!bg-[var(--color-primary)] hover:!text-white transition-all duration-200 p-2 rounded-lg shadow-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="!bg-gradient-to-r !from-[var(--color-lightprimary)] !to-[var(--color-lightinfo)] !text-[var(--color-primary)] !border-2 !border-[var(--color-primary)] px-8 py-3 rounded-xl hover:!bg-gradient-to-r hover:!from-[var(--color-primary)] hover:!to-[var(--color-secondary)] hover:!text-white transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}

export default Community;
