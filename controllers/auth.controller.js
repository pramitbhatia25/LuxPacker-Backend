import bcrypt from "bcryptjs";
import {generateVerificationToken} from "../utils/generateVerificationToken.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import {sendEmail} from "../utils/sendAwsVerificationCode.js";

export const signUpWithPassword = async(req, res) => {
  //Email is unique
  const { email, password, name } = req.body;
  try{
    if(!email || !password || !name){
      return res.status(400).json({message: "Please fill in all fields"});
      throw new Error ("Please fill in all fields");
    }

    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
      return res.status(400).json({success: false, message: "User already exists"});   // Second way to handle error response here instead of using the catch block 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      email, 
      password: hashedPassword,
      name, 
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save(); //saving to database

    //jwt token
    generateTokenAndSetCookie(res, user._id);   //_id is created automatically by mongo for us

    res.status(201).json({
      success: true, 
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });


  } catch(err){
    res.status(400).json({message: err.message, success: false});
  }
}


export const sendVerificationCode = async(req, res) => {
  //Email is unique
  const { email } = req.body;
  try{
    if(!email){
      return res.status(400).json({message: "Please enter the email"});
    }

    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
      return res.status(400).json({success: false, message: "User already exists"});   // Second way to handle error response here instead of using the catch block 
    }

    const verificationToken = generateVerificationToken();

    const user = new User({
      email, 
      name, 
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save(); //saving to database 
    await sendEmail(email, verificationToken);

    res.status(200).json({
      success: true, 
      message: "Email verification code sent successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });


  } catch(err){
    console.log("Error while verifying email", err);
    res.status(400).json({message: err.message, success: false});
  }
}

export const verifyEmail = async(req, res) => {
  const { email, verificationToken } = req.body;
  try{
    if(!verificationToken){
      return res.status(400).json({message: "Please enter the email and verification token"});
    }

    const user = await User.findOne({email, verificationToken, verificationTokenExpiresAt: {$gt: Date.now()}});
    if(!user){
      return res.status(400).json({message: "Invalid or expired verification token"});
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });

  } catch(err){
    console.log("Error while verifying email", err);
    res.status(400).json({message: err.message, success: false});
  }
}


export const forgotPassword = async(req, res) => {
  const { email } = req.body;
  try{
    if(!email){
      return res.status(400).json({message: "Please enter the email"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }

    const resetPasswordToken = generateVerificationToken();

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    await sendEmail(email, resetPasswordToken);

    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully"
    });

  } catch(err){
    console.log("Error while resetting password", err);
    res.status(400).json({message: err.message, success: false});
  }
}

export const resetPassword = async(req, res) => {
  const { email, resetPasswordToken, newPassword } = req.body;
  try{
    if(!email || !resetPasswordToken || !newPassword){
      return res.status(400).json({message: "Please enter the email, reset password token and new password"});
    }

    const user = await User.findOne({email, resetPasswordToken, resetPasswordExpiresAt: {$gt: Date.now()}});
    if(!user){
      return res.status(400).json({message: "Invalid or expired reset password token"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch(err){
    console.log("Error while resetting password", err);
    res.status(400).json({message: err.message, success: false});
  }
}

export const changePassword = async(req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try{
    if(!email || !currentPassword || !newPassword){
      return res.status(400).json({message: "Please enter the email, current password and new password"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordValid){
      return res.status(400).json({message: "Invalid current password"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch(err){
    console.log("Error while changing password", err);
    res.status(400).json({message: err.message, success: false});
  }
}

export const resendVerificationCode = async(req, res) => {
  const { email } = req.body;
  try{
    if(!email){
      return res.status(400).json({message: "Please enter the email"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }

    if(user.isVerified){
      return res.status(400).json({message: "User is already verified"});
    }

    const verificationToken = generateVerificationToken();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    await sendEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully"
    });

  } catch(err){
    console.log("Error while resending verification code", err);
    res.status(400).json({message: err.message, success: false});
  }
}





export const login = async(req, res) => {
  res.send("Login route");
};

export const logout = async(req, res) => {
  res.send("Logout route");
}
