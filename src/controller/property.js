import PropertyModel from "../models/property.js";
import userModel from "../models/user.js";
import asyncHandler from "express-async-handler";
import CustomErrorApi from "../error/error.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.API_Key,
  api_secret: process.env.API_Key_Secret,
});

const getAllProperties = asyncHandler(async (req, res) => {
  const { price, title } = req.query;
  const product = await PropertyModel.find({ creator: req.user.id,...req.query });
  if (!product) {
    return res.status(200).send("You have no Product");
  }
  return res.status(200).json({ product });
});
const getPropertyDetails = asyncHandler(async (req, res) => {});
const createProperty = asyncHandler(async (req, res) => {
  const { title, description, propertyType, location, price, creator } =
    req.body;
  if (!title || !description || !propertyType || !location || !price) {
    throw new CustomErrorApi("Please provide complete description", 404);
  }
  // for regular construction
  //   const product = await PropertyModel.create({
  //     ...req.body,
  //     creator: req.user.id,
  //   });

  // for atomic cunstruction
  const session = await mongoose.startSession();
  session.startTransaction();

  const photo_url = await cloudinary.uploader.upload(req.file.path);

  const product = await PropertyModel.create({
    ...req.body,
    photo: photo_url.url,
    creator: req.user.id,
  });
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      $push: { allProperties: product },
    },
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomErrorApi("Product can be created", 404);
  }
  await session.commitTransaction();
  return res.status(200).json({ product });
});
const updateProperty = asyncHandler(async (req, res) => {});
const deleteProperty = asyncHandler(async (req, res) => {});

export {
  getAllProperties,
  getPropertyDetails,
  createProperty,
  updateProperty,
  deleteProperty,
};
