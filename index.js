const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const passportConfig = require("./passport/passport"); //no need to write app.use(passport), it gets automatically integrated
const passport = require("passport");
const cookieSession = require('cookie-session');

//connect with DB
const connectWithDb = () => mongoose.connect('mongodb://127.0.0.1:27017/passport')
    .then(console.log("DB connected"))
    .catch((err)=>console.log("DB connection issues"));

connectWithDb();

const app = express();

app.use(cookieSession({
    // name: 'session',
    maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
    keys: ['thisislcotokenkey']     // shoudl go into .env
}));

app.use(passport.initialize());
app.use(passport.session());    //helps manage login and isLoggedIn processes through cookies/token and maintainting user sessions

app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("home");
});

app.use("/auth", auth);


app.listen(4001, ()=> console.log(`Server is running at port 4001`));