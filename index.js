let fs = require('fs'),
  PDFParser = require("pdf2json"),
  jsonPath = require('jsonpath');

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
  //fs.writeFile("./output.json", JSON.stringify(pdfData));
  let i = 8;
  while (i < 132) {
    let label = decodeURIComponent(jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`)[0]);
    let score = jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`)[0];
    let median = jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`)[0];
    let tenth90th = decodeURIComponent(jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`)[0]);
    console.log(`${label}: ${score}, Median: ${median}, 10th-90th P: ${tenth90th}`);
  };
});

pdfParser.loadPDF("/Users/felipecsl/Downloads/HEXACO-results-felipe.pdf");