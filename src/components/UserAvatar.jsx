import React from 'react';

export default function UserAvatar({ user, className = "w-10 h-10 text-lg" }) {
  const avatarUrl = user?.avatar || user?.picture || user?.photoURL || null;
  const name = user?.name || user?.fullName || user?.displayName || user?.userName || 'User';
  const initial = name.charAt(0).toUpperCase();

  const isPlaceholder = !avatarUrl || avatarUrl.includes('via.placeholder.com') || avatarUrl.includes('source.unsplash.com');

  if (!isPlaceholder) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${className} rounded-full object-cover border border-[var(--color-border)]`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div 
      className={`rounded-full border border-[var(--color-border)] bg-[var(--color-lightprimary)] text-[var(--color-primary)] flex items-center justify-center font-bold ${className}`}
      style={{ minWidth: className.split(' ').find(c => c.startsWith('w-'))?.replace('w-', '') * 0.25 + 'rem' }}
    >
      {initial}
    </div>
  );
}
