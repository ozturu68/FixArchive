import { useState, useEffect } from 'react'
import axios from 'axios'
import { MessageCircle, Heart, Repeat, Share2, MoreHorizontal } from 'lucide-react'

const Social = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/posts')
      setPosts(res.data)
    } catch (error) {
      console.error("Hata:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAvatarColor = (username) => {
    const colors = ['#646cff', '#ff4444', '#4ade80', '#fbbf24', '#a78bfa'];
    return colors[username.length % colors.length];
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    const absoluteDate = date.toLocaleDateString("tr-TR", { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).replace(/\./g, '/');

    let relative = "";
    if (diff < 60) relative = "Az önce";
    else if (diff < 3600) relative = `${Math.floor(diff / 60)}dk önce`;
    else if (diff < 86400) relative = `${Math.floor(diff / 3600)}sa önce`;
    else relative = `${Math.floor(diff / 86400)} gün önce`;

    return `${absoluteDate} / ${relative}`;
  }

  return (
    <div className="page-content" style={{maxWidth: '600px', width: '100%', margin: '0 auto', padding: '0'}}>
      
      {/* HEADER DÜZENLENDİ: Buton kaldırıldı */}
      <div className="feed-header">
        <h1>Sosyal Alan</h1>
      </div>

      {loading ? (
        <div style={{padding:'40px', textAlign:'center', color:'#888'}}>Yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state" style={{marginTop:'50px', border:'none'}}>
          <p>Henüz gönderi yok.</p>
        </div>
      ) : (
        <div className="feed-stream">
          {posts.map((post) => (
            <div key={post.id} className="tweet-card">
              <div className="tweet-avatar-area">
                <div className="user-avatar" style={{backgroundColor: getAvatarColor(post.username)}}>
                  {post.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="tweet-content-area">
                <div className="tweet-header">
                  <span className="tweet-name">{post.username}</span>
                  <span className="tweet-username">@{post.username.toLowerCase()}</span>
                  <span className="tweet-dot">·</span>
                  <span className="tweet-time" style={{fontSize:'0.85rem'}}>{formatTime(post.created_at)}</span>
                  <button className="tweet-more"><MoreHorizontal size={16} /></button>
                </div>
                
                <div className="tweet-text">{post.content}</div>
                
                {post.file_url && (
                  <div className="tweet-media">
                    <img 
                      src={post.file_url} 
                      alt="Görsel" 
                      loading="lazy" 
                      onError={(e) => {
                        console.log("Resim yüklenemedi:", post.file_url); // Hata ayıklama için
                        e.target.style.display = 'none'; 
                      }}
                    />
                  </div>
                )}
                
                <div className="tweet-actions">
                  <div className="action-item reply"><MessageCircle size={18} /><span>0</span></div>
                  <div className="action-item retweet"><Repeat size={18} /><span>0</span></div>
                  <div className="action-item like"><Heart size={18} /><span>0</span></div>
                  <div className="action-item share"><Share2 size={18} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Social