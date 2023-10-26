import  Router  from "express"
import {Login,Logout,Register,me} from "../controller/user.js"
import Auth from "../middleware/checkAuth.js";
const user_router = Router()

user_router.route('/login').post(Login)
user_router.route('/me').get(Auth,me)
user_router.route('/register').post(Register)
user_router.route('/logout').post(Logout)

export default user_router