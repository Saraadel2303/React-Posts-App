import { createRoot } from 'react-dom/client'
import "./App.css"
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { PostsProvider } from './contexts/PostsContext.jsx'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <AuthProvider>
      <PostsProvider>
      <App />
      </PostsProvider>
    </AuthProvider>
   </BrowserRouter>
)
