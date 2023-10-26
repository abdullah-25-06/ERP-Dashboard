import { Router } from "express";
import Auth from "../middleware/checkAuth.js";
import { createProperty,deleteProperty,getAllProperties,getPropertyDetails,updateProperty} from '../controller/property.js';
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer'
import path from 'path'
// cloudinary.config({ 
//   cloud_name: process.env.Cloud_Name, 
//   api_key: process.env.API_Key, 
//   api_secret:process.env.API_Key_Secret 
// });

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

// const upload = multer({ 
//     dest:'images',
//     fileFilter(req,file,cb){
//         cb(null,true)
//     },
//     filename:(req,file,cb)=>{
//       console.log(file)
//       cb(null,Date.now() + path.extname(file.originalname))
//     }
//   })
const storage = multer.diskStorage({
  filename:(req,file,cb)=>{
    console.log(file)
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({storage:storage})
const prop_router = Router()

prop_router.route('/create').post(Auth,upload.single('photo'),createProperty)
prop_router.route('/delete/:id',deleteProperty)
prop_router.route('/all').get(Auth,getAllProperties)
prop_router.route('/detail/:id',getPropertyDetails)
prop_router.route('/update/:id',updateProperty)

export default prop_router