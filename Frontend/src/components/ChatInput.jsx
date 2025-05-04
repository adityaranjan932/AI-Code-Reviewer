import { useState, useRef } from 'react'
import { FaPlus, FaRegImage } from 'react-icons/fa'
import axios from 'axios'

function ChatInput({ onResponse }) {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef()

  const handleFileClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt && !image) return
    setLoading(true)
    const formData = new FormData()
    if (image) formData.append('image', image)
    formData.append('prompt', prompt)
    try {
      const res = await axios.post('http://localhost:3000/ai/image-review', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onResponse(res.data)
      setPrompt('')
      setImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      onResponse('Error: ' + (err.response?.data || err.message))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',alignItems:'flex-end',gap:8,position:'relative',background:'#18181b',borderRadius:8,padding:12}}>
      <button type="button" onClick={handleFileClick} style={{background:'none',border:'none',cursor:'pointer',padding:0,marginRight:4}} title="Upload image">
        <FaPlus size={18} style={{color:'#646cff'}} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{display:'none'}}
      />
      <textarea
        placeholder="What can I help with?"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        rows={1}
        style={{flex:1,borderRadius:6,padding:8,minHeight:36,maxHeight:120,resize:'vertical',background:'#23272f',color:'#fff',border:'none'}}
        disabled={loading}
      />
      <button type="submit" disabled={loading || (!prompt && !image)} style={{background:'#646cff',color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:500,cursor:'pointer'}}>
        {loading ? '...' : 'Send'}
      </button>
      {image && (
        <span style={{position:'absolute',bottom:50,left:40,fontSize:12,color:'#fff',background:'#23272f',padding:'2px 8px',borderRadius:4}}>
          <FaRegImage style={{marginRight:4}} /> {image.name}
        </span>
      )}
    </form>
  )
}

export default ChatInput
