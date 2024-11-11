const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/",()=>{
  console.log("getting me");
  response.sendFile(_dirname + "/index.html");
});

app.get("/api/events", (req, res) => {
  const events = 
  [
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
  res.send(events);
});

app.listen(3001, () => {
  console.log("Listening...");
});