import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { completeGoogleLogin } from '../../store/authSlice';
import { supabase } from '../../lib/supabase';
import { getDashboardPath } from '../../utils/roleNavigation';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate('/login', { replace: true });
        return;
      }

      const result = await dispatch(completeGoogleLogin());

      if (completeGoogleLogin.fulfilled.match(result)) {
        navigate(getDashboardPath(result.payload.user), { replace: true });
      } else {
        navigate('/register', {
          replace: true,
          state: {
            message: 'Google account linked, complete your profile to continue.',
          },
        });
      }
    };

    handleCallback();
  }, [dispatch, navigate, location]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-600">
      Completing Google sign-in...
    </div>
  );
}

export default AuthCallbackPage;
