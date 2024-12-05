const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require('mongoose');
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

mongoose.connect(
  'mongodb+srv://Generic:JU0e5NjVLY7RA9c8@clusterofcluster.hdbc3.mongodb.net/?'
)
.then(() => console.log('Connected to mongodb'))
.catch(error => console.log('Couldn\'t connect to mongodb', error));

const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);


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

app.put("/api/events/:id", upload.single('img'), (req, res) => {

  let event = events.find(ev => ev._id === parseInt(req.params.id));
  console.log(event);
  if (!event) res.status(400).send("Event with given id was not found");
  
  const result = validateEvent(req.body);
  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  
  event.name = req.body.name;
  event.description = req.body.description;
  
  res.send(event);
});

app.delete('/api/events/:id', (req, res) => {
  console.log("I am in delete");
  const event = events.find(h => h._id === parseInt(req.params.id));

  if (!event) {
    res.status(404).send('The event with the given id was not found');
  }

  const index = events.indexOf(event);
  events.splice(index, 1);

  res.send(event);
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