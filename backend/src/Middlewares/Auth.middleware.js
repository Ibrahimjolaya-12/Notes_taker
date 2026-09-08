import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // 1. Token nikalo (Header se ya Cookie se)
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(" ")[1]) || req.cookies?.token;

    // 2. Agar token nahi milta
    if (!token) {
      return res.status(401).json({ success: false, message: "No token, access denied!" });
    }

    // 3. Token verify karo aur user payload `req.user` mein save karo
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = decoded; 

    next(); // Aglay step par bhejo
  } catch (err) {
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;