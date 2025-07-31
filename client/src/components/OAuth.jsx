import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
    //   const data = await res.json();
    //   dispatch(signInSuccess(data));
    //   navigate('/');
    // } catch (error) {
    //   console.log('could not sign in with google', error);
    // }
    const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok || !data) {
        throw new Error(data?.message || 'Google sign-in failed');
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Could not sign in with Google:', error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='w-full bg-red-700 text-white p-3 mt-10 rounded-lg uppercase hover:opacity-95'
    >
       Continue with google 
    </button>
  );
}
