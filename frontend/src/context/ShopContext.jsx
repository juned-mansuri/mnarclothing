import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/frontend_assets/assets"; This is Local Data

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 59;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')
  const [coinBalance, setCoinBalance] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [coinTransactions, setCoinTransactions] = useState([]);
  const [cartCoinDiscounts, setCartCoinDiscounts] = useState({}); // Store coin discounts for cart items

  const navigate = useNavigate();

  const addToCart = async (itemId, size, discountData = null) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    // Handle coin discount data - only store if coins are actually being used
    const discountKey = `${itemId}_${size}`;
    const newDiscounts = { ...cartCoinDiscounts };
    
    if (discountData && discountData.coinsUsed > 0) {
      newDiscounts[discountKey] = {
        coinsUsed: discountData.coinsUsed,
        discountAmount: discountData.discountAmount,
        originalPrice: discountData.originalPrice,
        discountedPrice: discountData.discountedPrice
      };
      setCartCoinDiscounts(newDiscounts);
      localStorage.setItem('cartCoinDiscounts', JSON.stringify(newDiscounts));
      
      // Deduct coins from balance
      setCoinBalance(prevBalance => prevBalance - discountData.coinsUsed);
    } else {
      // Remove any existing discount for this item if no coins are being used
      if (newDiscounts[discountKey]) {
        delete newDiscounts[discountKey];
        setCartCoinDiscounts(newDiscounts);
        localStorage.setItem('cartCoinDiscounts', JSON.stringify(newDiscounts));
      }
    }

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    if (token) {
      try {
        
        await axios.post(backendUrl + '/api/cart/update' , {itemId,size,quantity},{headers:{token}})

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
      
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      
      // Skip calculation if product no longer exists
      if (!itemInfo) {
        console.log(`Product ${items} not found, skipping cart amount calculation`);
        continue;
      }
      
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            const discountKey = `${items}_${item}`;
            const discountInfo = cartCoinDiscounts[discountKey];
            
            // Use discounted price if available, otherwise use original price
            const pricePerItem = discountInfo ? discountInfo.discountedPrice : itemInfo.price;
            totalAmount += pricePerItem * cartItems[items][item];
          }
        } catch (error) {
          console.log(`Error calculating cart amount for item ${items}:`, error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
     
      if (response.data.success) {
        setProducts(response.data.products);
        
      }
      else{
          toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }
  const getUserCart = async (token) => {
    try {
      
      const response  = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
      if (response.data.success) {
        setCartItems(response.data.cartData)
        
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }
  useEffect(()=>{
      getProductsData()
    
     },[])

useEffect(() => {
    if (!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
        getUserCart(localStorage.getItem('token'))
    }  

    // Load coin discounts from localStorage
    const savedDiscounts = localStorage.getItem('cartCoinDiscounts');
    if (savedDiscounts) {
      setCartCoinDiscounts(JSON.parse(savedDiscounts));
    }
}, [])

  // Coin-related functions
  const getCoinBalance = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(backendUrl + '/api/coins/balance', {}, {headers: {token}});
      if (response.data.success) {
        setCoinBalance(response.data.coinBalance);
        setTotalCoinsEarned(response.data.totalCoinsEarned);
        setCoinTransactions(response.data.transactions);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch coin balance");
    }
  };

  const generateReferralCode = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(backendUrl + '/api/coins/referral-code', {}, {headers: {token}});
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate referral code");
    }
  };

  const redeemCoins = async (rewardType, customAmount, customDescription) => {
    if (!token) return;
    
    try {
      const response = await axios.post(backendUrl + '/api/coins/redeem', {
        rewardType,
        customAmount,
        customDescription
      }, {headers: {token}});
      
      if (response.data.success) {
        toast.success(response.data.message);
        setCoinBalance(response.data.newBalance);
        await getCoinBalance(); // Refresh coin data
        return response.data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to redeem coins");
    }
  };

  const getAvailableRewards = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(backendUrl + '/api/coins/rewards', {}, {headers: {token}});
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch available rewards");
    }
  };

  // Load coin balance when user logs in
  useEffect(() => {
    if (token) {
      getCoinBalance();
    }
  }, [token, getCoinBalance])

  // Function to clear all coin discounts
  const clearAllCoinDiscounts = () => {
    setCartCoinDiscounts({});
    localStorage.removeItem('cartCoinDiscounts');
    toast.success("All coin discounts removed");
  };


  const value = {
    products,
    currency,
    delivery_fee,
    search,
    showSearch,
    setSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setCartItems,
    token,
    setToken,
    // Coin-related values and functions
    coinBalance,
    totalCoinsEarned,
    coinTransactions,
    cartCoinDiscounts,
    setCartCoinDiscounts,
    clearAllCoinDiscounts,
    getCoinBalance,
    generateReferralCode,
    redeemCoins,
    getAvailableRewards
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
