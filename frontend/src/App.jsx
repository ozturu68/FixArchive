import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// --- BİLEŞENLERİ İÇE AKTAR ---
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Home from './pages/Home'
import Social from './pages/Social'      // <--- YENİ: Twitter tarzı akış sayfası
import CreatePost from './pages/CreatePost' // <--- GÜNCELLENDİ: Modern post oluşturma

// --- HENÜZ HAZIR OLMAYAN SAYFALAR İÇİN YER TUTUCULAR ---
// (İleride bunları ayrı dosyalara taşıyacağız)
const Profile = () => (
  <div className="page-content">
    <h1>👤 Profilim</h1>
    <p>Kullanıcı istatistikleri, geçmiş gönderiler ve rozetler burada listelenecek.</p>
  </div>
)

const Settings = () => (
  <div className="page-content">
    <h1>⚙️ Ayarlar</h1>
    <p>Hesap, güvenlik, bildirim ve tema ayarları.</p>
  </div>
)

function App() {
  // --- UYGULAMA DURUMU (STATE) ---
  // Sayfa yenilendiğinde hafızadan (localStorage) verileri geri yükle
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))
  
  // Sidebar (Yan Menü) Açık/Kapalı Durumu
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  // --- ÇIKIŞ YAPMA (LOGOUT) FONKSİYONU ---
  const logout = () => {
    // 1. Tarayıcı hafızasını temizle
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')

    // 2. Uygulama durumunu sıfırla (Login ekranına düşürür)
    setToken(null)
    setUsername(null)
  }

  // --- SENARYO 1: GİRİŞ YAPILMAMIŞSA ---
  // Kullanıcıyı direkt Login/Register ekranına hapseder
  if (!token) {
    return (
      <Login 
        setToken={setToken} 
        setUsername={setUsername} 
      />
    )
  }

  // --- SENARYO 2: GİRİŞ YAPILMIŞSA (DASHBOARD) ---
  return (
    <Router>
      <div className="app-container">
        
        {/* A. HAYALET TETİKLEYİCİ (Sol kenara dokununca menüyü açar) */}
        <div 
          className="ghost-trigger" 
          onMouseEnter={() => setSidebarOpen(true)}
        ></div>

        {/* B. YAN MENÜ (SIDEBAR) */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          closeMenu={() => setSidebarOpen(false)} 
          username={username} 
          logout={logout}
        />

        {/* C. ANA İÇERİK ALANI */}
        {/* Menü açılınca 'shifted' sınıfı eklenir ve içerik sağa kayar */}
        <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            {/* Rota Tanımları */}
            <Route path="/" element={<Home />} />
            <Route path="/social" element={<Social />} /> {/* Yeni Sosyal Alan */}
            <Route path="/create" element={<CreatePost />} /> {/* Post Oluşturma */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Bilinmeyen bir adrese gidilirse Ana Sayfaya at */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

      </div>
    </Router>
  )
}

export default App