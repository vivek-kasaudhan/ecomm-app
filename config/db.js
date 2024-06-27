import mongoose from "mongoose";


const connectDb = async()=>{
try{
const conn = await mongoose.connect(process.env.MONGO_URL)
console.log(`connected to mongodb database `)
}catch(error){
    console.log(`error in mongodb ${error}`.bgRed.white)
}
}

export default connectDb