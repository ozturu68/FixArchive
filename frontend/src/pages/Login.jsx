import { useState } from 'react'
import axios from 'axios'

const Login = ({ setToken, setUsername }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('İşleniyor...')
    
    const endpoint = isLogin ? '/login' : '/register'
    
    try {
      const res = await axios.post(`http://localhost:3000${endpoint}`, formData)
      
      if (isLogin && res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        setToken(res.data.token)
        setUsername(res.data.username)
      } else if (!isLogin) {
        setMessage('✅ Kayıt başarılı! Şimdi giriş yap.')
        setIsLogin(true)
        setFormData({ username: '', email: '', password: '' })
      }
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.hata || 'Sunucu hatası!'))
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Fix Archive 🛡️</h1>
        <h3>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h3>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input name="username" placeholder="Kullanıcı Adı" onChange={handleChange} value={formData.username} required />
          )}
          <input name="email" placeholder="E-Posta" type="email" onChange={handleChange} value={formData.email} required />
          <input name="password" type="password" placeholder="Şifre" onChange={handleChange} value={formData.password} required />
          <button type="submit">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
        
        <p onClick={() => {setIsLogin(!isLogin); setMessage('')}} className="switch-text">
          {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten üye misin? Giriş Yap'}
        </p>
        
        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  )
}

export default Login