import express from "express";
import mongoose from "mongoose";
import connectDatabase from "./src/database/db.js";
import UserModel from "./src/models/user.js";
import PostModel from "./src/models/post.js";
import CommentModel from "./src/models/comment.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

connectDatabase();

app.use(express.json());

const generateUserId = () => {
  return `US${Math.floor(Math.random() * 10000)}`;
};


app.post("/user/register", async (req, res) => {
  const { userName, birthday,placeOfBirth, nation, education, password } = req.body;

  const userId = generateUserId();
  const user = await UserModel.create({
    _id: userId,
    fullname,
    birthday,
    placeOfBirth,
    nation,
    education,
    password,
  });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const saveUser = await UserModel.create({
   userName,
   password: hashedPassword,
  });

  if (!user) {
    throw new Error("Create user failed");
  }

  res.status(200).json({ message: "User created successfully", data:saveUser });
}); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.post("/user/login", async (req, res) => {
  try {
    const { userName, password } = req.body;


    if (!userName || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

  
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );    
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
   
    res.status(500).json({ error: error.message });
  }
});

//Tạo post
app.post("/post", async (req, res) => {
  const { userId, createAt, content, isPublic } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Post missing userId" });
  }

  const postId = new mongoose.Types.ObjectId(); // Create a unique post ID

  const newPost = await PostModel.create({
    _id: postId,
    userId,
    createAt,
    content,
    isPublic,
  });

  if (!newPost) {
    throw new Error("Create post failed");
  }

  res.status(200).json({ message: "Post created successfully", postId });
});

//Chỉnh sửa post
app.put("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId, createAt, content, isPublic, id_user } = req.body;

  if (!userId || !id_user) {
    return res.status(400).json({ message: "Missing userId or id_user" });
  }

  if (userId !== id_user) {
    return res.status(400).json({ message: "User id not matching" });
  }

  const updatedPost = await PostModel.updateOne(
    { _id: postId, userId },
    {
      createAt,
      content,
      isPublic,
    }
  );

  if (!updatedPost.matchedCount) {
    return res.status(404).json({ message: "Post not found or unauthorized" });
  }

  res.status(200).json({ message: "Update successfully" });
});

// Delete post
app.delete("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    const { userId, id_user } = req.body;
  
    if (!userId || !id_user) {
      return res.status(400).json({ message: "Missing userId or id_user" });
    }
  
    if (userId !== id_user) {
      return res.status(400).json({ message: "User id not matching" });
    }
  
    const deletedPost = await PostModel.deleteOne({ _id: postId, userId });
  
    if (!deletedPost.deletedCount) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
  
    res.status(200).json({ message: "Delete successfully" });
});
  




const PORT = 3080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
