import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// npm install -D tailwindcss@3 postcss autoprefixer
// npx tailwindcss init
// npm i react-router-dom
// npm install axios
// npm install react-chartjs-2 chart.js


// npm run dev