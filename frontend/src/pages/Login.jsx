import  { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [currentState, setCurrentState] = useState('Login')
    const {token , setToken , navigate , backendUrl} = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [referralCode, setReferralCode] = useState('')

    // Check for referral code in URL
    useEffect(() => {
        const refParam = searchParams.get('ref')
        if (refParam) {
            setReferralCode(refParam)
            setCurrentState('Sign up') // Auto-switch to signup if referral link
        }
    }, [searchParams])

    const onSubmitHandler = async (event) => {
      event.preventDefault()
      try {
        
          if (currentState === 'Sign up') {

            const response = await axios.post(backendUrl + '/api/user/register',{
                name,
                email,
                password,
                referralCode: referralCode || undefined
            })
            if (response.data.success)  {
              setToken(response.data.token)
              localStorage.setItem('token', response.data.token)
              if (referralCode) {
                toast.success(`Welcome! You've been referred and earned bonus coins! 🪙`)
              }
            }
            else{
                toast.error(response.data.message)
            }
            
          }
          else{
            const response = await axios.post(backendUrl + '/api/user/login',{email,password})
            if (response.data.success)  {
              setToken(response.data.token)
              localStorage.setItem('token', response.data.token)
            }
            else{
                toast.error(response.data.message)
            }
          }

      } catch (error) {

          console.log(error)
          toast.error(error.message)
      
        
      }
      
    }

    useEffect(()=>{
      if (token) {
        navigate('/')
        
      }
    },[token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>

        <hr className='border-none h-[1.5px] w-8  bg-gray-800' />
      
      </div>
      {currentState === 'Login' ? '':<input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name'  required />}
      <input onChange={(e)=>setEmail(e.target.value)} value={email}  type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email address' required  />
      <input onChange={(e)=>setPassword(e.target.value)} value={password}  type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password'  required />
      {currentState === 'Sign up' && (
        <div className='w-full'>
          <input 
            onChange={(e)=>setReferralCode(e.target.value)} 
            value={referralCode} 
            type="text" 
            className='w-full px-3 py-2 border border-gray-300' 
            placeholder='Referral Code (Optional)' 
          />
          {referralCode && (
            <p className='text-xs text-green-600 mt-1'>🪙 You'll earn bonus coins with this referral!</p>
          )}
        </div>
      )}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot you password?</p>
        {
          currentState === 'Login' 
          ? <p onClick={()=>setCurrentState('Sign up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }

      </div>
      <button className=' bg-black text-white font-light px-8 py-2 mt-4'> {currentState === 'Login' ? 'Sign in' : 'Sign up'}</button>
    </form>
  )
}

export default Login
