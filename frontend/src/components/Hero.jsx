import React, { useContext } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'



const Hero = () => {
  const {navigate} = useContext(ShopContext)
  return (
    <div className='flex flex-col sm:flex-row '>
        {/* Hero Left Side */}
        <div className='w-full sm:w-full flex items-center justify-center py-10 sm:py-0'>
        <section className="bg-white ">
      <div className="container mx-auto  items-center">
        <div className="text-center  absolute -translate-x-1/2 left-1/2  mt-40 md:mt-28 z-50">
          {/* <h1 className="text-xl text-white text-center md:text-[4xl] font-bold mb-1 md:mb-1 " >VEYN WEAR</h1> */}
          <div className="inline-flex gap-2 items-center mb-3">
        <p className='text-gray-200 text-2xl sm:text-4xl prata-regular  ' >MNAR <span className='text-white font-medium prata-regular ' >CLOTHING</span></p>
        
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-100 text-4xl'></p>

    </div>
          
          <p className="text-white mb-6 text-xs sm:text-2xl prata-regular">
            Exclusive Clothes collection on Mnar Wear
          </p>
          <button onClick={()=>{ navigate("/collection");}} className="bg-[#F2F9FF] cursor-pointer text-black hover:bg-black border border-opacity-0 hover:border-opacity-100 hover:text-white px-6 py-2 m-auto rounded-full">
           TO THE CATALOG
          </button>
        </div>
        <div className="flex justify-center h-[50vh] overflow-hidden bg-black rounded-2xl ">
          <video className='w-44 sm:w-1/2 m-0 p-0 sm:p-10 sm:py-12' src={assets.whitevid} autoPlay muted loop  ></video>
          <video className='w-44 sm:w-1/2 m-0 p-0 sm:p-10 sm:py-12' src={assets.blackvid} autoPlay muted loop  ></video>
          <video className='w-44 sm:w-1/2 m-0 p-0 sm:p-10 sm:py-12' src={assets.pistavid} autoPlay muted loop  ></video>
          <video className='w-44 sm:w-1/2 m-0 p-0 sm:p-10 sm:py-12' src={assets.purplevid} autoPlay muted loop  ></video>
          {/* <img
            src="https://via.placeholder.com/400x500"
            alt="Model wearing Dolenga wear"
            className="rounded-lg"
          /> */}
        </div>
      </div>
    </section>
        

        </div>
{/* RIGHT Side of Hero */}
{/* <img src={assets.hero_img} className='w-full sm:w-1/2' alt="" /> */}

    </div>
  )
}

export default Hero