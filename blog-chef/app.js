import express from "express";
//import {parse} from "querystring";
import {join} from "path";

const app = express();
/*
const isPalindrome = str => {
    let trimAndPrepare = str
        .toLowerCase()
        .trim()
        .replace(/[\w_]/g, "");
    return (
        trimAndPrepare === 
        trimAndPrepare
        .split("")
        .reverse()
        .join("")
    );
};
*/

app.use("/assets", express.static(join(__dirname, "public")));

app.get("/", (req,res) =>{
    res.status(200).send("<h1>Blog chef says Hello!!</h1>");
});

app.get("/admin/login", (req,res) =>{
    res.sendFile(join(__dirname, "views", "login.html"));
}).post("/admin/login", (req, res) => {
    res.send("Login successfully!!");
});

/*
app.post("/palindrome", (req,res) =>{
    let body = "";
    req.on("data", data => (body += data));
    res.on("end", () => {
        //console.log(parse(body));
        let {word} = parse(body);
        res.send(
            word 
            ? {
                word,
                isPalindrome: isPalindrome(word)
            }
            : { message: "No word supplied"
        });
    });
});
*/
app.listen(3000, () => console.log("Blog chef is cooking on port 3000"));
