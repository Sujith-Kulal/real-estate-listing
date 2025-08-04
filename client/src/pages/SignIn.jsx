import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//redux
import {useDispatch,useSelector}from 'react-redux';
import {signInStart,signInSuccess,signInFailure}from '../redux/user/userSlice'
//
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading,error}=useSelector((state)=>state.user);
  const navigate = useNavigate();
   const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      // const data = await res.json();
       const data = text ? JSON.parse(text) : {};
      console.log('Response from backend:',data);

      if (data.success === false|| !data) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message || 'Sign-in failed'));
        return;
      }

      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      console.log('Login successful, navigating...');
      navigate('/');
    } catch (err) {
      // setLoading(false);
      // setError(err.message);
       console.error('Sign-in error:', err.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        /> */}
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <OAuth />

      <div className='flex gap-2 mt-5'>
        <p>i don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>

    {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  );
}

















// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
//  import OAuth from '../components/OAuth';
// //---------------inside ------------------------------------------------
// // export default function SignUp() {
// //   const [formData,setForData] = useState({})
// //   const handleChange = (e) => {
// //     setFormData(
// //       {
// //       ...formData,
// //       [e.target.id]:e.target.value,
// //       }

// //     );
    
    
// //   };
// //---------------------------------------------------------------------------
// export default function SignUp() {
//   const [formData, setFormData] = useState({}); // ✅ Fixed typo

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   // ... continue with the rest of your component
// }












//   const handleSubmit = async(e) =>{
//     e.preventDefault();//it will prevent the refresing the page
//     const res =await fetch('/api/auth/signup',
//       {
//         method : 'POST',
//         headers:{
//           'Content-Type':'application/json',
//         },
//         body : JSON.stringify(formData),
//       }
//     );
//     const data =await res.json();
//     console.log(data);
//   };
//   console.log(formData);

//   return(
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
//       <form  onSubmit = {handleSubmit}className='flex flex-col gap-4'>
//         <input type="text" placeholder='username'
//         className='border p-3 rounded-lg' id='username' onChange ={handleChange}/>

//         <input type="email" placeholder='email'
//         className='border p-3 rounded-lg' id='email'onChange ={handleChange}/>
//         <input type="password" placeholder='password'
//         className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
//         <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
//         disabled:opacity-80'>Sign Up</button>
      
//       </form>
//       <div className="flex gap-2 mt-5">
//         <p>Have an account ?</p>
//         <Link to={"/sign-in"}>
//         <span className='text-blue-700'>Sign in</span>
//         </Link>

//       </div>
//     </div>
//   )
//---------------inside---------------------------------------------
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };onChange
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.success === false) {
//         setLoading(false);
//         setError(data.message);
//         return;
//       }
//       setLoading(false);
//       setError(null);
//       navigate('/sign-in');
//     } catch (error) {
//       setLoading(false);
//       setError(error.message);
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold mt-20'>Sign up with GOOGLE</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         {/* <input
//           type='text'
//           placeholder='username'
//           className='border p-3 rounded-lg'
//           id='username'
//           onChange={handleChange}
//         />
//         <input
//           type='email'
//           placeholder='email'
//           className='border p-3 rounded-lg'
//           id='email'
//           onChange={handleChange}
//         />
//         <input
//           type='password'
//           placeholder='password'
//           className='border p-3 rounded-lg'
//           id='password'
//           onChange={handleChange}
//         />

//         <button
//           disabled={loading}
//           className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
//         >
//           {loading ? 'Loading...' : 'Sign Up'}
//         </button> */}
//         <OAuth/>
//       </form>
//       <div className='flex gap-2 mt-2'>
//         <p>Have an account?</p>
//         <Link to={'/sign-in'}>
//           <span className='text-blue-700'>Sign in</span>
//         </Link>
//       </div>
//       {error && <p className='text-red-500 mt-5'>{error}</p>}
//     </div>
//   );
//-----------------------------------------------------------
//}

























// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   signInStart,
//   signInSuccess,
//   signInFailure,
// } from '../redux/user/userSlice';
// import OAuth from '../components/OAuth';

// export default function SignIn() {
//   const [formData, setFormData] = useState({});
//   const { loading, error } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(signInStart());
//       const res = await fetch('/api/auth/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.success === false) {
//         dispatch(signInFailure(data.message));
//         return;
//       }
//       dispatch(signInSuccess(data));
//       navigate('/');
//     } catch (error) {
//       dispatch(signInFailure(error.message));
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold mt-20'>Sign in with GOOGLE</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* -------------------------------------inside--------------------------------------------------------- */}
        {/* <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button> */}
        {/* --------------------------------------------------------------------------------------------------------------- */}
       
        {/* <OAuth/>
      </form>
      <div className='flex gap-2 mt-2'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
} */}
