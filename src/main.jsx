import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { antdTheme } from './config/antdTheme'
import './index.css'
import './i18n' // Add this line

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#0b7de8', secondary: '#fff' } },
          }}
        />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
