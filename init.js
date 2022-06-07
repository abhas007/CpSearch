var fs = require('fs');
const {extractKeywords}=require('./helpers/extractor')
let keywordsArray = [];
let distinctKeywordsArray = [];
let IDF = [];


for(let i = 1; i < 3286; i++){
    const data = fs.readFileSync(__dirname + "\\problems\\problem_text_"+i+".txt", "utf-8");
    let extraction_result = [];
    extraction_result = extractKeywords(data);
    keywordsArray = [...keywordsArray, ...extraction_result];
}

// console.log(distinctKeywordsArray.length);
// console.log(keywordsArray.length);

keywordsArray.sort();
distinctKeywordsArray = [... new Set(keywordsArray)];
distinctKeywordsArray.sort();

let frequency = [];
let cnt = 0;
let j = 0;
for(let i = 0; i < keywordsArray.length; i++){
    if(distinctKeywordsArray[j] === keywordsArray[i]){
        cnt++;
    }else{
        frequency.push(cnt);
        cnt = 0;
        j++;
        i--;
    }
}
frequency.push(cnt);

// console.log(distinctKeywordsArray[0]);
// console.log(keywordsArray[0]);
// console.log(frequency.length);

// console.log("\n");
// console.log(frequency[0] / 3285);

for(let i = 0; i < frequency.length; i++){
IDF.push(Math.log10( 3285 / frequency[i]));
}

const writeStream = fs.createWriteStream('txt/keywords.txt');
const pathName = writeStream.path;
distinctKeywordsArray.forEach(value => writeStream.write(`${value}\n`));


const writeStream1 = fs.createWriteStream('txt/IDF.txt');
const pathName1 = writeStream1.path;
IDF.forEach(value => writeStream1.write(`${value}\n`));


writeStream.on('finish', () => {
  console.log(`wrote all the array data to file ${pathName}`);
});
writeStream1.on('finish', () => {
  console.log(`wrote all the array data to file ${pathName1}`);
});

writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
});
writeStream1.on('error', (err) => {
  console.error(`There is an error writing the file ${pathName1} => ${err}`)
});

writeStream.end();
writeStream1.end();

// Now calculating TFIDF values

let magnitude = new Array(3285);

for (let i=0; i<3285; ++i) magnitude[i] = 0;

for(let i = 1; i < 3286; i++){
    const data = fs.readFileSync(__dirname + "\\problems\\problem_text_"+i+".txt", "utf-8");

    let extraction_result = [];
    extraction_result =  extractKeywords(data);

    let distinctExtractedKeywords = [... new Set(extraction_result)];

    distinctExtractedKeywords.sort();
    extraction_result.sort();

    let freqOfKeywordsInExtractionResult = [];

    let cnt = 0;
    let k = 0;
    for(let m = 0; m < extraction_result.length; m++){
        if(distinctExtractedKeywords[k] === extraction_result[m]){
            cnt++;
        }else{
            freqOfKeywordsInExtractionResult.push(cnt);
            cnt = 0;
            k++;
            m--;
        }
    }
    freqOfKeywordsInExtractionResult.push(cnt);

    for(let m = 0; m < distinctExtractedKeywords.length; m++){
        if(freqOfKeywordsInExtractionResult[m] != 0){
            let KWindex = distinctKeywordsArray.indexOf(distinctExtractedKeywords[m]);
            let TFval = freqOfKeywordsInExtractionResult[m] / (extraction_result.length);

            let TFIDFval = TFval * IDF[KWindex];

            magnitude[i - 1] += (TFIDFval * TFIDFval);
            fs.appendFileSync("txt/TFIDF.txt", `${i} ${KWindex} ${TFIDFval}\n`, "utf-8");
        }
    }

    magnitude[i - 1] = Math.sqrt(magnitude[i - 1]);

}

const writeStream2 = fs.createWriteStream('txt/magnitude.txt');
const pathName2 = writeStream2.path;
magnitude.forEach(value => writeStream2.write(`${value}\n`));
writeStream2.end();

console.log("TFIDF created successfully");
console.log('readFile called');


console.log(IDF);
console.log(distinctKeywordsArray);