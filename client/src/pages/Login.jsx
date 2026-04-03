import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Use these credentials
    if (email === 'admin@energy.com' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      alert('Invalid Credentials! Use: admin@energy.com / admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', padding: '40px', borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#4f46e5', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)' }}>
            <Zap size={30} color="white" fill="white" />
          </div>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '800', margin: 0 }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', marginTop: '10px', fontSize: '14px' }}>Secure Login for Energy AI Panel</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#6366f1" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@energy.com"
                style={{ width: '100%', padding: '14px 14px 14px 48px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#6366f1" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px 14px 14px 48px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;