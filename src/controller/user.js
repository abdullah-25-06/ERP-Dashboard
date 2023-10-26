import userModel from "../models/user.js";
import asyncHandler from "express-async-handler";
import CustomErrorApi from "../error/error.js";
import  {generateAuthToken} from '../utils/jwt.js'
import bcrypt from 'bcrypt'
export const Register = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;
  if (!email || !password || !name) {
    throw new CustomErrorApi(
      "Please Enter all name and email and password",
      400
    );
  }
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    throw new CustomErrorApi("User already exists with same email", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await userModel.create({ name, email, password: hashPassword });

  const { access_token, refresh_token } = generateAuthToken(user);
  const token = await userModel.updateOne(
    { _id: user._id },
    { token: access_token }
  );
  if (!token) {
    throw new CustomErrorApi("Try again to register", 400);
  }
  return res.status(200).json({ user, access_token, refresh_token });
});

export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { access_token, refresh_token } = generateAuthToken(user);

    const token = await userModel.findByIdAndUpdate(
      { _id: user._id },
      { token: access_token }
    );

    return res.status(200).json({ access_token, refresh_token });
  }
  throw new CustomErrorApi("Invalid email or password", 400);
});

export const Logout = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(req.user);
  await userModel.findByIdAndUpdate({ _id: id }, { token: null });
  res.status(200).send({ message: "You have been logged out" });
});

export const me = asyncHandler(async (req,res) => {
  const user = await userModel.findById({_id:req.user.id}).select({password:0})
  if (!user){
    throw new CustomErrorApi('No User with this Email',404)
  }
  return res.status(200).json({user})
})
// export default { Register, Login, Logout };
