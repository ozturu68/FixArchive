import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {
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

  return (
    <div className="page-content">
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <h1>🏠 Ana Sayfa</h1>
        <button onClick={fetchPosts} style={{background:'transparent', border:'1px solid #444', color:'#ccc', padding:'5px 15px', borderRadius:'5px', cursor:'pointer'}}>🔄 Yenile</button>
      </div>

      {loading ? <p>Yükleniyor...</p> : posts.length === 0 ? (
        <div style={{textAlign:'center', padding:'50px', background:'#1e1e1e', borderRadius:'12px'}}>
          <p>Henüz gönderi yok.</p>
          <Link to="/create" style={{color:'#646cff'}}>İlk gönderiyi sen oluştur!</Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-user">👤 {post.username}</span>
                <span>{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
              </div>
              <h3 style={{color:'white', margin:'10px 0'}}>{post.title}</h3>
              <p style={{color:'#ccc', whiteSpace:'pre-wrap'}}>{post.content}</p>
              {post.file_url && (
                <div className="post-image-container">
                  <img src={post.file_url} alt="Ek" loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home