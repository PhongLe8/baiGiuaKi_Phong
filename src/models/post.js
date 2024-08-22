import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  createAt: {
    type: String,
  },
  content: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  
});


const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
