import mongoose from "mongoose";

const connectToDb = async () => {
   try {
    const connection = await mongoose.connect("mongodb://127.0.0.1:27017/vedioTube");
    if(connection){
        console.log(`DB connected successfully on ${connection.connection.host}`);
    }
   } catch (error) {
    console.log(error);
   }
}

export default  connectToDb;