import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const server = process.env.SERVER;
const database = process.env.DATABASE

const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(`mongodb+srv://${server}/${database}`)
        console.log('Connection Successful')
        
    }
    catch(err){
        console.log('Failed to connect' + err);
    }
}

export default connectDB;