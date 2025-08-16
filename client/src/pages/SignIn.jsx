import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//redux
import {useDispatch,useSelector}from 'react-redux';
import {signInStart,signInSuccess,signInFailure}from '../redux/user/userSlice'
//
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user' // Default to user
  });
  const { loading,error}=useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleUserTypeChange = (userType) => {
    setFormData({
      ...formData,
      userType: userType
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      
      // Determine which API endpoint to use based on user type
      const endpoint = formData.userType === 'admin' ? '/api/admin/signin' : '/api/auth/signin';
      
      console.log('Attempting login with:', { 
        email: formData.email, 
        userType: formData.userType, 
        endpoint,
        hasPassword: !!formData.password 
      });
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      const text = await res.text();
      console.log('Response text:', text);
      
      const data = text ? JSON.parse(text) : {};
      console.log('Parsed response data:', data);

      if (data.success === false || !data) {
        const errorMessage = data.message || 'Sign-in failed';
        console.error('Login failed:', errorMessage);
        dispatch(signInFailure(errorMessage));
        return;
      }

      console.log('Login successful, user data:', data);
      dispatch(signInSuccess(data));
      console.log('Login successful, navigating...');
      
      // Redirect based on user type
      if (formData.userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Sign-in error:', err.message);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* User Type Selection */}
        <div className='flex gap-4 mb-2'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='userType'
              value='user'
              checked={formData.userType === 'user'}
              onChange={() => handleUserTypeChange('user')}
              className='text-green-600 focus:ring-green-500'
            />
            <span className='text-gray-700 font-medium'>User</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='userType'
              value='admin'
              checked={formData.userType === 'admin'}
              onChange={() => handleUserTypeChange('admin')}
              className='text-green-600 focus:ring-green-500'
            />
            <span className='text-gray-700 font-medium'>Admin</span>
          </label>
        </div>

        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
          required
        />
        
        {/* Admin credentials hint */}
        {formData.userType === 'admin' && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700'>
            <p className='font-medium'>Admin Credentials:</p>
            <p>Email: admin@gmail.com</p>
            <p>Password: admin123</p>
          </div>
        )}
        
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : `Sign In as ${formData.userType === 'admin' ? 'Admin' : 'User'}`}
        </button>
      </form>

      <OAuth />

      <div className='flex gap-2 mt-5'>
        <p>i don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
    </div>
  );
}
