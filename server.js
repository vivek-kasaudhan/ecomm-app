import express from 'express'
import  colors  from "colors"
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './config/db.js'
import authRoutes from './routes/auth.js'
import cors from 'cors'
import categoryRoutes from './routes/category.js'
import productRoutes from './routes/productRoutes.js'









dotenv.config()


//connection database
connectDb()

//rest object
const app =  express()

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use('/api/v1/auth',authRoutes)
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);



app.get('/',(req,res)=>{
    res.send('welcome user')
})

const port = process.env.port || 8080

app.listen(port,()=>{
    console.log(`app is  running in ${process.env.DEV_MODE} MODE at${port}.`.bgCyan.white)
})