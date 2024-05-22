import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const signupUser = async (req, res) => {
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

            generateTokenAndSetCookie(newUser._id, res);
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

const loginUser = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(user && isPasswordCorrect){
            generateTokenAndSetCookie(user._id, res);
            res.status(200).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                username: user.username,
            });
        }
        else{
            res.status(400).json({message: "Invalid username or password"});
        }
    }
    catch (error){
        res.status(500).json({message: error.message});
        console.log("Error in loginuser: " , error.message);
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("token","",{maxAge:1});
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({message: err.message});
        console.log("Error in logoutUser: " , err.message);
    }
}

export { signupUser, loginUser, logoutUser };
