
// imports/requires
const express = require("express");
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');
const axios = require("axios");


// setting up the server and template engine and body-parser
app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public"));


// global variables
let output = "";
let code = `// generating  a random number 
const a = Math.random();
console.log(a);`
;
const PORT = 8080;
let lang = '';// current language that's being run

// function to "sanitize" user input, this is an attempt to stop malicious javascript
// we might have to update it as we learn more about javascript injections
function sanitize(input) {
    return input.replace("/<script.*?>.*?<\/script>/gi", '');
}
  
// get route for the home page
app.get("/", function(req, res){
    res.render("index", {"result": output, "userInput": code, "selected": lang});
});

// post route for the home page
app.post("/", async function(req, res){
    code = sanitize(req.body.user_code);
    language = req.body.language;

    // support for running Javascript
    if (language === "Javascript"){
        lang = language;
        const encodedParams = new URLSearchParams();
        encodedParams.append("LanguageChoice", "17");
        encodedParams.append("Program", code);

        const options = {
        method: 'POST',
        url: 'https://code-compiler.p.rapidapi.com/v2',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'e149f8f771msh13670b981967600p15bfa1jsna7a96a2a1df7',
            'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
        },
        data: encodedParams
        };

        await axios.request(options).then(function (response) {
            console.log(response.data.Result);
            output = response.data.Result;
        }).catch(function (error) {
            console.error(error);
            output = error;
        });

    // support for running python code
    } else if (language === "Python") {
        lang = language;
        try {
            const messages = await PythonShell.runString(code);
            output += messages.join('\n');
        } catch (error) {
            output = error.message;
        }

    // support for running C code
    } else if (language === "C"){
        lang = language;
        const encodedParams = new URLSearchParams();
        encodedParams.append("LanguageChoice", "6");
        encodedParams.append("Program", code);

        const options = {
        method: 'POST',
        url: 'https://code-compiler.p.rapidapi.com/v2',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'e149f8f771msh13670b981967600p15bfa1jsna7a96a2a1df7',
            'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
        },
        data: encodedParams
        };

        await axios.request(options).then(function (response) {
            console.log(response.data.Result);
            output = response.data.Result;
        }).catch(function (error) {
            console.error(error);
            output = error;
        });

    // support for running C++ code    
    } else if (language === "C++"){
        lang = language;
        const encodedParams = new URLSearchParams();
        encodedParams.append("LanguageChoice", "7");
        encodedParams.append("Program", code);

        const options = {
        method: 'POST',
        url: 'https://code-compiler.p.rapidapi.com/v2',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'e149f8f771msh13670b981967600p15bfa1jsna7a96a2a1df7',
            'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
        },
        data: encodedParams
        };

        await axios.request(options).then(function (response) {
            console.log(response.data.Result);
            output = response.data.Result;
        }).catch(function (error) {
            console.error(error);
            output = error;
        });
    }

    res.redirect("/");
});


// listening at port 8080
app.listen(PORT, function(){
    console.log("Server started on port " + PORT + "...");
});

