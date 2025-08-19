import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, { credentials: 'include' });
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  const handleSend = async () => {
    try {
      setSending(true);
      setSent(null);
      const res = await fetch(`/api/listing/contact/${listing._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSent(data.sent ? 'Email sent to owner.' : 'Email not sent (mail server not configured).');
      setMessage('');
    } catch (err) {
      setSent(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <div className='text-sm text-gray-600'>
            <div>Email: <span className='font-mono'>{landlord.email}</span></div>
            {landlord.phone && (
              <div>Phone: <span className='font-mono'>{landlord.phone}</span></div>
            )}
          </div>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          <button
            onClick={handleSend}
            disabled={sending}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-60'
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {sent && (<p className='text-sm text-gray-700'>{sent}</p>)}
        </div>
      )}
    </>
  );
}
