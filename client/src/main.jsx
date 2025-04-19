import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import StoreProvider from './context/StoreProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <>
      <App />
      <Toaster />
    </>
  </StoreProvider>,
)
