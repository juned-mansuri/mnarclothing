import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import Profile from './pages/Profile'
import Terms from './pages/Terms'
import ScrollToTop from "./components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react"
import Pattern from './components/Pattern'
import MenCollection from './components/MenCollection'
import WomenCollection from './components/WomenCollection'
import OutOfService from './components/OutOfService'



const App = () => {
  return (
    
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#ffffff] '  >
      <Analytics />
      <ToastContainer/>
      <ScrollToTop/>
      <Navbar/>
      <SearchBar/>
      <Pattern/>
      
      <Routes>
      <Route path='/' element={< Home />} />
      {/* <Route path='/' element={<OutOfService/>} /> */}
      <Route path="/men-collection" element={<MenCollection />} />
      <Route path="/women-collection" element={<WomenCollection />} />
    
      <Route path='/collection' element={<Collection/>} />
      <Route path='/about' element={< About />} />
      <Route path='/contact' element={< Contact />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={< Cart/>} />
      <Route path='/login' element={< Login />} />
      <Route path='/place-order' element={< PlaceOrder />} />
      <Route path="/profile" element={<Profile />} />
    
      <Route path='/orders' element={< Orders />} />
      <Route path='/verify' element={< Verify />} />
      <Route path='/terms' element={<Terms/>} />
    

      </Routes>
      <Footer/>
    </div>
  )
}

export default App
