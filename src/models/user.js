import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  placeOfBirth: {
    type: String,
  },
  nation: {
    type: String,
  },
  education: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
});

const workExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("User", userSchema,projectSchema,workExperienceSchema);

export default UserModel;
