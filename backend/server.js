import express from 'express'
import cors from 'cors' 
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import glimpseRouter from './routes/glimpseRoutes.js'  // Add this import

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
// Middleware
app.use(express.json())
app.use(cors())

// Api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/glimpses', glimpseRouter)  // Add this line to register glimpse routes

app.get('/', (req, res) => {
    res.send("Api Working")
})

app.listen(port, () => console.log('server listening on port : ' + port))