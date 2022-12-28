const express = require("express");;
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(multer());


let newName 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
   newName = Date.now() + file.originalname 
    cb(null, newName); 
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload",urlencodedParser, upload.single("file"), (req, res) => {
  try {
    return res.status(200).json(newName);


  

  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
