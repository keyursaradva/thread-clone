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
};

const followUnFollowUser = async (req,res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({message:"You cannot follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({message:"User not found"});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //unfollow user
            await currentUser.updateOne({$pull:{following:id}});
            await userToModify.updateOne({$pull:{followers:req.user._id}});
            res.status(200).json({message:"User unfollowed successfully"});
        }
        else{
            //follow user
            await currentUser.updateOne({$push:{following:id}});
            await userToModify.updateOne({$push:{followers:req.user._id}});
            res.status(200).json({message:"User followed successfully"});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in followUnFollowUser: " , error.message);
    }
};

const updateUser = async ( req, res) => {
    const {name, email, username, password, profilePic, bio} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(400).json({message:"User not found"});

        if(req.params.id !== userId.toString()) return res.status(400).json({message:"You cannot update other user's profile"});

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({message:"Profile uodated successfully", user})
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("Error in updateUser: " , error.message);
    } 
};

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");
        if(!user){
            res.status(400).json({message:"User not found"});
        }else{
            res.status(200).json(user);
        }

        
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("Error in getUserProfile: " , error.message);
    }
};

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser , getUserProfile};
