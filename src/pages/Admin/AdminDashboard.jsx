import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/AdminLayout';
import { FileText, MessageSquare, ThumbsUp, BarChart3, Filter } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  // State cho filters
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Months data
  const months = [
    { value: 'all', label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Years data (current year and previous 3 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const [dashboardData, setDashboardData] = useState({});
  const [realPosts, setRealPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'Users'));
        const postsSnap = await getDocs(collection(db, 'CommunityPosts'));

        const aggregated = {};
        for (let y = currentYear - 3; y <= currentYear; y++) {
          aggregated[y] = {};
          for (let m = 1; m <= 12; m++) {
            aggregated[y][m] = { newUsers: 0, newPosts: 0, totalLikes: 0, totalComments: 0 };
          }
        }

        // Aggregate users
        usersSnap.forEach(doc => {
           const d = doc.data();
           if (d.createdAt) {
             const dt = new Date(d.createdAt);
             const y = dt.getFullYear();
             const m = dt.getMonth() + 1;
             if (aggregated[y] && aggregated[y][m]) {
                aggregated[y][m].newUsers += 1;
             }
             // Some old users might not have createdAt or have different format, we only count valid ones
           }
        });

        // Aggregate posts
        const postsList = [];
        postsSnap.forEach(docSnap => {
           const d = docSnap.data();
           const dt = d.timestamp ? new Date(d.timestamp) : new Date();
           const y = dt.getFullYear();
           const m = dt.getMonth() + 1;
           const likesCount = d.likes?.length || 0;
           const commentsCount = d.comments?.length || 0;

           if (aggregated[y] && aggregated[y][m]) {
              aggregated[y][m].newPosts += 1;
              aggregated[y][m].totalLikes += likesCount;
              aggregated[y][m].totalComments += commentsCount;
           }

           postsList.push({
             id: docSnap.id,
             ...d,
             createdAt: dt,
             likesCount,
             commentsCount
           });
        });

        setDashboardData(aggregated);
        
        // Càng mới nhất càng ở trên đầu
        postsList.sort((a,b) => b.createdAt - a.createdAt);
        setRealPosts(postsList.slice(0, 3));

      } catch(err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentYear]);

  // Generate monthly chart data for selected year
  const getMonthlyChartData = () => {
    const yearData = dashboardData[selectedYear] || {};
    
    if (selectedMonth === 'all') {
      // Show all months
      return months.slice(1).map(month => { // Skip "All Months"
        const monthData = yearData[month.value] || { newUsers: 0, newPosts: 0 };
        return {
          month: month.label,
          users: monthData.newUsers || 0,
          posts: monthData.newPosts || 0
        };
      });
    } else {
      // Show only selected month
      const monthData = yearData[selectedMonth] || { newUsers: 0, newPosts: 0 };
      const monthLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;
      return [{
        month: monthLabel,
        users: monthData.newUsers || 0,
        posts: monthData.newPosts || 0
      }];
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-dark)]">Dashboard</h1>
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Growth Chart */}
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[var(--color-muted)]" />
                <h3 className="text-lg font-bold text-[var(--color-dark)]">
                  Monthly Growth {selectedMonth !== 'all' ? `- ${months.find(m => m.value === selectedMonth)?.label}` : ''}
                </h3>
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-muted)] font-medium">Filter:</span>
                </div>
                
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="space-y-4">
              {getMonthlyChartData().map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-[var(--color-muted)] font-medium">{data.month}</div>
                  <div className="flex-1 space-y-2">
                    {/* Users Bar */}
                    <div className="flex items-center space-x-2">
                      <div className="w-20 text-xs text-[var(--color-primary)]">Users</div>
                      <div className="flex-1 bg-[var(--color-lightprimary)] rounded-full h-2">
                        <div 
                          className="bg-[var(--color-primary)] h-2 rounded-full"
                          style={{ width: `${Math.min((data.users / Math.max(1, data.users + 5)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-[var(--color-muted)]">{data.users}</div>
                    </div>
                    {/* Posts Bar */}
                    <div className="flex items-center space-x-2">
                      <div className="w-20 text-xs text-[var(--color-success)]">Posts</div>
                      <div className="flex-1 bg-[var(--color-lightsuccess)] rounded-full h-2">
                        <div 
                          className="bg-[var(--color-success)] h-2 rounded-full"
                          style={{ width: `${Math.min((data.posts / Math.max(1, data.posts + 5)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-[var(--color-muted)]">{data.posts}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--color-dark)]">Recent Community Posts</h3>
              <FileText className="w-5 h-5 text-[var(--color-muted)]" />
            </div>
            
            <div className="space-y-4">
              {realPosts.length > 0 ? realPosts.map((post) => (
                <div key={post.id} className="border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-lightgray)] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-[var(--color-dark)]">{post.userName}</h4>
                      <p className="text-sm text-[var(--color-primary)]">{post.trip?.userSelection?.location || 'No Location'}</p>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{post.createdAt.toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-[var(--color-muted)]">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-[var(--color-muted)] text-center w-full py-4">No recent posts.</div>
              )}
            </div>

            <button onClick={() => navigate('/admin/posts')} className="w-full mt-4 py-2 text-[var(--color-primary)] hover:!bg-[var(--color-lightprimary)] rounded-lg transition-colors font-medium" style={{ backgroundColor: 'transparent', border: 'none' }}>
              View All Posts
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
