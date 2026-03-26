import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
      if (userStr) user = JSON.parse(userStr);
    } catch(e) {}

    if (!user || user.role !== 'admin') {
      navigate(ROUTES.HOME || '/');
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) return null;
  return children;
}
