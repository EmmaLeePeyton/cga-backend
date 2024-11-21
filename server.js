const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


const events = [
  {
    "_id": 0,
    "name": "default",
    "description": "No events at this time"
  },
  {
    "_id": 1,
    "name": "spring",
    "description": "some events entered"
  },
  {
    "_id": 3,
    "name": "fall",
    "description": "other events entered"
  }
];
app.get("/",(req,res)=>{
  console.log("getting me");
  res.sendFile(_dirname + "/index.html");
});

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events",upload.single("img"), (req, res) => {
  console.log("i am post");
  const result = validateEvent(req.body);

  if (result.error) {
    console.log("In post error");
    res.status(400).send(result.error.details[0].message);
    return;
  }

  console.log("Data is valid");
  const event = {
    _id: events.length + 1,
    name: req.body.name,
    description: req.body.description,
  };

  events.push(event);
  res.status(200).send(event);
});


const validateEvent = (event) => {

  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(8).required(),
  });
  console.log(schema.validate(event))
  return schema.validate(event);
};

app.listen(3001, () => {
  console.log("Listening...");
});