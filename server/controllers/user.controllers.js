const User = require("../models/user.models");
const { default: AppError } = require("../utils/appError");


const cookieOptions={
    secure:true,
    maxAge:7*24*60*60*1000,
    httpOnly:true
}

const register = async(req,res)=>{
    const{fullname,email,password}=req.body;
    if(!fullname||!email||!password){
        return next(new AppError('All fields are required ',400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        //Now if user email already exists
        return next(new AppError('Email already exists ',400));
    }

    //Incase if user doesnot exists create a new one
    //Mongoose helps to complete this task
    const user = User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url: ''
        }

    })
//If there is some error in creating the User
    if(!User){

        return next(new AppError('User regestration failed,please try again ',400));


    }

    //TODO:Upload user picture

    //Now we will save the instance of the user we created
    (await user).save();

    //TODO : get JWT token in cookie


//We donot want to send the password back as an response 
    user.password=undefined;

    res.status(200).json({
        success:true,
        message:'User registered Successfully',
        user
    })
}
const login= async (req,res)=>{

    const{email,password}=req.body;
     
    if(!email || ! password){
        return next(new AppError('All fields are required ',400));
    }

    const user = await User.findOne({
       email
    }).select('+password');

    if(!user || !user.comparePassword(password)){
        return next(new AppError('Email or Password do not match' ,400));
    }

    //If password matches
    
    const token = await user.generateJWTToken();
    user.password=undefined;

    res.cookie('token',token,cookieOptions);

    res.status(201).json({
        success:true,
        message:'User registered successfully',
        user

    })



}

const logout=(req,res)=>{
    //To logout we need to make our cookie null
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
});
res.status(200).json({
    success:true,
    message:"User logged out successfully"
})


}

const getProfile=(req,res)=>{
    const user =User.findById(req.user.id)
    try{
        res.status(200).json({
            success:true,
            message:'User details',
            user
        })
        }catch(e){
            res.status(400).json({
              message:"Failed"
            })
        }

        
    }





module.exports={
    register,
    login,
    logout,
    getProfile

}
