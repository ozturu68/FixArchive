import { Link } from 'react-router-dom'
import { LayoutDashboard, UploadCloud, User, Settings, LogOut, MessageSquare } from 'lucide-react'

const Sidebar = ({ isOpen, closeMenu, username, logout }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      <div className="sidebar-content">
        <div className="logo">Fix Archive</div>
        
        <nav className="menu" style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          <Link to="/" className="menu-item"><LayoutDashboard size={20}/> <span>Ana Sayfa</span></Link>
          <Link to="/social" className="menu-item"><MessageSquare size={20}/> <span>Sosyal Alan</span></Link>
          <Link to="/create" className="menu-item"><UploadCloud size={20}/> <span>Gönderi Oluştur</span></Link>
          <Link to="/profile" className="menu-item"><User size={20}/> <span>Profilim</span></Link>
          <Link to="/settings" className="menu-item"><Settings size={20}/> <span>Ayarlar</span></Link>
        </nav>

        <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #2a2a2a'}}>
          <div style={{color: '#888', marginBottom: '10px', fontSize: '0.9rem', paddingLeft: '5px'}}>
            👤 {username || 'Kullanıcı'}
          </div>
          <button 
            onClick={logout} 
            className="menu-item" 
            style={{background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', width: '100%', border: 'none', cursor: 'pointer'}}>
            <LogOut size={18}/> <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Kapatma Çubuğu */}
      <div className="sidebar-closer" onClick={closeMenu} title="Menüyü Kapat">
        <div className="closer-line"></div>
      </div>

    </aside>
  )
}

export default Sidebar