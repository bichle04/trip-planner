import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/AdminLayout';
import { FileText, Search, Filter, Eye, Edit, Trash2, Plus, MessageCircle, Heart, Flag } from 'lucide-react';

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with Firebase data
  useEffect(() => {
    const mockPosts = [
      {
        id: '1',
        title: 'Amazing Da Nang Trip',
        author: 'John Smith',
        authorEmail: 'user1@example.com',
        content: 'Da Nang is truly an amazing destination...',
        status: 'published',
        createdAt: new Date('2024-01-15'),
        likes: 24,
        comments: 8,
        reports: 0,
        category: 'review'
      },
      {
        id: '2',
        title: 'Hanoi Travel Experience',
        author: 'Jane Doe',
        authorEmail: 'user2@example.com', 
        content: 'Hanoi has many interesting places...',
        status: 'pending',
        createdAt: new Date('2024-01-14'),
        likes: 15,
        comments: 5,
        reports: 1,
        category: 'tips'
      },
      {
        id: '3',
        title: 'Hotel Review in Hoi An',
        author: 'Bob Johnson',
        authorEmail: 'user3@example.com',
        content: 'This hotel has beautiful views and great service...',
        status: 'published',
        createdAt: new Date('2024-01-13'),
        likes: 31,
        comments: 12,
        reports: 0,
        category: 'review'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    const statusLabels = {
      published: 'Published',
      pending: 'Pending',
      rejected: 'Rejected'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleApprove = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'published' } : post
    ));
  };

  const handleReject = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'rejected' } : post
    ));
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Community Posts Management">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Community Posts Management">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-dark)]">Community Posts</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Total Posts</p>
                <p className="text-2xl font-bold text-[var(--color-dark)]">{posts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Reports</p>
                <p className="text-2xl font-bold text-red-600">
                  {posts.reduce((sum, p) => sum + p.reports, 0)}
                </p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-lightgray)]">
                <tr>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Post</th>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Author</th>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Status</th>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Engagement</th>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Created Date</th>
                  <th className="text-left p-4 font-medium text-[var(--color-dark)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-lightgray)]/50">
                    <td className="p-4">
                      <div>
                        <h3 className="font-medium text-[var(--color-dark)] mb-1">{post.title}</h3>
                        <p className="text-sm text-[var(--color-muted)] line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-[var(--color-dark)]">{post.author}</p>
                        <p className="text-sm text-[var(--color-muted)]">{post.authorEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-4 text-sm text-[var(--color-muted)]">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        {post.reports > 0 && (
                          <div className="flex items-center space-x-1 text-red-500">
                            <Flag className="w-4 h-4" />
                            <span>{post.reports}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[var(--color-muted)]">
                        {post.createdAt.toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-lightprimary)] rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        {post.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(post.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt bài"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleReject(post.id)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-muted)]">Không có bài viết nào</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPosts;
