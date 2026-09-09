import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Case-insensitive header check
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && typeof authHeader === "string") {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]?.trim();
      } else {
        token = authHeader.trim();
      }
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ 
        success: false, 
        message: "No token, access denied!" 
      });
    }

    const secret = process.env.SECRET_TOKEN;
    if (!secret) {
      console.error("SECRET_TOKEN environment variable missing!");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; 

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export default auth;