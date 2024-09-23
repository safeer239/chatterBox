const mongoose = require('mongoose')

exports.connectDB =async()=>{   
    try {
        const connection = mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("Database connection established✅")
        })
    } catch (error) {
        console.log(error.message);
    }
    
}
