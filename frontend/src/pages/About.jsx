import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div>
        <div className=' text-2xl text-center p-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
        </div>

        <div className=' my-10 flex flex-col md:flex-row gap-16'>
          <img className=' w-full md:max-w-[450px]' src={assets.mnarlogo2} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Mnar Clothing is more than just a clothing brand—it's a celebration of individuality and self-expression. Each piece in our collection is thoughtfully designed to combine elegance, comfort, and versatility. We believe in empowering everyone to wear their confidence and embrace their unique style.</p>
          <p>From timeless classics to bold statement pieces, our designs are crafted with meticulous attention to detail and premium quality fabrics, ensuring you look and feel your best every day.</p>
            <b className='text-gray-800'>Our Mission</b>
            <p>At Mnar Clothing, our mission is to redefine fashion by blending contemporary trends with timeless craftsmanship. We aim to create clothing that inspires confidence, sparks creativity, and resonates with people from all walks of life.</p>
          </div>

        </div>
        <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US '} />

        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Quality Assurance:</b>
              <p className=' text-gray-600'>At Mnar Clothing, we prioritize quality in every garment we create. Our clothes are made with premium materials that ensure durability, comfort, and long-lasting wear. Each piece undergoes rigorous quality checks, so you can trust that you're getting only the best.</p>
              </div>
            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Convenience</b>
              <p className=' text-gray-600'>Shopping with us is seamless and easy. We offer fast shipping, secure payment options, and hassle-free returns, ensuring that your shopping experience is as smooth as possible. We believe in making fashion accessible, no matter where you are.</p>
              </div>
            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
              <b>Exceptional Customer Support</b>
              <p className=' text-gray-600'>Our team is always ready to assist you. Whether you have a question about sizing, need help with your order, or simply want style advice, we're here for you. We pride ourselves on offering personalized, responsive, and friendly customer service to ensure your satisfaction every step of the way.</p>
              </div>
        </div>
        <NewsLetterBox/>
    </div>
  );
};

export default About;
