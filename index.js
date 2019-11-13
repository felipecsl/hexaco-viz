let PDFParser = require("pdf2json"),
  jsonPath = require('jsonpath');

let parsePDF = (path) => {
  const pdfParser = new PDFParser();
  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", pdfData => {
    let i = 8;
    while (i < 132) {
      let queryAndIncrement = () => {
        let matches = jsonPath.query(pdfData, `$.formImage.Pages[0].Texts[${i++}].R[0].T`);
        return decodeURIComponent(matches[0]);
      };
      let label = queryAndIncrement();
      let score = queryAndIncrement();
      let median = queryAndIncrement();
      let tenth90th = queryAndIncrement();
      console.log(`${label}: ${score}, 50th P: ${median}, 10-90th P: ${tenth90th}`);
      if ((i - 13) % 5 == 0) {
        console.log('');
      }
    };
  });
  pdfParser.loadPDF(path);
}

if (process.argv.length < 3) {
  console.warn("Please provide the path to the PDF file with the test results.");
} else {
  parsePDF(process.argv[2]);
}