import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeadProvider } from 'react-head';
import './index.css'
import App from './App.jsx'

const headTags = [];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider headTags={headTags}>
      <App />
    </HeadProvider>
  </StrictMode>,
)