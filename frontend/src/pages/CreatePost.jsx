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

    try {
      let fileUrl = ""
      if (file) {
        const formData = new FormData()
        formData.append('dosya', file)
        const uploadRes = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        fileUrl = uploadRes.data.url
      }

      await axios.post('http://localhost:3000/posts', {
        user_id: 1, // Şimdilik sabit, düzelteceğiz
        title, content, file_url: fileUrl
      })

      setMessage('✅ Gönderi başarıyla paylaşıldı!')
      setTitle(''); setContent(''); setFile(null)
    } catch (error) {
      setMessage('❌ Hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <h1>✍️ Gönderi Oluştur</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'15px'}}>
            <label>Başlık</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div style={{marginBottom:'15px'}}>
            <label>İçerik</label>
            <textarea rows="6" value={content} onChange={e => setContent(e.target.value)} required></textarea>
          </div>
          <div style={{marginBottom:'15px'}}>
            <label>Dosya</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} style={{border:'1px dashed #444'}} />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Yayımlanıyor...' : 'Yayımla'}
          </button>
          {message && <p style={{textAlign:'center', marginTop:'10px', fontWeight:'bold', color:'#4ade80'}}>{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default CreatePost