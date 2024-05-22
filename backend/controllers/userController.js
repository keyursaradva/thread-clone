import User from "../models/userModel.js"
import bcrypt from "bcryptjs";

const signupuser = async (req, res) => {
    try {
        const { email, password, name, username } = req.body;
        const user = await User.findOne({$or:[{email},{username}]});
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            username
        });
        await newUser.save();

        if(newUser){
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                username: newUser.username,
            });
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }  
    }
    catch (err) {
        res.status(500).json({message: err.message});
        console.log("Error in signupUser: " , err.message);
    }
};

export { signupuser };