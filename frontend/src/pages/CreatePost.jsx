import { useState } from 'react'
import axios from 'axios'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('Yükleniyor...')

    // 1. Token Kontrolü
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('❌ Hata: Oturum süreniz dolmuş veya giriş yapmamışsınız.')
      setLoading(false)
      return
    }

    try {
      let fileUrl = ""
      
      // 2. Dosya Yükleme İşlemi (Varsa)
      if (file) {
        const formData = new FormData()
        formData.append('dosya', file)
        
        // Header'a Token ekliyoruz
        const uploadRes = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        })
        fileUrl = uploadRes.data.url
      }

      // 3. Gönderi Oluşturma İşlemi
      // NOT: Artık user_id göndermiyoruz, backend token'dan çözüyor.
      await axios.post('http://localhost:3000/posts', {
        title, 
        content, 
        file_url: fileUrl
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      })

      setMessage('✅ Gönderi başarıyla paylaşıldı!')
      // Formu temizle
      setTitle('')
      setContent('')
      setFile(null)
      // Dosya inputunu görsel olarak da sıfırlamak için (manuel reset gerekebilir ama state yeterli)
      e.target.reset() 

    } catch (error) {
      console.error("Post Hatası:", error)
      const errorMsg = error.response?.data?.hata || 'Sunucuyla bağlantı kurulamadı.'
      setMessage('❌ ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <h1>✍️ Gönderi Oluştur</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Başlık</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Konu başlığı..."
              required 
            />
          </div>

          <div className="form-group">
            <label>İçerik</label>
            <textarea 
              rows="6" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Detayları buraya yazın..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Dosya Ekle (Opsiyonel)</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])} 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Yayımlanıyor...' : 'Yayımla'}
          </button>

          {message && (
            <p className="status-msg" style={{ color: message.startsWith('❌') ? '#ff4444' : '#4ade80' }}>
              {message}
            </p>
          )}
          
        </form>
      </div>
    </div>
  )
}

export default CreatePost