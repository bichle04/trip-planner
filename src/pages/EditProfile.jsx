import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '@/services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'sonner';
import UserAvatar from '@/components/UserAvatar';

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      setFormData({
        fullName: u.fullName || u.name || '',
        email: u.email || '',
        profilePicture: u.picture || u.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = () => {
    // Mock function - chỉ tạo giao diện
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            profilePicture: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      // Đổi mật khẩu nếu có nhập (chỉ áp dụng cho user login bằng email)
      if (formData.newPassword) {
        if (user.loginMethod !== 'email') {
          return toast?.error('Google accounts cannot change password here.');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          return toast?.error('New passwords do not match!');
        }
        if (!formData.currentPassword) {
          return toast?.error('Please enter current password!');
        }
        
        const currentUserAuth = auth.currentUser;
        if (currentUserAuth) {
          try {
            const credential = EmailAuthProvider.credential(currentUserAuth.email, formData.currentPassword);
            await reauthenticateWithCredential(currentUserAuth, credential);
            await updatePassword(currentUserAuth, formData.newPassword);
            toast?.success('Password changed successfully!');
            // Reset fields
            setFormData(prev => ({...prev, currentPassword: '', newPassword: '', confirmPassword: ''}));
          } catch(err) {
            console.error(err);
            return toast?.error('Incorrect current password or authentication error!');
          }
        } else {
          return toast?.error('Firebase auth session not found. Please log in again.');
        }
      }

      // Cập nhật lên Firebase Firestore
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        picture: formData.profilePicture,
      });

      // Cập nhật localStorage
      const updatedUser = { ...user, fullName: formData.fullName, picture: formData.profilePicture };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast?.success('Profile updated successfully!');
    } catch(err) {
      toast?.error('Error saving changes!');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[var(--color-lightgray)] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--color-muted)]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-dark)]">Edit Profile</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="p-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-lightgray)] flex items-center justify-center">
                  <UserAvatar 
                    user={{...user, fullName: formData.fullName, picture: formData.profilePicture}} 
                    className="w-32 h-32 text-4xl" 
                  />
                </div>
                <button
                  onClick={handleImageUpload}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary)]/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-semibold text-[var(--color-dark)]">{formData.fullName}</h3>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-[var(--color-dark)] mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-lightgray)] text-[var(--color-muted)] transition-all cursor-not-allowed"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mảng Change Password - Chỉ hiển thị nếu login bằng email */}
              {user?.loginMethod === 'email' && (
              <div className="border-t border-[var(--color-border)] pt-6">
                <h4 className="text-lg font-semibold text-[var(--color-dark)] mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                  Change Password
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-dark)]"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-dark)]"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-dark)] mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-dark)]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}



            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-[var(--color-border)]">
              <button
                onClick={handleSave}
                className="flex-1 bg-[var(--color-primary)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-[var(--color-lightgray)] text-[var(--color-dark)] py-3 px-6 rounded-lg hover:bg-[var(--color-muted)]/20 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
