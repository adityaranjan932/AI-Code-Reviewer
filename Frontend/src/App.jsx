import React, { useRef, useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import ImageChat from './components/ImageChat'
import ChatInput from './components/ChatInput'
import { FaRegImage, FaPlus } from 'react-icons/fa'
import Editor from "react-simple-code-editor"

function CodeBlock({ children, className }) {
  const codeRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const language = className ? className.replace('language-', '') : ''

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="custom-code-block">
      <pre className={className}>
        <code ref={codeRef}>{children}</code>
      </pre>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export default function App() {
  const [ code, setCode ] = useState(` function sum() {
    return 1 + 1
  }`)
  const [ review, setReview ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [messages, setMessages] = useState([])
  const [image, setImage] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    prism.highlightAll()
  }, [])

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  async function reviewCode() {
    setLoading(true)
    setReview("")
    try {
      let response
      if (image) {
        const formData = new FormData()
        formData.append('prompt', code)
        formData.append('image', image)
        response = await axios.post('http://localhost:3000/ai/image-review', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        response = await axios.post('http://localhost:3000/ai/get-review', { code })
      }
      setReview(response.data)
    } catch (err) {
      setReview('Error: ' + (err.response?.data || err.message))
    }
    setLoading(false)
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code" style={{position:'relative'}}>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="plus-inside-editor"
              title="Upload image for review"
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: '#23272f',
                border: '1px solid #444',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px #0006',
                padding: 0,
                zIndex: 2,
                transition: 'background 0.2s, border 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#343a40'}
              onMouseOut={e => e.currentTarget.style.background = '#23272f'}
            >
              <FaPlus size={14} style={{color:'#fff'}} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{display:'none'}}
            />
            {image && (
              <span style={{position:'absolute',bottom:52,left:16,fontSize:12,color:'#fff',background:'#23272f',padding:'2px 8px',borderRadius:4,zIndex:2}}>
                {image.name}
              </span>
            )}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:16,justifyContent:'flex-end'}}>
            <div
              onClick={reviewCode}
              className="review"
              style={{marginLeft:0}}
            >Review</div>
          </div>
        </div>
        <div className="right">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <Markdown
              rehypePlugins={[ rehypeHighlight ]}
              components={{
                code: CodeBlock
              }}
            >{review}</Markdown>
          )}
        </div>
      </main>
    </>
  )
}