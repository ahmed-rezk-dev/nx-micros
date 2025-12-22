import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { useAuth } from 'shell/stores';

export function App() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleSwitchToSignup = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto flex flex-col gap-8">
        {isLogin ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )}

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome to Nx Microfrontends
          </h3>
          <p className="text-sm text-gray-600">
            A modern learning platform built with microservices and module
            federation
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
