const {Schema,model}=require('mongoose');
const bcrypt = require('bcryptjs');
//JWT can be imported from jsonwebtoken
const jwt =require('jsonwebtoken')

const userSchema = new Schema({
    fullName:{
        type:String,
        required:[true,'Name is required'],
        minLen:[5,'Name must be atleast 5 Characters'],
        maxLen:[50,'Name must be wuthin 50 Characters'],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'This email has been used'],
        lowercase:true,
        trim:true,
        //Now instead of emailValidator we will be using some kind of regex
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Please fill a valid email address'

        ]
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[8,'Password must be atleast 8 Characters'],
        select:false
    },
    //Now we will do authorization whether it is a user or a admin
    role:{
        type:String,
        //enum is something like two possible values
        enum:['USER','ADMIN'],
        defaukt:'USER'

    },

    //Creating a field where a user can upload his profile photo
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date

},{
    timestamps:true

})

//Now during regestration we will be storing our password in encrypted format

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return next();
    }
    //In case if there is change in password
    //hash the value having dynamic characters of length 10
    this.password=await bcrypt.hash(this.password,10);
})

userSchema.method={
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password);
    },
    generateJWTToken: function(){
        return jwt.sign({
            id: this._id, role: this.role, email: this.email, subscription: this.subscription},
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY
            }

        )
    }
}
//Once the password matches and user is there we need to generate the jwt token


const User=  model('User',userSchema);

module.exports=User;