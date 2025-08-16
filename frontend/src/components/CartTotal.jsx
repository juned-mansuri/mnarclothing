import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import PropTypes from 'prop-types'

const CartTotal = ({ appliedRedemption, coinDiscounts = {} }) => {

    const {currency , delivery_fee ,getCartAmount} = useContext(ShopContext) 
    
    const subtotal = getCartAmount()
    const discount = appliedRedemption?.discountAmount || 0
    const coinSavings = Object.values(coinDiscounts).reduce((sum, d) => sum + d.discountAmount, 0)
    const finalTotal = subtotal === 0 ? 0 : Math.max(0, subtotal + delivery_fee - discount - coinSavings)

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART' } text2={'TOTAL'}/>
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>  
            <div className='flex justify-between'>
                <p >Subtotal</p>
                <p>{currency} {subtotal}.00</p>
            </div> 
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}.00</p>
            </div>
            {appliedRedemption && appliedRedemption.discountAmount > 0 && (
                <>
                    <hr />
                    <div className='flex justify-between text-green-600'>
                        <p>Redemption Discount</p>
                        <p>-{currency} {discount}.00</p>
                    </div>
                </>
            )}
            {Object.keys(coinDiscounts).length > 0 && coinSavings > 0 && (
                <>
                    <hr />
                    <div className='flex justify-between text-blue-600'>
                        <p>Coin Discount</p>
                        <p>-{currency} {coinSavings}.00</p>
                    </div>
                </>
            )}
            {appliedRedemption && appliedRedemption.freeItem && (
                <>
                    <hr />
                    <div className='flex justify-between text-green-600'>
                        <p>{appliedRedemption.freeItem.description}</p>
                        <p>FREE</p>
                    </div>
                </>
            )}
            <hr />
            <div className=' flex justify-between'>
                <b>Total</b>
                <b>{currency}{finalTotal}.00</b>
            </div>
        </div>
    </div>
  )
}

CartTotal.propTypes = {
    appliedRedemption: PropTypes.shape({
        discountAmount: PropTypes.number,
        freeItem: PropTypes.shape({
            description: PropTypes.string
        })
    }),
    coinDiscounts: PropTypes.object
}

export default CartTotal