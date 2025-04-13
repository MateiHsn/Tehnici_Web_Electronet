const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// var persoana = {
//     nume : "Ionescu",
//     prenume : "Gigel",

// }

// console.log(persoana.nume);
// persoana.prop = "altceva";
// console.log(persoana.nume);

// console.log(persoana);
// console.log(persoana["nume"]);

// var a = {
//     b : [
//         10,
//         {c: "ionel"},
//         true,
//         {vector: [1,23,{d:100}]}
//     ]
// }

// console.log(a.b[1].c);
// console.log(a.b[3].vector[2].d)

// v = [10,27,11,30,28];

// nrImpar = v.find(function(elem){
//     return elem % 100 == 1;
// })

// console.log(nrImpar);

app = express();

app.set("view engine", "ejs");

obGlobal = {
    obErori: null,
    obImagini: null
}

// vect_foldere = ["temp", "backup", "temp1"];
// for(let folder of vect_foldere){
//     let cale_folder = path.join(__dirname, folder)
//     if(!fs.existsSync()){
//         fs.mkdirSync(cale_folder);
//     }
// }

// clip video 
// 1. curs HTML
// taguri video / audio
// varianta a 2-a 

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu); 

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier )
        
    }
    console.log(obGlobal.obImagini)
}
initImagini();

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    // console.log(obGlobal.obErori)

}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}

console.log("Calea proiectului: "+__dirname);
console.log("Calea Fisierului index.js: "+__filename);
console.log("Calea folderului de lucru: "+process.cwd());

app.get("/",function(req,res){
    res.render("pagini/index");
});

// app.get("/index/a",function(req,res){
//     res.render("pagini/index");
// });


app.get(/^\/resurse\/[a-zA-Z1-9_\/]*$/,function(req,res,next){
    afisareEroare(res,403);
})

app.use("/resurse",express.static(path.join(__dirname,"resurse")));
app.use("/node_modules", express.static(path.join(__dirname,"node_modules")));


app.get(["/","/home","/index"],function(req,res){
    res.render("pagini/index", {ip:req.ip,imagini:obGlobal.obImagini.imag})
});

// app.get("/despre",function(req,res){
//     res.render("pagini/despre");
// });

app.get("/fisier",function(req,res){
    res.sendFile(path.join(__dirname,"package.json"));
});

// app.get("/cerere",function(req,res){
//     res.send("<h1 style = 'color:green'>Buna seara!</h1>");
// });

// app.get("/abc",function(req,res,next){
//     res.write("Data de azi: ");
//     next();
// });

// app.get("/abc",function(req,res,next){
//     res.write((new Date())+'');
//     res.end();
//     // next();
// })

app.get("/favicon.ico",function(req,res){
    res.sendFile(path.join(__dirname,"resurse/imagini/favicon/favicon.ico"));
});


app.get("/*.ejs",function(req,res){
    afisareEroare(400);
})

app.get("/*",function(req,res,next){
    try{
        res.render("pagini"+req.url,function(err,rezultatRandare){
        if(err){
            if(err.message.startWith("Failed to lookup view")){
                afisareEroare(res,err);
            }else{
                afisareEroare(res);
            }
        }else{
            console.log(rezultatRandare);

        }
    });
    }
    catch (errRandare){
        // if(errRandare.message.startWith("Cannot find module ")){
// 
        // }
    }
})



app.listen(8080);
console.log("Serverul a pornit");


