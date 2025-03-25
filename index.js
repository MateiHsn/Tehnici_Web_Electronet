const express = require("express");

const path = require("path");

app = express();

app.set("view engine", "ejs");

console.log("Calea proiectului: "+__dirname);


app.get("/",function(req,res){
    res.render("pagini/index");
});

app.use("/resurse",express.static(path.join(__dirname,"resurse")));

app.get(["/","/home","/index"],function(req,res){
    res.render("pagini/index");
});

app.get("/fisier",function(req,res){
    res.sendFile(path.join(__dirname,"package.json"));
});

app.get("/cerere",function(req,res){
    res.send("<h1 style = 'color:green'>Buna seara!</h1>");
});

app.get("/abc",function(req,res,next){
    res.write("Data de azi: ");
    next();
});

app.get("/abc",function(req,res,next){
    res.write((new Date())+'');
    res.end();
    // next();
})


app.listen(8080);
console.log("Serverul a pornit");


