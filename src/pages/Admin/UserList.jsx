import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/AdminLayout';
import { Search, Trash2, Mail, Calendar, MapPin, User, Plus, Eye, EyeOff } from 'lucide-react';
import { db } from '@/services/firebaseConfig';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import UserAvatar from '@/components/UserAvatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('=== Starting fetchUsers ===');
        console.log('Firebase db object:', db);
        
        // Lấy users từ collection Users
        console.log('Fetching from Users collection...');
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        console.log('Users collection size:', usersSnapshot.size);
        
        if (usersSnapshot.size === 0) {
          console.log('❌ No users found in Users collection');
          setUsers([]);
          return;
        }
        
        // Lấy trips từ collection AITrip
        console.log('Fetching from AITrip collection...');
        const tripsCollection = collection(db, 'AITrip');
        const tripsSnapshot = await getDocs(tripsCollection);
        console.log('AITrip collection size:', tripsSnapshot.size);
        
        // Tạo map để đếm trips cho mỗi user
        const tripCounts = {};
        tripsSnapshot.forEach((doc) => {
          const tripData = doc.data();
          console.log('Trip document:', doc.id, tripData);
          const userEmail = tripData.userEmail;
          if (userEmail) {
            tripCounts[userEmail] = (tripCounts[userEmail] || 0) + 1;
          }
        });
        
        console.log('Trip counts by email:', tripCounts);
        
        const usersData = [];
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log('Processing user document:', doc.id, userData);
          
          const userEmail = userData.email;
          const tripCount = tripCounts[userEmail] || 0;
          
          usersData.push({
            id: doc.id,
            name: userData.fullName || userData.name || userData.displayName || userData.given_name || 'N/A',
            role: userData.role || 'user',
            email: userData.email || 'N/A',
            joinDate: userData.createdAt ? userData.createdAt.toDate() : new Date(),
            tripCount: tripCount,
            status: userData.isActive !== false ? 'Active' : 'Inactive',
            avatar: userData.picture || userData.photoURL || userData.image || 'https://via.placeholder.com/40'
          });
        });
        
        // Sắp xếp theo tên
        usersData.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log('✅ Final processed users data:', usersData);
        console.log(`Found ${usersData.length} users from Users collection`);
        setUsers(usersData);
        
      } catch (error) {
        console.error('❌ Critical error in fetchUsers:', error);
        setUsers([]);
      } finally {
        setLoading(false);
        console.log('=== fetchUsers completed ===');
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
  };

  // Handle input changes for new user form
  const handleInputChange = (field, value) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle add user form submission
  const handleAddUser = async () => {
    if (!newUserData.fullName || !newUserData.email) return;
    try {
      await addDoc(collection(db, 'Users'), {
        fullName: newUserData.fullName,
        email: newUserData.email,
        createdAt: new Date(),
        role: 'user',
        isActive: true
      });
      toast?.success('User added successfully!');
      
      setNewUserData({ fullName: '', email: '', password: '' });
      setIsAddUserModalOpen(false);
      setShowPassword(false);
      window.location.reload(); // Reload to refresh the user list
    } catch (error) {
      toast?.error('Error adding user!');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xoá tài khoản này không? (Chỉ xoá trên Database)')) return;
    try {
      await deleteDoc(doc(db, 'Users', userId));
      setUsers(users.filter(u => u.id !== userId));
      toast?.success('User deleted!');
    } catch (error) {
      toast?.error('Error deleting user!');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'Users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast?.success(`Role updated to ${newRole === 'admin' ? 'Admin' : 'User'}`);
    } catch(err) {
      toast?.error('Error updating role');
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsAddUserModalOpen(false);
    setNewUserData({ fullName: '', email: '', password: '' });
    setShowPassword(false);
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout currentPage="users" title="Users Management">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading user data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="users" title="Users Management">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
            </div>
            <Button
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {users.filter(u => u.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Inactive</p>
                <p className="text-2xl font-bold text-red-900">
                  {users.filter(u => u.status === 'Inactive').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Total Trips</p>
                <p className="text-2xl font-bold text-purple-900">
                  {users.reduce((total, user) => total + user.tripCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Users List
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trips Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          <UserAvatar user={{...user, picture: user.avatar}} className="h-10 w-10 text-lg" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {user.joinDate instanceof Date 
                          ? user.joinDate.toLocaleDateString('en-US')
                          : new Date(user.joinDate).toLocaleDateString('en-US')
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {user.tripCount} trips
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.status)}>
                        {user.status === 'Active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-200 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {users.length === 0 ? 'No users yet' : 'No users found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {users.length === 0 
                  ? 'No users have registered in the system yet.'
                  : 'Try changing the search keywords or removing filters.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>

        {/* Add User Modal */}
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Create New User
              </DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={newUserData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUserData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={newUserData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Password should be at least 8 characters, including uppercase, lowercase and numbers.
                </p>
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
                onClick={handleAddUser}
                disabled={!newUserData.fullName || !newUserData.email || !newUserData.password}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserList;
