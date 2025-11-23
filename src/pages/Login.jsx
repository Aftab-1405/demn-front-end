import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { login } = useAuth();
  const { showSnackbar } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login - D.E.M.N';
  }, []);

  const handleSuccess = () => {
    showSnackbar('Welcome back! 🎉', 'success');
    setTimeout(() => {
      navigate('/feed');
    }, 500);
  };

  const hookResult = useAuthForm('login', login, handleSuccess);

  return (
    <AuthForm
      mode="login"
      title="Welcome Back"
      subtitle="Access your verified social network"
      submitLabel="Login Securely"
      submitLoadingLabel="Logging in..."
      linkText="Don't have an account?"
      linkPath="/register"
      linkLabel="Register Now"
      hookResult={hookResult}
    />
  );
};

export default Login;
