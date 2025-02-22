import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// User Signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Check if user is authenticated
export const checkAuth = async (req, res) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        return res.json({ isAuthenticated: true, user });
      } else {
        return res.status(401).json({ isAuthenticated: false });
      }
    } catch (error) {
      return res.status(401).json({ isAuthenticated: false });
    }
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
};

// User Logout
export const logout = async (req, res) => {
  try {
    res.json({
      message: "User logged out successfully",
      isAuthenticated: false,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
