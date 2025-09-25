import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const res = await fetch('/api/auth/reset', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, token, newPassword: password })
    });
    if (res.ok) { setStatus('done'); setTimeout(()=>navigate('/signin'),1500); }
    else setStatus('error');
  }

  if (!token || !email) return <p>Invalid reset link.</p>;

  return (
    <div style={{maxWidth:420,margin:'40px auto'}}>
      <h2>Set a new password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="New password" style={{width:'100%',padding:8}}/>
        <div style={{marginTop:12}}>
          <button type="submit">{status==='sending' ? 'Saving...' : 'Save password'}</button>
        </div>
      </form>
      {status==='done' && <p style={{color:'green'}}>Password changed. Redirecting...</p>}
      {status==='error' && <p style={{color:'red'}}>Error resetting password.</p>}
    </div>
  );
}
