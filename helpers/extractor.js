const fs = require("fs");
const keyword_extractor = require("keyword-extractor");

function extractKeywords(data){
  let probStatement;
  let extraction_result=[];
  probStatement = data.toString();
  extraction_result =  keyword_extractor.extract(probStatement,{
      language:"english",
      remove_digits: true,
      return_changed_case:true,
      remove_duplicates: true
  });
  return extraction_result;
}

function findFrequency(distinctExtractedKeywords,extraction_result){
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
  return freqOfKeywordsInExtractionResult;
}

let readFileAsStr = (filepath) =>{
  let data = fs.readFileSync(filepath).toString().split("\n");
  return data;
}

module.exports = {extractKeywords, findFrequency, readFileAsStr};