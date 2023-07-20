//There are two ways to to get the express by import or by require
//import cookieParser from 'cookie-parser';
const express =require('express')
//import express from 'express';
const cors =require('cors');
const cookieParser= require('cookie-parser')
const userRoutes=require('./routes/user.routes')
const errorMiddleware=require('./middlewares/error.middleware')


const app =express();
//All the request which are coming we will pass it in json form
app.use(express.json());

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))

app.use(cookieParser());

app.use('/ping',(req,res)=>{
   res.send('Pong');
})

app.use('/api/v1/user',userRoutes);

app.all('*',(req,res)=>{
    res.status(404).send("404 Page Not Found!")
})

//Midlleware which will listen to next

app.use(errorMiddleware);

module.exports= app;