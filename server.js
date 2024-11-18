const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());


const events = [
  {
    "name": "default",
    "description": "No events at this time"
  },
  {
    "name": "spring",
    "description": "some events entered"
  },
  {
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

app.post("/api/events", (req, res) => {
  const result = validateEvent(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

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

  return schema.validate(event);
};

app.listen(3001, () => {
  console.log("Listening...");
});