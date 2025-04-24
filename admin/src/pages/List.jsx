import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit form states
  const [editId, setEditId] = useState("");
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [showcase, setShowcase] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stockValues, setStockValues] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Handle stock value changes
  const handleStockChange = (size, value) => {
    setStockValues(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }));
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price);
    setCategory(item.category);
    setSubCategory(item.subCategory);
    setBestseller(item.bestseller || false);
    setShowcase(item.showcase || false);
    setSizes(item.sizes || []);
    setExistingImages(item.images || []);
    
    // Initialize stock values
    const initialStock = {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0
    };
    
    // If product has stock data, update initialStock
    if (item.stock) {
      Object.keys(item.stock).forEach(size => {
        initialStock[size] = item.stock[size];
      });
    }
    
    setStockValues(initialStock);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    // Reset form fields
    setEditId("");
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Men");
    setSubCategory("Topwear");
    setBestseller(false);
    setShowcase(false);
    setSizes([]);
    setExistingImages([]);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setStockValues({
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create stock object with selected sizes
      const stockData = {};
      sizes.forEach(size => {
        stockData[size] = stockValues[size];
      });

      const formData = new FormData();
      formData.append("id", editId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("showcase", showcase);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", JSON.stringify(stockData));
      
      // Append existing images
      if (existingImages.length > 0) {
        formData.append("images", JSON.stringify(existingImages));
      }
      
      // Append new images if any
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        closeEditModal();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Calculate total stock for a product
  const getTotalStock = (item) => {
    if (!item.stock) return 0;
    return Object.values(item.stock).reduce((sum, qty) => sum + qty, 0);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className="text-center">Edit</b>
          <b className="text-center">Remove</b>
        </div>
        
        {/* Product list */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img
              className="w-12"
              src={item.images && item.images.length > 0 ? item.images[0] : ""}
              alt=""
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p className={getTotalStock(item) <= 10 ? "text-red-500 font-medium" : ""}>{getTotalStock(item)}</p>
            <button
              onClick={() => openEditModal(item)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-center"
            >
              Edit
            </button>
            <button
              onClick={() => removeProduct(item._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-center"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
         <div className="min-h-screen flex items-center justify-center px-4"> 
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-10 transition-transform transform duration-300 ease-out scale-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>
          <button 
            onClick={closeEditModal}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold transition"
          >
            &times;
          </button>
        </div>
    
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          
          {/* Image Upload Section */}
          <div>
            <p className="font-medium text-gray-700 mb-2">Current Images</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {existingImages.map((img, index) => (
                <div key={index} className="relative rounded shadow-md">
                  <img src={img} alt="" className="w-24 h-24 object-cover rounded" />
                  <button 
                    type="button"
                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
    
            <p className="font-medium text-gray-700 mb-2">Upload New Images</p>
            <div className="flex gap-3 flex-wrap">
              {[image1, image2, image3, image4].map((img, i) => (
                <label htmlFor={`edit-image${i + 1}`} key={i} className="cursor-pointer">
                  <img 
                    src={!img ? assets.upload_area : URL.createObjectURL(img)} 
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded object-cover hover:scale-105 transition"
                    alt=""
                  />
                  <input
                    type="file"
                    id={`edit-image${i + 1}`}
                    hidden
                    onChange={(e) => {
                      const setter = [setImage1, setImage2, setImage3, setImage4][i];
                      setter(e.target.files[0]);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
    
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter product name"
                required
              />
            </div>
    
            <div>
              <label className="block mb-1 text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Write product description..."
                required
              />
            </div>
    
            {/* Category and Price */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">Subcategory</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                  <option value="gymtees">Gym Polyester tees</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="299"
                />
              </div>
            </div>
          </div>
    
          {/* Size Selection */}
          <div>
            <p className="font-medium text-gray-700 mb-2">Available Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    )
                  }
                  className={`px-4 py-1 rounded-full text-sm font-semibold border transition ${
                    sizes.includes(size)
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Stock Management */}
          <div>
            <p className="font-medium text-gray-700 mb-2">Stock Management</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {sizes.map(size => (
                <div key={size} className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">{size}</label>
                  <input
                    type="number"
                    min="0"
                    value={stockValues[size]}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
    
          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={() => setBestseller((prev) => !prev)}
              />
              Add to Bestseller
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showcase}
                onChange={() => setShowcase((prev) => !prev)}
              />
              Add to Showcase
            </label>
          
          </div>
    
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
      )}
    </>
  );
};

export default List;