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

const eventSchema = new mongoose.Schema({
  name: String,
  description: String
});

const TheEvent = mongoose.model('EventsDB', eventSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/",(req,res)=>{
  console.log("getting me");
  res.sendFile(_dirname + "/index.html");
});

app.get("/api/events", async(req, res) => {
  const manyEvents = await TheEvent.find();
  res.json(manyEvents);
});

app.post("/api/events",upload.single("img"), async(req, res) => {
  const result = validateEvent(req.body);

  if (result.error) {
    console.log("In post error");
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newEvent = new TheEvent({
    name:req.body.name,
    description:req.body.description
  });

  const newTheEvent = await newEvent.save();
  res.status(200).send(newTheEvent);
});

app.put("/api/events/:id", upload.single('img'), async(req, res) => {
  const result = validateEvent(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  
  const updateThese = {
    name:req.body.name,
    description:req.body.description
  };

  if (req.file) {
    updateThese.main_image = req.file.filename;
  }

  const wentThrough = await TheEvent.updateOne({_id:req.params.id}, updateThese);


  const evnet = await TheEvent.findOne({_id:req.params.id});

  res.send(evnet);
});

app.delete('/api/events/:id', async(req, res) => {
  const leave = await TheEvent.findByIdAndDelete(req.params.id);

  res.send(leave);
});

const validateEvent = (event) => {

  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(8).required(),
  });
  return schema.validate(event);
};

app.listen(3001, () => {
  console.log("Listening...");
});