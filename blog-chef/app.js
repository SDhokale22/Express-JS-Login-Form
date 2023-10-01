//view engin pug
import express from "express";
import { join } from "path";
import morgan from "morgan"; //npm i morgan
import { createWriteStream } from "fs";
import session from "express-session"; //npm i express-session
import compression from "compression";
import protectRoute from "./utils/protectRoute";

const app = express();
const logFile = join(__dirname, "blogchef.log"); //creating the blogchef file

app.use(compression());
//logging with morgan
app.use(morgan(":method - :url - :date - :response-time ms"));
app.use(
    morgan(":method - :url - :date - :response-time ms",{
    stream: createWriteStream(logFile, {flags: "a"}
    ),
    })
);
app.use("/assets", express.static(join(__dirname, "public")));
//middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/admin", session({
    name: "sessId",
    resave: false,
    saveUninitialized: true,
    secret: app.get("env") === "production" ? process.env.sessionSecret : "2bb375d5abe58776bbf28695",
    cookie: {
        httpOnly: true,
        maxAge: 1800000,
        secure: app.get("env") === "production" ? true : false,
    },
})
);

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("<h1>BlogChef</h1>");
});

app
  .get("/admin", (req,res) => 
    req.session.user
        ? res.redirect("/admin/dashboard")
        : res.redirect("/admin/login")
        )  
  .get("/admin/login", (req, res) => res.render("login"))
  .post("/admin/login", (req, res) => {
    const {email, password} = req.body;
    //console.log("E-mail:", email);
    //console.log("Password:", password);
    if(email === "homer@springfield.com" && password === "donuts"){
        req.session.user = "Home Simpson";
        return res.redirect("/admin/dashboard");
    }
    res.redirect("/admin.login");
    });

app.get("/admin/dashboard", protectRoute("/admin/login"), (req, res) => {
  res.render("dashboard", {
    user: req.session.user,
    posts: [
      {
        id: 1,
        author: "Joe M",
        title: "I love Express",
        content: "Express is a wonderful framework for building Node.js apps"
      },
      {
        id: 2,
        author: "Mike F",
        title: "Have you tried Pug?",
        content:
          "I recently tried the Pug templating language and its excellent"
      }
    ]
  })
});

app.get("/admin/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/admin/login");
});
     

app.post("/admin/approve", (req, res) => res.redirect("/admin/dashboard"));
//Middleware
app.post("/api/posts", (req,res) => {
    console.log(req.body);
    res.json({message: "Got it!!"});
});

app.listen(3000, () => console.log("Blog Chef is cooking on port 3000"));
