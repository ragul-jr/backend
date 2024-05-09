import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { json } from 'express'

const generateToken =user=>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{
        expiresIn:'15d',
    })
}

export const register =async(req,res)=>{

    const{email,password,name,role,photo,gender}= req.body
    try{

        let user= null

        if(role ==='patient'){
            user= await user.findOne({email})
        }
        else if(role ==='doctor'){
            user= await Doctor.findOne({email})
        }
        if(user){
            return res.this.status(400).json({message:'user already exist'})
        }
        const salt =await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)

        if(role ==='patient'){
            user = new User({
                name,
                email,
                password:hashPassword,
                photo,
                gender

            })
        }
        if(role ==='doctor'){
            user = new Doctor({
                name,
                email,
                password:hashPassword,
                photo,
                gender

            })
        }

        await user.save()
        res.status(200).json({success:true,message:'User successfully created'})

    }    catch(err){
        res.status(200).json({success:false,message:'Internal server error, try again'})
    }
}
    export const login = async(req,res) =>{

        const {email,password} = req.body
        try{

            let user=null

            const patient = await user.findOne({email})
            const doctor =await Doctor.findOne({email})
            
            if(patient){
                user=patient
            }if(doctor){
                user= doctor
            }
            if(!user){
                return res.status(404).json({message:"user not found"})
            }
            const ispasswordMatch =await bcrypt.compare(password,user.password)

            if(!ispasswordMatch){
                return res.status(400).json({status:false,message:"Invaild credentials"})
            }

            const token = generateToken(user)
            

            const {password,role,appointments,...rest}= user._doc

            res 
            .status(200)
            .json({status:true,message:'successfully login',token,data:{...rest},role})
        }    catch(err){
            res 
            .status(500)
            .json({status:false,message:"filed login"})
        }
        
}