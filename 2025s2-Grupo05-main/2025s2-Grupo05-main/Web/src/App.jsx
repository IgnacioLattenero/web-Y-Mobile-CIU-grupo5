import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import PostPage from './pages/post/postPage.jsx'
import Modal from './components/modal/modal.jsx'


function App() {
  return (
    <div className="display">
      <PostPage className="postDescription" />
    </div>
  )
}

export default App
