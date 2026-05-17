import './App.css'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'

  function App() {

    return (
      <>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </>
    )
  }

export default App
