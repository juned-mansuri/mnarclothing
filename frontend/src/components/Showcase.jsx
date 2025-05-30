import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';


const Showcase = () => {
    const {products} = useContext(ShopContext);
    // const [bestSeller, setBestSeller] = useState([])
    const [showcase, setShowcase] = useState([])

    useEffect(() => {
        
        const showcaseProduct = products.filter((item)=>(item.showcase));
        setShowcase(showcaseProduct.slice(0,5))

    
      
    }, [products])
    
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8 '>

            <Title text1={'CREATOR\'S'} text2={'PICKS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            &#34;Shop our Creator&#39;s Picks products before they’re gone! These Creator&#39;s Picks are flying off the shelves.&#34;

            </p>
        </div>
<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
    {showcase.map((item,index)=>(
        <ProductItem key={index} id={item._id} name={item.name} image={item.images} price={item.price} />
    ))}
 
</div>

    </div>
  )
}
export default Showcase