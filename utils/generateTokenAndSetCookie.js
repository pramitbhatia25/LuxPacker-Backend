import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,   //Will not be accessible by jS(XSS attacks)
    secure: process.env.NODE_ENV === "production" ? true : false, //http vs https localhost vs prod
    sameSite: "strict", //preventsCSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000  // 1 day
  };

  res.cookie("token", token, options);

  return token;
};