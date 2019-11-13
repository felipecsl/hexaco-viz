let PDFParser = require("pdf2json"),
  jsonPath = require('jsonpath');

let parsePDF = (path, callback) => {
  const pdfParser = new PDFParser();
  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", pdfData => {
    let i = 8;
    let results = [];
    while (i < 132) {
      let queryAndIncrement = () => {
        let matches = jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`);
        return decodeURIComponent(matches[0]);
      };
      results.push({
        label: queryAndIncrement(),
        score: queryAndIncrement(),
        median: queryAndIncrement(),
        tenth90th: queryAndIncrement()
      });
    };
    callback(results);
  });
  pdfParser.loadPDF(path);
}

if (process.argv.length < 3) {
  console.warn("Please provide the path to the PDF file with the test results.");
} else {
  parsePDF(process.argv[2], results => {
    results.forEach(r => {
      console.log(`${r.label}: ${r.score}, 50th P: ${r.median}, 10-90th P: ${r.tenth90th}`);
    });
  });
}