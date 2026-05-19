import User from "../../models/Auth/User.js";

export const registerUser = async (req , res)=>{
    try {
        const { user , email , password } = req.body;

        if(!user || !email || !password){
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
        const user = await User.create({
         name,
         email,
         password,
      });

      res.status(201).json({
         success: true,
         message: "User registered successfully",
         user,
      });

   } catch (error) {

      res.status(500).json({
         success: false,
         message: error.message,
      });
    }
    }
}