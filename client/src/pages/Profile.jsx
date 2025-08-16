import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // Profile picture upload
  const uploadProfileImage = async (file) => {
    const formDataToSend = new FormData();
    formDataToSend.append('image', file);
    formDataToSend.append('userId', currentUser._id);

    try {
      setFileUploadError(false);
      setFilePerc(50); // Show upload progress

      const res = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setFilePerc(100);
        
        // Update Redux state with new user data
        dispatch(updateUserSuccess(data.user));
        
        // Update form data for display
        setFormData({
          ...formData,
          avatar: data.imageUrl,
        });
        
        setTimeout(() => {
          setFilePerc(0);
        }, 2000);
      } else {
        setFileUploadError(true);
        setFilePerc(0);
      }
    } catch (error) {
      console.error('Upload failed', error);
      setFileUploadError(true);
      setFilePerc(0);
    }
  };

  useEffect(() => {
    if (file) uploadProfileImage(file);
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50"
          onClick={onClose}
        >
          <div
            className="bg-slate-100 rounded-lg p-4 w-1/2 md:w-1/3 xl:w-1/4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={async () => {
                  try {
                    dispatch(deleteUserStart());
                    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                      method: 'DELETE',
                    });
                    const data = await res.json();
                    if (data.success === false) {
                      dispatch(deleteUserFailure(data.message));
                      return;
                    }
                    dispatch(deleteUserSuccess(data));
                  } catch (error) {
                    dispatch(deleteUserFailure(error.message));
                  }
                  onClose();
                }}
              >
                Yes, delete account
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded ml-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleSignOut = async () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50"
          onClick={onClose}
        >
          <div
            className="bg-slate-100 rounded-lg p-4 w-1/2 md:w-1/3 xl:w-1/4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Confirm Sign Out</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to sign out?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={async () => {
                  try {
                    dispatch(signOutUserStart());
                    const res = await fetch('/api/auth/signout');
                    const data = await res.json();
                    if (data.success === false) {
                      dispatch(deleteUserFailure(data.message));
                      return;
                    }
                    dispatch(deleteUserSuccess(data));
                  } catch (error) {
                    dispatch(deleteUserFailure(error.message));
                  }
                  onClose();
                }}
              >
                Yes, sign out
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded ml-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get profile image source
  const getProfileImageSrc = () => {
    // First check if there's a new upload in formData
    if (formData.avatar) {
      return formData.avatar;
    }
    
    // Then check if user has an avatar
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    
    // Default profile picture
    return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={getProfileImageSrc()}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg bg-white'
          onChange={handleChange}
          disabled
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <div className='flex-1'>
                <Link
                  className='text-slate-700 font-semibold hover:underline truncate block'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                
                {/* Listing Status */}
                {listing.status && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    listing.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : listing.status === 'rejected' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      listing.status === 'approved' 
                        ? 'bg-green-500' 
                        : listing.status === 'rejected' 
                        ? 'bg-red-500' 
                        : 'bg-yellow-500'
                    }`}></span>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    {listing.status === 'rejected' && listing.adminNotes && (
                      <span className='ml-1 text-xs opacity-75'>
                        - {listing.adminNotes}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
