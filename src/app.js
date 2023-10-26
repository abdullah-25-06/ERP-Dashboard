import express from "express";
import connectDB from "./db/connection.js"
import user_router from "./routes/user_route.js";
import prop_router from "./routes/property_route.js";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use('/',user_router)
app.use('/',prop_router)

const PORT = process.env.PORT;
const start = async () => {
  try {
    await connectDB(process.env.Mongo_uri);
    app.listen(PORT, () => {
      console.log(`listening on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start()