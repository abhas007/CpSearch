const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs"); //View Engine
const path = require("path");
const responseArrayGenerator = require(__dirname+"/helpers/similarity");
const {readFileAsStr} = require(__dirname+'/helpers/extractor');

// -------------------- Global Arrays -----------------
const IDF = readFileAsStr(__dirname+'/txt/IDF.txt');
const uniquekeywords = readFileAsStr(__dirname+'/txt/keywords.txt');
const TFIDF = readFileAsStr(__dirname+'/txt/TFIDF.txt');
const magnitude = readFileAsStr(__dirname+'/txt/magnitude.txt');
const problem_titles = readFileAsStr(__dirname+'/txt/problem_titles.txt');
const problem_urls = readFileAsStr(__dirname+'/txt/problem_urls.txt');
let TFIDF_array = [];
const N = 3285;
for(let j = 0; j <= N; j++){
    TFIDF_array[j] = [];
}

for(let j = 0; j < TFIDF.length; j++){
  let TFIDFval = TFIDF[j].split(" ");
  if(TFIDFval.length != 3) continue;
  TFIDF_array[parseInt(TFIDFval[0])].push( [parseInt(TFIDFval[1]), parseFloat(TFIDFval[2])] );
}

// setting up app

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

const port = process.env.PORT || 8000;

//Assigning Port to our application
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

//@GET /
//description: GET request to home page
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/search", (req, res) => {
  const query = req.body.question;
  const question = query.toLowerCase();
  const arr = responseArrayGenerator(question,uniquekeywords, IDF, TFIDF_array, magnitude, problem_titles, problem_urls);
  if(arr.length == 0) res.render("unavailable");
  else res.render("searchResult",{resp: arr});
});

app.get("/question/:doc_no", (req, res) => {

  const doc_no = req.params.doc_no;
  const idx = doc_no - 1;
  const probStatement = readFileAsStr(__dirname+"\\helpers\\problems\\problem_text_"+ (idx + 1) +".txt");

  res.render("questionDesc", {
      title: problem_titles[idx],
      url: problem_urls[idx],
      statement: probStatement
  });
});