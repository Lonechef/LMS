const isLoggedin =function(req,res,next){
    //We will be getting token from the cookie
    const{token}=req.cookies;
    if(!token){
        return next(new AppError('Unauthenticated, please login',401))
    }  
    const tokenDetails =jwt.verify(token,process.env.JWT_SECRET);
    if(!tokenDetails){
        return next(new AppError('Unauthenticated, please login',401))
    }
    req.user =tokenDetails;
    next();
}
module.exports={
    isLoggedin
}