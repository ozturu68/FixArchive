import { Link } from 'react-router-dom'
import { MessageSquare, UploadCloud, Search } from 'lucide-react'

const Home = () => {
  return (
    <div className="page-content" style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '50px'}}>
      
      <h1 style={{fontSize: '3rem', marginBottom: '10px', border: 'none'}}>Fix Archive 🛡️</h1>
      <p style={{color: '#888', fontSize: '1.2rem', marginBottom: '40px'}}>
        Doğrulanmış teknik bilgi ve dosya arşivi.
      </p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
        
        {/* Kart 1 */}
        <div style={{background: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{color: '#646cff', marginBottom: '15px'}}><MessageSquare size={40}/></div>
          <h3 style={{margin: '0 0 10px 0'}}>Sosyal Alan</h3>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '20px'}}>Topluluk tartışmaları ve güncel akış.</p>
          <Link to="/social" className="submit-btn" style={{display:'inline-block', textDecoration:'none', width:'auto'}}>Göz At</Link>
        </div>

        {/* Kart 2 */}
        <div style={{background: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{color: '#4ade80', marginBottom: '15px'}}><UploadCloud size={40}/></div>
          <h3 style={{margin: '0 0 10px 0'}}>Paylaşım Yap</h3>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '20px'}}>Sorun çözümlerini veya dosyaları arşivle.</p>
          <Link to="/create" className="submit-btn" style={{display:'inline-block', textDecoration:'none', width:'auto', background: '#2ea043'}}>Oluştur</Link>
        </div>

      </div>

    </div>
  )
}

export default Home