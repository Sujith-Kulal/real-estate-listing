import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  return (
    <header className='bg-white shadow-lg border-b border-gray-100'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='flex items-center space-x-2'>
          <div className='w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-xl'>B</span>
          </div>
          <h1 className='font-bold text-xl text-gray-800'>
            <span className='text-green-600'>BHUMI</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-gray-50 p-3 rounded-xl flex items-center border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-200'
        >
          <input
            type='text'
            placeholder='Search lands...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 text-gray-700 placeholder-gray-400'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='text-gray-400 hover:text-green-600 transition-colors'>
            <FaSearch className='text-lg' />
          </button>
        </form>
        <ul className='flex gap-6 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-gray-700 hover:text-green-600 transition-colors font-medium'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-gray-700 hover:text-green-600 transition-colors font-medium'>
              About
            </li>
          </Link>
          <Link to='/contact'>
            <li className='hidden sm:inline text-gray-700 hover:text-green-600 transition-colors font-medium'>
              Contact
            </li>
          </Link>
          {/* Only show Admin Dashboard link for admin users */}
          {isAdmin && (
            <Link to='/admin/dashboard'>
              <li className='hidden sm:inline text-gray-700 hover:text-green-600 transition-colors font-medium'>
                Admin Dashboard
              </li>
            </Link>
          )}
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover border-2 border-green-200 hover:border-green-400 transition-colors'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-gray-700 hover:text-green-600 transition-colors font-medium'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
