//Now in this we will be creating our DataBase connection

const mongoose=require('mongoose');
//We are setting this so that if any field we are requesting
//and if it doesnot exists it wont throw an error
mongoose.set('stringQuery',false)

//Async can be done in two ways one is by using async and await and another is by ussing then

const connectToDB = async () =>{
    try{
        const {connection}=await mongoose.connect(
            process.env.MONGO_URI || 'mongodb+srv://Saumyalms:<Saumyalms>@cluster0.jgosjfi.mongodb.net/'
        )

        if(connection){
            console.log('Connection to MongoDB: ',connection.host);

        }

    }
    catch(e){
        console.log(e);
        //Below line we write to kill if Database is not connected
        process.exit(1);

    }
}

module.exports=connectToDB;