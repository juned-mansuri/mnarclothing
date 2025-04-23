// Update in Product.jsx 
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useSwipeable } from "react-swipeable";
import Modal from "react-modal";
import BestSeller from "../components/BestSeller";
import { toast } from "react-toastify";

Modal.setAppElement("#root"); // for accessibility

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedSizeStock, setSelectedSizeStock] = useState(0);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.images[0]);
        setCurrentIndex(0);
      }
    });
  };

  // Update selected size stock when size changes
  useEffect(() => {
    if (productData && size) {
      // Get stock for selected size
      const stockCount = productData.stock && productData.stock[size] ? productData.stock[size] : 0;
      setSelectedSizeStock(stockCount);
    }
  }, [size, productData]);

  // Handle Buy Now function
  const handleBuyNow = () => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Check if item is in stock
    if (selectedSizeStock <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }
    
    // Add to cart first (reusing existing functionality)
    addToCart(productData._id, size);
    
    // Navigate directly to checkout/place-order page
    navigate("/place-order");
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Check if item is in stock
    if (selectedSizeStock <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    addToCart(productData._id, size);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % productData.images.length;
    setCurrentIndex(nextIndex);
    setImage(productData.images[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + productData.images.length) %
      productData.images.length;
    setCurrentIndex(prevIndex);
    setImage(productData.images[prevIndex]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3 ">
          {/* Thumbnails */}
          <div className="w-full sm:w-[18.7%] flex sm:flex-col flex-row overflow-x-auto sm:overflow-y-auto gap-2 sm:gap-3 pr-2 sm:pr-0 ">
            {productData.images.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => {
                  setImage(item);
                  setCurrentIndex(index);
                }}
                className={`w-20 h-20 object-cover cursor-pointer border-2 rounded ${
                  item === image ? "border-black" : "border-gray-200"
                }`}
                alt="thumb"
              />
            ))}
          </div>

          {/* Main image with zoom/switch */}
          <div
            className="relative w-full sm:w-[80%] h-[500px] bg-white flex items-center justify-center "
            {...swipeHandlers}
          >
            <img
              src={image}
              alt="selected"
              className={`max-h-full max-w-full object-contain transition-transform duration-300 cursor-zoom-in `}
              onClick={() => setModalOpen(true)}
            />
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded shadow"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded shadow"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="" className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          
          {/* Expandable Description */}
          <div className="relative mt-5 text-gray-500 md:w-4/5">
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-full" : "max-h-24"
              }`}
            >
              <p className="whitespace-pre-line">{productData.description}</p>
            </div>

            {/* Fade effect when not expanded */}
            {!expanded && (
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}

            {/* Toggle Button */}
            {productData.description.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-black font-medium hover:underline focus:outline-none"
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => {
                // Check if this size has stock
                const sizeStock = productData.stock && productData.stock[item] ? productData.stock[item] : 0;
                const isOutOfStock = sizeStock <= 0;
                
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => !isOutOfStock && setSize(item)}
                      className={`border py-2 px-4 bg-gray-100 ${
                        item === size ? "border-orange-500" : ""
                      } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isOutOfStock}
                    >
                      {item}
                    </button>
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 border-t border-red-500 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Stock Display */}
            {size && (
              <div className="mt-2">
                <p className={`text-sm ${selectedSizeStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedSizeStock > 0 
                    ? `In Stock: ${selectedSizeStock} items` 
                    : 'Out of Stock'}
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons - ADD TO CART & BUY NOW */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              disabled={!size || selectedSizeStock <= 0}
            >
              ADD TO CART
            </button>
            
            <button
              onClick={handleBuyNow}
              className="bg-orange-500 text-white px-8 py-3 text-sm active:bg-orange-600"
              disabled={!size || selectedSizeStock <= 0}
            >
              BUY NOW
            </button>
          </div>
          
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on Delivery is Available on this product.</p>
            <p>Easy Replace policy within 5 days.</p>
          </div>
        </div>
      </div>

      {/* Modal Fullscreen Viewer */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        overlayClassName="Overlay"
      >
        <div className="relative w-full max-w-5xl p-4">
          <img
            src={image}
            alt="zoom"
            className="w-full object-contain max-h-[90vh]"
          />
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ✕
          </button>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded shadow"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded shadow"
          >
            ▶
          </button>
        </div>
      </Modal>

      {/* Description/Review */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
        </div>
        {/* Expandable Description */}
        <div className="relative mt-5 text-gray-500 md:w-4/5">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-full" : "max-h-24"
            }`}
          >
            <p className="whitespace-pre-line">{productData.description}</p>
          </div>

          {/* Fade effect when not expanded */}
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          {/* Toggle Button */}
          {productData.description.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-black font-medium hover:underline focus:outline-none"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
      {/* Best Seller */}
      <BestSeller/>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
