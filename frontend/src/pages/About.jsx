import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div className='text-gray-800'>
      {/* Top Section */}
      <div className='border-t text-center py-12 px-4'>
        <h1 className='text-4xl md:text-5xl font-bold'>MNAR CLOTHING</h1>
        <p className='max-w-xl mx-auto mt-4 text-sm text-gray-600'>
          We work across fashion and identity. We design bold, expressive clothing that empowers individuals to embrace their uniqueness. Our vision merges confidence, quality, and creativity.
        </p>
        <div>
      <span className='text-center flex gap-2 mt-4 me-0 justify-center'>
      
        <a target='_blank' href="https://www.facebook.com/share/18zRviwmeC/">
        <img className='w-10' src={assets.facebook} alt="" />
        </a>
        <a target='_blank' href="https://x.com/MNARclothing?t=bNkc641syFYWBGKQ0je1TQ&s=09">
        <img className='w-10' src={assets.twitter} alt="" />
        </a>
        <a target='_blank' href="https://www.instagram.com/mnar.india?igsh=eWlzandjZmJtdDZ2">
        <img className='w-10' src={assets.insta} alt="" />
        </a>
        <a target='_blank' href="https://youtube.com/@devsangtani24?si=JhBLYHaYKkI9-vPL">
        <img className='w-10' src={assets.youtube} alt="" />
        </a>
        
       
        
        </span>
      </div>
      </div>

      {/* Hero Image */}
      <div className='w-full'>
        <img src={assets.mnarhero} alt="MNAR Hero" className='w-full h-96 object-cover' />
      </div>

      {/* Bio Text */}
    
      <div className='text-sm text-center max-w-3xl mx-auto mt-6 px-4 text-gray-600'>
      Mnar Clothing started with a shared love for good design and quality craftsmanship. With a small, passionate team, we've grown steadily — now offering a wide range of unique collections, proudly delivering across India.
      </div>
      
          {/* Meet the Team Section */}
          <div className="mt-20 text-center">
  <h2 className="text-3xl md:text-4xl font-light tracking-wide">
    MEET THE <span className="font-bold">CREATOR'S</span>
  </h2>

  <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-16 px-4">
    {/* Text Left - Juned */}
    <div className="max-w-sm text-right">
    <p className="text-xl text-gray-500">Founder</p>
      <h3 className="text-3xl font-semibold mt-1">Dev Sangtani</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
      
      Juned Mansuri is a developer at Mnar Clothing, contributing to the technical development of the platform. His work supports the brand’s digital growth and enhances user experience.
      </p>
      <span className='text-end flex gap-2 mt-10 me-0 justify-end'>
        <a target='_blank' href="https://www.instagram.com/thejumicreates/">
        <img className='w-10' src={assets.insta} alt="" />
        </a>
        <a target='_blank' href="https://x.com/bytesizedjuned">
        <img className='w-10' src={assets.twitter} alt="" />
        </a>
        <a target='_blank' href="https://www.linkedin.com/in/juned-mansuri-bb9b7923b/">
        <img className='w-10' src={assets.linkedin} alt="" />
        </a>
        <a target='_blank' href="https://github.com/juned-mansuri">
        <img className='w-10' src={assets.github} alt="" />
        </a>
        </span>
     
    </div>

    {/* Image 1 - Dev */}
    <img
      src={assets.dev}
      alt="Juned Mansuri"
      className="w-72  h-auto object-cover "
    />

    {/* Image 2 - Parv */}
    <img
      src={assets.parv}
      alt="Jenam Jain"
      className="w-72 h-auto object-cover "
    />

    {/* Text Right - Jenam */}
    <div className="max-w-sm text-left">
    <p className="text-xl text-gray-500 ">Co Founder</p>
      <h3 className="text-3xl font-semibold mt-1 ">Jenam Jain</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed ">
      Jenam Jain is a developer at Mnar Clothing, focusing on backend systems and infrastructure. He ensures performance, stability, and reliability across all technical operations.
      </p>
      <span className='text-end flex gap-2 mt-10 me-0 justify-start'>
      <a target='_blank' href="">
        <img className='w-10' src={assets.github} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.linkedin} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.twitter} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.insta} alt="" />
        </a>
        
       
        
        </span>
    </div>
  </div>
</div>

      {/* Meet the Team Section */}
      <div className="mt-20 text-center">
  <h2 className="text-3xl md:text-4xl font-light tracking-wide">
    MEET THE <span className="font-bold">DEVELOPERS</span>
  </h2>

  <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-16 px-4">
    {/* Text Left - Juned */}
    <div className="max-w-sm text-right">
    <p className="text-xl text-gray-500">Lead Developer</p>
      <h3 className="text-3xl font-semibold mt-1">Juned Mansuri</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
      
      Juned Mansuri is a developer at Mnar Clothing, contributing to the technical development of the platform. His work supports the brand’s digital growth and enhances user experience.
      </p>
      <span className='text-end flex gap-2 mt-10 me-0 justify-end'>
        <a target='_blank' href="https://www.instagram.com/thejumicreates/">
        <img className='w-10' src={assets.insta} alt="" />
        </a>
        <a target='_blank' href="https://x.com/bytesizedjuned">
        <img className='w-10' src={assets.twitter} alt="" />
        </a>
        <a target='_blank' href="https://www.linkedin.com/in/juned-mansuri-bb9b7923b/">
        <img className='w-10' src={assets.linkedin} alt="" />
        </a>
        <a target='_blank' href="https://github.com/juned-mansuri">
        <img className='w-10' src={assets.github} alt="" />
        </a>
        </span>
     
    </div>

    {/* Image 1 - Juned */}
    <img
      src={assets.director1}
      alt="Juned Mansuri"
      className="w-72  h-auto object-cover "
    />

    {/* Image 2 - Jenam */}
    <img
      src={assets.director2}
      alt="Jenam Jain"
      className="w-72 h-auto object-cover "
    />

    {/* Text Right - Jenam */}
    <div className="max-w-sm text-left">
    <p className="text-xl text-gray-500 ">Technical Contributor</p>
      <h3 className="text-3xl font-semibold mt-1 ">Jenam Jain</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed ">
      Jenam Jain is a developer at Mnar Clothing, focusing on backend systems and infrastructure. He ensures performance, stability, and reliability across all technical operations.
      </p>
      <span className='text-end flex gap-2 mt-10 me-0 justify-start'>
      <a target='_blank' href="">
        <img className='w-10' src={assets.github} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.linkedin} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.twitter} alt="" />
        </a>
        <a target='_blank' href="">
        <img className='w-10' src={assets.insta} alt="" />
        </a>
        
       
        
        </span>
    </div>
  </div>
</div>


      {/* Optional: CTA or Newsletter */}
      <div className='mt-20 mb-12'>
        {/* You can include <NewsLetterBox /> here if needed */}
        <NewsLetterBox />
        
      </div>
    </div>
  );
};

export default About;
