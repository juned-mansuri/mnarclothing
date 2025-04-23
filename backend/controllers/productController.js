import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

    
    // fn for listing product
    const listProducts = async (req,res) => {
        
        try {
            
            const products = await productModel.find({})
            res.json({success:true ,products})  
            
        } catch (error) {
            
            console.log(error)
            res.json({success: false, message: error.message})
        }
        
    }
    // fn for removing product
    const removeProduct = async (req,res) => {
        
        try {
            
            await productModel.findByIdAndDelete(req.body.id)
            res.json({success:true ,message:"Product removed"})
            
        } catch (error) {
            
            console.log(error)
            res.json({success: false, message: error.message})
        }
        
        
    }
    // fn for single product info
    const singleProduct  = async (req,res) => {
        
        try {
            
            const {productId}= req.body
            const product = await productModel.findById(productId)
            res.json({success:true, product})
            
        } catch (error) {
            
            console.log(error) 
            res.json({success: false, message: error.message})
        }
    }
// In ../controllers/productController.js
// In productController.js - update the addProduct function
const addProduct = async (req,res) => {
  try {
      const {name, description, price, category, subCategory, sizes, bestseller, showcase, stock,mystery} = req.body

      const image1 = req.files.image1 && req.files.image1[0]
      const image2 = req.files.image2 && req.files.image2[0]
      const image3 = req.files.image3 && req.files.image3[0]
      const image4 = req.files.image4 && req.files.image4[0]

      const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

      let imagesUrl = await Promise.all(
          images.map(async (item) => {
              let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
              return result.secure_url;
          })
      )

      const stockData = stock ? JSON.parse(stock) : {};
      
      const productData = {
          name,
          description,
          category,
          price: Number(price),
          subCategory,
          bestseller: bestseller === 'true' ? true : false,
          showcase: showcase === 'true' ? true : false,
          showcase: mystery === 'true' ? true : false,
          sizes: JSON.parse(sizes),
          stock: stockData,
          images: imagesUrl,
          date: Date.now()
      }
      
      console.log(productData);
      const product = new productModel(productData);
      await product.save();

      res.json({success: true, message: "Product Added"})

  } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
  }
}

// Also update the updateProduct function to handle stock
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, subCategory, bestseller, showcase, sizes, stock ,mystery } = req.body;
    
    // Validate required fields
    if (!id || !name || !category || !price) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Find the product
    const product = await productModel.findById(id);
    
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Handle image uploads if any
    let imagesUrl = [];
    
    // Check if we have new file uploads
    if (req.files && Object.keys(req.files).length > 0) {
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];
      
      const images = [image1, image2, image3, image4].filter(item => item !== undefined);
      
      if (images.length > 0) {
        // Upload to Cloudinary
        imagesUrl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
            return result.secure_url;
          })
        );
      }
    }
    
    // Check if existing images are provided in the request body
    if (req.body.images && req.body.images.length > 0) {
      try {
        const existingImages = JSON.parse(req.body.images);
        // If we have both new uploads and existing images, combine them
        if (imagesUrl.length > 0) {
          imagesUrl = [...imagesUrl, ...existingImages];
        } else {
          // Otherwise just use the existing images
          imagesUrl = existingImages;
        }
      } catch (e) {
        console.log("Error parsing images", e);
      }
    }
    
    // Parse stock data if provided
    let stockData = {};
    if (stock) {
      try {
        stockData = JSON.parse(stock);
      } catch (e) {
        console.log("Error parsing stock data", e);
      }
    }
    
    // Update product data
    const updatedData = {
      name,
      category,
      price: Number(price),
    };
    
    // Add optional fields if provided
    if (description) updatedData.description = description;
    if (subCategory) updatedData.subCategory = subCategory;
    if (bestseller !== undefined) updatedData.bestseller = bestseller === 'true';
    if (showcase !== undefined) updatedData.showcase = showcase === 'true';
    if (mystery !== undefined) updatedData.mystery = mystery === 'true';
    
    // Handle sizes
    if (sizes) {
      try {
        updatedData.sizes = JSON.parse(sizes);
      } catch (e) {
        console.log("Error parsing sizes", e);
      }
    }
    
    // Add stock data if provided
    if (Object.keys(stockData).length > 0) {
      updatedData.stock = stockData;
    }
    
    // Only update images if we have new ones or existing ones
    if (imagesUrl.length > 0) {
      updatedData.images = imagesUrl;
    }
    
    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // Return the updated document
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export {listProducts , addProduct, removeProduct, singleProduct, updateProduct}
