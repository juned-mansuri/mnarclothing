import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';


const Mystery = () => {
    const {products} = useContext(ShopContext);
    // const [bestSeller, setBestSeller] = useState([])
    const [mystery, setMystery] = useState([])

    useEffect(() => {
        
        const mysteryProduct = products.filter((item)=>(item.mystery));
        setMystery(mysteryProduct.slice(0,5))

    
      
    }, [products])
    
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8 '>

            <Title text1={'MYSTERY'} text2={'PICK\'S'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Uncover the unexpected — our Mystery Picks won’t stay secret for long. Handpicked by our creators, these exclusive pieces are disappearing fast.

            </p>
        </div>
<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
    {mystery.map((item,index)=>(
        <ProductItem key={index} id={item._id} name={item.name} image={item.images} price={item.price} />
    ))}
 
</div>

    </div>
  )
}
export default Mystery