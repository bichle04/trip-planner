import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/AdminLayout';
import { FileText, MessageSquare, ThumbsUp, BarChart3, Filter } from 'lucide-react';

function AdminDashboard() {
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

  // Mock data for dashboard (expanded with month/year data)
  const allData = {
    2024: {
      1: { totalUsers: 15, newUsers: 2, totalPosts: 8, newPosts: 1, totalViews: 120, totalLikes: 25, totalComments: 12 },
      2: { totalUsers: 18, newUsers: 3, totalPosts: 10, newPosts: 2, totalViews: 145, totalLikes: 28, totalComments: 15 },
      3: { totalUsers: 20, newUsers: 2, totalPosts: 12, newPosts: 2, totalViews: 165, totalLikes: 32, totalComments: 18 },
      4: { totalUsers: 23, newUsers: 3, totalPosts: 15, newPosts: 3, totalViews: 190, totalLikes: 35, totalComments: 20 },
      5: { totalUsers: 25, newUsers: 2, totalPosts: 17, newPosts: 2, totalViews: 210, totalLikes: 38, totalComments: 23 },
      6: { totalUsers: 28, newUsers: 3, totalPosts: 19, newPosts: 2, totalViews: 235, totalLikes: 42, totalComments: 25 },
      7: { totalUsers: 30, newUsers: 2, totalPosts: 22, newPosts: 3, totalViews: 260, totalLikes: 45, totalComments: 28 },
      8: { totalUsers: 32, newUsers: 2, totalPosts: 24, newPosts: 2, totalViews: 280, totalLikes: 48, totalComments: 30 },
      9: { totalUsers: 35, newUsers: 3, totalPosts: 26, newPosts: 2, totalViews: 305, totalLikes: 52, totalComments: 33 },
      10: { totalUsers: 38, newUsers: 3, totalPosts: 28, newPosts: 2, totalViews: 330, totalLikes: 55, totalComments: 35 },
      11: { totalUsers: 40, newUsers: 2, totalPosts: 30, newPosts: 2, totalViews: 350, totalLikes: 58, totalComments: 38 },
      12: { totalUsers: 42, newUsers: 2, totalPosts: 32, newPosts: 2, totalViews: 370, totalLikes: 62, totalComments: 40 }
    },
    2025: {
      1: { totalUsers: 45, newUsers: 3, totalPosts: 35, newPosts: 3, totalViews: 395, totalLikes: 65, totalComments: 42 },
      2: { totalUsers: 48, newUsers: 3, totalPosts: 37, newPosts: 2, totalViews: 420, totalLikes: 68, totalComments: 45 },
      3: { totalUsers: 51, newUsers: 3, totalPosts: 40, newPosts: 3, totalViews: 445, totalLikes: 72, totalComments: 48 },
      4: { totalUsers: 54, newUsers: 3, totalPosts: 43, newPosts: 3, totalViews: 470, totalLikes: 75, totalComments: 50 },
      5: { totalUsers: 57, newUsers: 3, totalPosts: 46, newPosts: 3, totalViews: 495, totalLikes: 78, totalComments: 53 },
      6: { totalUsers: 60, newUsers: 3, totalPosts: 49, newPosts: 3, totalViews: 520, totalLikes: 82, totalComments: 56 },
      7: { totalUsers: 63, newUsers: 3, totalPosts: 52, newPosts: 3, totalViews: 545, totalLikes: 85, totalComments: 58 },
      8: { totalUsers: 66, newUsers: 3, totalPosts: 55, newPosts: 3, totalViews: 570, totalLikes: 88, totalComments: 61 }
    }
  };

  // Generate monthly chart data for selected year
  const getMonthlyChartData = () => {
    const yearData = allData[selectedYear] || {};
    
    if (selectedMonth === 'all') {
      // Show all months
      return months.slice(1).map(month => { // Skip "All Months"
        const monthData = yearData[month.value] || { newUsers: 0, newPosts: 0 };
        return {
          month: month.label,
          users: monthData.newUsers,
          posts: monthData.newPosts
        };
      });
    } else {
      // Show only selected month
      const monthData = yearData[selectedMonth] || { newUsers: 0, newPosts: 0 };
      const monthLabel = months.find(m => m.value === selectedMonth)?.label || selectedMonth;
      return [{
        month: monthLabel,
        users: monthData.newUsers,
        posts: monthData.newPosts
      }];
    }
  };

  const recentPosts = [
    {
      id: 1,
      user: 'Sarah Johnson',
      destination: 'Tokyo, Japan',
      content: 'Amazing trip to Tokyo! The AI suggestions were perfect...',
      likes: 234,
      comments: 18,
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'Mike Chen',
      destination: 'Paris, France',
      content: 'Honeymoon in Paris was incredible! Every recommendation...',
      likes: 189,
      comments: 25,
      time: '5 hours ago'
    },
    {
      id: 3,
      user: 'Emma Wilson',
      destination: 'Bali, Indonesia',
      content: 'Budget-friendly Bali trip with friends was amazing...',
      likes: 156,
      comments: 31,
      time: '1 day ago'
    }
  ];

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
                          style={{ width: `${Math.min((data.users / 5) * 100, 100)}%` }}
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
                          style={{ width: `${Math.min((data.posts / 4) * 100, 100)}%` }}
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
              {recentPosts.map((post) => (
                <div key={post.id} className="border border-[var(--color-border)] rounded-lg p-4 hover:bg-[var(--color-lightgray)] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-[var(--color-dark)]">{post.user}</h4>
                      <p className="text-sm text-[var(--color-primary)]">{post.destination}</p>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{post.time}</span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-[var(--color-muted)]">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-[var(--color-primary)] hover:!bg-[var(--color-lightprimary)] rounded-lg transition-colors font-medium" style={{ backgroundColor: 'transparent', border: 'none' }}>
              View All Posts
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
