import { useState } from 'react'
import axios from 'axios'
import { FaRegImage } from 'react-icons/fa'

function ImageChat() {
  const [image, setImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image && !prompt) return
    setLoading(true)
    setResponse('')
    const formData = new FormData()
    if (image) formData.append('image', image)
    formData.append('prompt', prompt)
    try {
      const res = await axios.post('http://localhost:3000/ai/image-review', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResponse(res.data)
    } catch (err) {
      setResponse('Error: ' + (err.response?.data || err.message))
    }
    setLoading(false)
  }

  return (
    <div style={{background:'#23272f',padding:'2rem',borderRadius:'1rem',maxWidth:500,margin:'2rem auto'}}>
      <h2>AI Image & Prompt Chat</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        <label htmlFor="image-upload" style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
          <FaRegImage size={22} style={{color:'#646cff'}} />
          <span>Upload image or file</span>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}} />
        </label>
        <textarea
          placeholder="What can I help with?"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          style={{width:'100%',borderRadius:6,padding:8}}
        />
        <button type="submit" disabled={loading} style={{marginTop:10}}>
          {loading ? 'Processing...' : 'Send'}
        </button>
      </form>
      {response && (
        <div style={{marginTop:20,whiteSpace:'pre-wrap',color:'#fff'}}>{response}</div>
      )}
    </div>
  )
}

export default ImageChat
