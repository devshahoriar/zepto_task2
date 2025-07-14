import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import BookDetail from './pages/BookDetail'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import { SWRProvider } from './providers/SWRProvider'

function App() {
  return (
    <SWRProvider>
      <Router>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <main>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/book/:id' element={<BookDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SWRProvider>
  )
}

export default App
