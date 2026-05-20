import User from "../../models/Auth/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken , generateRefreshToken } from "../../services/Auth/sessionService.js";

export const registerUser = async (req , res)=>{
    try {
        const { name , email , password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        const newUser = await User.create({
         name,
         email,
         password: hashedPassword,
      });

      res.status(201).json({
         success: true,
         message: "User registered successfully",
         user : newUser,
      });

   } catch (error) {

      res.status(500).json({
         success: false,
         message: error.message,
      });
    }
}

export const LoginUser = async ( req , res ) => {
    try{
        const { email , password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const accesstoken = generateAccessToken(user);
        const refreshtoken = generateRefreshToken(user);

        res.cookie("accessToken" , accesstoken ,{
            httpOnly:true,
            secure: false,
            sameSite:"strict",
            maxAge: 15*60*1000,
        })

        res.cookie("refreshToken", refreshtoken, {
            httpOnly:true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accesstoken,
            refreshtoken,
            user,
        });

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const LogoutUser = async (req ,res)=>{
    try{
        res.clearCookie("accessToken");
        res.clearCookie
        ("refreshToken");

        res.status(200).json({
            success: true,
            message : "User logged out successfully",
        })

    }catch(error){
        res.status(500).json({
            success : false,
            message: error.message,
        })
    }
}


export const refreshAccessToken = async(req , res)=>{
    try{

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh token not found",
            })
        }

        const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = generateAccessToken(decoded.userId);


        res.cookie("accessToken" , newAccessToken , {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15*60*1000,
        })

        res.status(200).json({
            success:true,
            accessToken: newAccessToken,
        })
    }catch(error){
        res.status(401).json({
            success:false,
            message:"Invalid refresh token",
        })
    }
}