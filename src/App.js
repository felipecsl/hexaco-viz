import React from 'react';
import './App.css';
import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import jsonPath from 'jsonpath';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

let pdfToText = (data) => {
  return pdfjs.getDocument(data).promise.then((pdf) => {
    return pdf.getPage(1).then((page) => {
      return page.getTextContent().then((textContent) => {
        return textContent.items.map((item) => {
          return item.str;
        }).slice(8, 132);
      });
    });
  });
}

function handleFileChange(files) {
  const reader = new FileReader();
  reader.onload = function (e) {
    pdfToText(e.target.result).then((items) => {
      let results = [];
      let i = 0;
      while (i < items.length) {
        results.push({
          label: items[i++],
          score: items[i++],
          median: items[i++],
          tenth90th: items[i++]
        });
      }
      console.log(results);
    });
  }
  reader.readAsArrayBuffer(files[0]);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input
          className="App-link"
          type="file"
          id="input"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </header>
    </div >
  );
}

export default App;
