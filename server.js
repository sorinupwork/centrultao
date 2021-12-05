//Initialize
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT;
const nodemailer = require("nodemailer");
let alert = require("alert");

//DATABASE CONNECTION
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://sorinadam7:sorinadam7@cluster0.89x1y.mongodb.net/centrultao?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("database connected");
  // client.close();
});

mongoose.connect(uri);

//DATABASE CONFIGURATION
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

//DATA PARSING
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//ROUTES
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/user", (req, res) => {
  let newUser = new User({
    name: req.body.userName,
    email: req.body.userEmail,
  });
  newUser.save();

  //NODEMAILER CONFIGURATION
  let transporter = nodemailer.createTransport({
    service: "Yahoo",
    auth: {
      user: "centrultao@yahoo.com",
      pass: "qlatkpxfsxjbmozu",
    },
  });

  //SUBSCRIBER
  const options = {
    from: "centrultao@yahoo.com",
    to: req.body.userEmail,
    subject: "Bine ai venit la Centrul TAO!",
    text: `Salutari!

    Bine ai venit la 
    🙂Centrul pentru Terapii Alternative Optime🙂 
    Iti multumim pentru interesul acordat si iti recomandam sa ne urmaresti in continuare pe pagina de instagram, pentru a fii la curent cu ultimele noutati in materie de workshopuri, cursuri, terapii, meditatii etc.
    
    
    Descarca "Meditatia pentru eliminarea friciilor" in format pdf. de aici: https://www.dropbox.com/s/vcoha3g0mqxdzs0/MEDITATIE%20PENTRU%20ELIMINAREA%20FRICIILOR%20-%20Emanuel%20Necatu%20-%20Centrul%20TAO.pdf?dl=0

    Descarca "Meditatia pentru eliminarea friciilor" in format audio, de aici: https://www.dropbox.com/s/y5sswqpow9203nb/Meditatie%20pentru%20eliminarea%20friciilor%20-%20Emanuel%20Necatu%20-%20Centrul%20TAO.wav?dl=0
    `,
  };

  //CONFIRMATION OF SUBSCRIBER
  const options2 = {
    from: "centrultao@yahoo.com",
    to: "centrultao@yahoo.com",
    subject: "Ai un NOU Subscriber!!!",
    text: `${req.body.userName} tocmai a dat subscribe, verifica: https://charts.mongodb.com/charts-centrultao-yfrdk/public/dashboards/61ac67c0-ee91-4f72-8d29-92dac94312a3`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent: " + info.response);
    }
  });

  transporter.sendMail(options2, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent: " + info.response);
    }
  });
  alert(
    "Inregistrearea a fost un success! Verifica-ti mail-ul pentru mai multe informatii."
  );
  res.redirect("/");
});

//SERVER
app.listen(PORT || 8080, () => console.log(`Server started on PORT ${PORT}`));
