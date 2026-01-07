import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu, LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';

function AdminSidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      id: 'users',
      label: 'Users Management',
      icon: Users,
      path: '/admin/users'
    },
    {
      id: 'posts',
      label: 'Community Posts',
      icon: FileText,
      path: '/admin/posts'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigate
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-[var(--color-border)] shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-dark)]">Admin</h1>
                <p className="text-sm text-[var(--color-muted)]">Trip Planner</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'transparent', border: 'none' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-lightgray)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <X className="w-5 h-5 text-[var(--color-muted)]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium
                      ${isActive 
                        ? 'text-[var(--color-primary)]' 
                        : 'text-[var(--color-muted)] hover:text-[var(--color-dark)]'
                      }
                    `}
                    style={{
                      backgroundColor: isActive ? 'var(--color-lightprimary)' : 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '4px solid var(--color-primary)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'var(--color-lightgray)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0 mt-auto">
          <div className="flex items-center space-x-3 p-3 bg-[var(--color-lightgray)] rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-warning)] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-dark)]">Admin User</p>
              <p className="text-xs text-[var(--color-muted)]">admin@tripplanner.com</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-3 text-[var(--color-muted)] rounded-xl transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: 'none' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fef2f2';
              e.target.style.color = 'var(--color-error)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--color-muted)';
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
