import { useState, useEffect } from 'react'
import axios from 'axios'
import { Image as ImageIcon, X } from 'lucide-react'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('Yükleniyor...')

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('❌ Önce giriş yapmalısınız.')
      setLoading(false); return;
    }

    try {
      let fileUrl = ""
      if (file) {
        const formData = new FormData()
        formData.append('dosya', file)
        const uploadRes = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        })
        fileUrl = uploadRes.data.url
      }

      await axios.post('http://localhost:3000/posts', {
        title, content, file_url: fileUrl
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })

      setMessage('✅ Gönderildi!')
      setTitle(''); setContent(''); setFile(null);
    } catch (error) {
      console.error(error)
      setMessage('❌ Hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // DÜZELTME: margin: '0 auto' ile ortalıyoruz.
    <div className="page-content" style={{maxWidth: '600px', width: '100%', margin: '0 auto', padding: '20px'}}>
      <h1 style={{border: 'none', marginBottom:'20px'}}>Ne düşünüyorsun?</h1>
      
      <div className="form-container" style={{border: 'none', background: 'transparent', padding: '0'}}>
        <form onSubmit={handleSubmit}>
          
          <input 
            className="modern-input title-input"
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Başlık (Opsiyonel)"
          />

          <textarea 
            className="modern-input content-input"
            rows="5" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Neler oluyor?"
            required
          ></textarea>

          {previewUrl && (
            <div className="image-preview-container">
              <img src={previewUrl} alt="Preview" />
              <button type="button" onClick={() => setFile(null)} className="remove-image-btn">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="compose-footer">
            <div className="compose-tools">
              <label htmlFor="file-upload" className="tool-btn">
                <ImageIcon size={20} />
                <span style={{marginLeft:'5px', fontSize:'0.9rem'}}>Medya</span>
              </label>
              <input id="file-upload" type="file" onChange={e => setFile(e.target.files[0])} style={{display: 'none'}} accept="image/*" />
            </div>

            <button type="submit" disabled={loading} className="tweet-submit-btn">
              {loading ? '...' : 'Gönder'}
            </button>
          </div>
          {message && <p className="status-msg" style={{marginTop:'15px', textAlign:'center'}}>{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default CreatePost