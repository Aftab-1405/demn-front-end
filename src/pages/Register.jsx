import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const { register } = useAuth();
  const { showSnackbar } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register - D.E.M.N';
  }, []);

  const handleSuccess = () => {
    showSnackbar('Account created successfully! Welcome! 🎉', 'success');
    setTimeout(() => {
      navigate('/feed');
    }, 500);
  };

  const hookResult = useAuthForm('register', register, handleSuccess);

  return (
    <AuthForm
      mode="register"
      title="Join D.E.M.N"
      subtitle="Become part of the truth-verified community"
      submitLabel="Create Account"
      submitLoadingLabel="Creating Account..."
      linkText="Already have an account?"
      linkPath="/login"
      linkLabel="Login"
      hookResult={hookResult}
    />
  );
};

export default Register;
