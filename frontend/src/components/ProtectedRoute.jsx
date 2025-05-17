import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsFading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isFading && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a252f] z-50 transition-opacity duration-300 opacity-100">
        <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-700 rounded-full animate-spin" aria-label="Cargando"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      {children}
    </div>
  );
}