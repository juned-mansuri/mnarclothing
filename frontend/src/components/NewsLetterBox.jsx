import React from 'react'
import { useForm, ValidationError } from '@formspree/react';
const NewsLetterBox = () => {
    // const onSubmitHandler = (e) => {
    //     e.preventDefault()

    // }

    const [state, handleSubmit] = useForm("mkgjqbdy");
  if (state.succeeded) {
      return <div className='text-3xl text-center prata-regular'>Thanks for Sharing Your Thoughts , we Will Look for improving</div>;
  }
  return (
    <div className='text-center'>
       <p className="text-2xl font-medium text-gray-800 prata-regular">
    Got questions? We'd love to hear from you!
</p>
<p className="text-gray-400 mt-3">
    Feel free to reach out with any queries or concerns. We're here to help.
</p>

        {/* <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' >
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter You Email' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form> */}
<form onSubmit={handleSubmit} className='w-full flex flex-col sm:flex-row items-center text-center gap-5 justify-around mx-auto   m-8 border p-1 sm:p-24 h-auto'>
      {/* <label htmlFor="email">
        Email Address
      </label> */}
      <div className='flex-col'>
      <input className='w-full text-start outline-none text-2xl sm:text-4xl  mb-5 p-2 prata-regular'
        id="email"
        type="email" 
        name="email"
        placeholder='Enter You Email' required 
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
      <textarea className='w-full outline-none   text-start text-lg sm:text-xl  p-2 overflow-scroll prata-regular'
        id="message"
        name="message"
        placeholder='Write Your Message Here'
      />
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
      </div>
      <button type="submit" disabled={state.submitting} className='bg-black prata-regular hover:bg-gray-800 text-white text-xs px-10 py-4'>
        Submit
      </button>
    </form>
    </div>
  )
}

export default NewsLetterBox