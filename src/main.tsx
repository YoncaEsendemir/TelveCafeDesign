import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// BrowserRouter: gerçek URL'li rotalar (/ ve /menu). App içinde <Routes> bunu
// kullanır. (cPanel'de /menu yenilenince index.html'e düşsün diye .htaccess'te
// SPA yönlendirmesi var.)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
