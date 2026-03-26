import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, arrayUnion, arrayRemove, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import TripDetailsCard from '@/components/cCommunity/TripDetailsCard';
import { toast } from 'sonner';
import UserAvatar from '@/components/UserAvatar';

function Community() {
  const [newPost, setNewPost] = useState('');
  const [commentTexts, setCommentTexts] = useState({});
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }

    const q = query(
      collection(db, "CommunityPosts"), 
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((docSnap) => {
        posts.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCommunityPosts(posts);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateTextPost = async () => {
    if (!currentUser) return toast?.error('Please log in first!');
    if (!newPost.trim()) return;
    
    try {
      await addDoc(collection(db, 'CommunityPosts'), {
        userId: currentUser.uid,
        userName: currentUser.fullName || currentUser.email?.split('@')[0] || 'User',
        userAvatar: currentUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        content: newPost,
        trip: null,
        likes: [],
        comments: [],
        timestamp: new Date().toISOString()
      });
      setNewPost('');
      toast?.success('Post created successfully!');
    } catch (error) {
      toast?.error('Error creating post!');
    }
  };

  const handleLike = async (postId, currentLikes) => {
    if (!currentUser) return toast?.error('Please log in first!');
    const postRef = doc(db, 'CommunityPosts', postId);
    const isLiked = currentLikes?.includes(currentUser.uid);
    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (e) { console.error(e) }
  };

  const handleCommentSubmit = async (postId) => {
    if (!currentUser) return toast?.error('Please log in first!');
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    
    const postRef = doc(db, 'CommunityPosts', postId);
    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          userId: currentUser.uid,
          userName: currentUser.fullName || currentUser.email?.split('@')[0] || 'User',
          userAvatar: currentUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          content: text.trim(),
          timestamp: new Date().toISOString()
        })
      });
      setCommentTexts(prev => ({...prev, [postId]: ''}));
    } catch (e) { toast?.error('Error commenting'); }
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
            <div className="flex-shrink-0 flex items-center justify-center">
              <UserAvatar user={currentUser} className="w-12 h-12 text-xl" />
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
                <button 
                  onClick={handleCreateTextPost}
                  className="!bg-[var(--color-primary)] !text-white !border-2 !border-[var(--color-primary)] px-6 py-2 rounded-xl hover:!bg-[var(--color-primary-emphasis)] hover:!border-[var(--color-primary-emphasis)] transition-all duration-200 font-medium shadow-sm">
                  Share Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {communityPosts.map((post) => {
            const isLiked = currentUser && post.likes?.includes(currentUser.uid);
            const likeCount = post.likes?.length || 0;
            const commentCount = post.comments?.length || 0;
            const formattedDate = new Date(post.timestamp).toLocaleDateString();

            return (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar 
                      user={{ name: post.userName, avatar: post.userAvatar }} 
                      className="w-12 h-12 text-xl" 
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--color-dark)]">{post.userName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-[var(--color-muted)]">
                        <span>{formattedDate}</span>
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
              {post.trip && post.trip.userSelection && (
                <div className="px-6 pb-4">
                  <TripDetailsCard trip={{
                    destination: post.trip.userSelection.location,
                    duration: `${post.trip.userSelection.noOfDays || 0} days`,
                    budget: post.trip.userSelection.budget,
                    travelers: post.trip.userSelection.traveller,
                    hotels: post.trip.tripData?.hotels?.slice(0, 3) || [],
                    itinerary: post.trip.tripData?.itinerary || [],
                    tags: [post.trip.userSelection.budget]
                  }} rating={5} />
                </div>
              )}

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button onClick={() => handleLike(post.id, post.likes)} className={`flex items-center space-x-2 transition-all duration-200 px-3 py-2 rounded-lg border-2 ${isLiked ? '!bg-red-50 !border-red-500 !text-red-500' : '!bg-white !border-red-400 !text-red-500 hover:!bg-red-50 hover:!border-red-500'}`}>
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="!text-gray-700 font-medium">{likeCount}</span>
                    </button>
                    <button className="!bg-[var(--color-lightgray)] !border !border-[var(--color-border)] flex items-center space-x-2 text-[var(--color-muted)] hover:!bg-[var(--color-lightprimary)] hover:text-[var(--color-primary)] hover:!border-[var(--color-primary)] transition-all duration-200 px-3 py-2 rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                      <span>{commentCount}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-6 pb-6">
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <UserAvatar 
                          user={{ name: comment.userName, avatar: comment.userAvatar }} 
                          className="w-8 h-8 text-sm" 
                        />
                        <div className="flex-1">
                          <div className="bg-[var(--color-lightgray)] rounded-2xl px-4 py-2 inline-block">
                            <h5 className="font-bold text-[var(--color-dark)] text-sm">{comment.userName}</h5>
                            <p className="text-[var(--color-dark)] text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-[var(--color-muted)] px-2">
                            <span>{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <UserAvatar user={currentUser} className="w-8 h-8 text-sm" />
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-[var(--color-lightgray)] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white border border-transparent focus:border-[var(--color-primary)]"
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(post.id); }}
                    />
                    <button 
                      onClick={() => handleCommentSubmit(post.id)}
                      className="!bg-[var(--color-lightprimary)] !text-[var(--color-primary)] !border-2 !border-[var(--color-primary)] hover:!bg-[var(--color-primary)] hover:!text-white transition-all duration-200 p-2 rounded-lg shadow-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})}
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
