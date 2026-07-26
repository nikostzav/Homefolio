import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.token || 
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

export default authenticateToken;
