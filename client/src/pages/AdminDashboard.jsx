import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserSuccess } from '../redux/user/userSlice';
import { 
  FaUsers, 
  FaHome, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSignOutAlt,
  FaEye,
  FaCheck,
  FaBan,
  FaChartBar
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminNotes, setAdminNotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardData();
  }, []);

  const checkAdminAuth = () => {
    // Check if user is logged in and is admin
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsRes = await fetch('/api/admin/dashboard-stats', {
        credentials: 'include'
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch pending listings
      const listingsRes = await fetch('/api/admin/pending-listings', {
        credentials: 'include'
      });
      const listingsData = await listingsRes.json();
      setPendingListings(listingsData);

      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveListing = async (listingId) => {
    try {
      const notes = adminNotes[listingId] || '';
      const res = await fetch(`/api/admin/approve-listing/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (res.ok) {
        // Remove from pending list and refresh
        setPendingListings(prev => prev.filter(listing => listing._id !== listingId));
        fetchDashboardData(); // Refresh stats
        setAdminNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[listingId];
          return newNotes;
        });
      }
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  const handleRejectListing = async (listingId) => {
    try {
      const notes = adminNotes[listingId] || '';
      const res = await fetch(`/api/admin/reject-listing/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (res.ok) {
        // Remove from pending list and refresh
        setPendingListings(prev => prev.filter(listing => listing._id !== listingId));
        fetchDashboardData(); // Refresh stats
        setAdminNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[listingId];
          return newNotes;
        });
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/signout', {
        credentials: 'include'
      });
      // Clear user state and redirect to home
      dispatch(signOutUserSuccess());
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear state and redirect even if signout fails
      dispatch(signOutUserSuccess());
      navigate('/');
    }
  };

  // Don't render if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
              { id: 'listings', label: 'Pending Listings', icon: FaHome },
              { id: 'users', label: 'Users', icon: FaUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaUsers className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.totalUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaHome className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.totalListings || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaClock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Listings</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.pendingListings || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaCheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Approved Listings</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.approvedListings || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">New Users (Last 7 days)</h4>
                    <p className="text-2xl font-bold text-green-600">{stats?.recentUsers || 0}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">New Listings (Last 7 days)</h4>
                    <p className="text-2xl font-bold text-blue-600">{stats?.recentListings || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Pending Listings ({pendingListings.length})
                </h3>
                
                {pendingListings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending listings to review.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <div key={listing._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{listing.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{listing.description}</p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><span className="text-gray-500">Type:</span> <span className="font-medium">{listing.type}</span></div>
                              <div><span className="text-gray-500">Plot Area:</span> <span className="font-medium">{listing.plotArea?.toLocaleString('en-IN')} sq ft</span></div>
                              <div><span className="text-gray-500">Price/sqft:</span> <span className="font-medium">₹{listing.pricePerSqft?.toLocaleString('en-IN')}</span></div>
                              <div><span className="text-gray-500">Total:</span> <span className="font-medium">₹{listing.totalPrice?.toLocaleString('en-IN')}</span></div>
                              <div><span className="text-gray-500">Owner:</span> <span className="font-medium">{listing.owner?.username || 'Unknown'}</span></div>
                              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{listing.owner?.email || '-'}</span></div>
                              {listing.owner?.phone && (
                                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{listing.owner.phone}</span></div>
                              )}
                              <div className="col-span-full"><span className="text-gray-500">Address:</span> <span className="font-medium">{listing.address}</span></div>
                              <div className="col-span-full"><span className="text-gray-500">Coordinates:</span> <span className="font-medium">{listing.latitude}, {listing.longitude}</span></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveListing(listing._id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
                            >
                              <FaCheck className="mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectListing(listing._id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center"
                            >
                              <FaBan className="mr-1" />
                              Reject
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <textarea
                            placeholder="Add admin notes (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            rows="2"
                            value={adminNotes[listing._id] || ''}
                            onChange={(e) => setAdminNotes(prev => ({
                              ...prev,
                              [listing._id]: e.target.value
                            }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Registered Users ({users.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar}
                              alt={user.username}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
