import React from 'react';
import './App.css';
import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfToText = (data) => {
  return pdfjs.getDocument(data).promise.then((pdf) => {
    return pdf.getPage(1).then((page) => {
      return page.getTextContent().then((textContent) => {
        return textContent.items.map((item) => {
          return item.str;
        }).slice(8, 132);
      });
    });
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(files) {
    const reader = new FileReader();
    let component = this;
    reader.onload = (e) => {
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
        component.setState({ items: results });
      });
    };
    reader.readAsArrayBuffer(files[0]);
  }

  render() {
    return (
      <div className="App" >
        <header>
          HEXACO test results viz
        </header>
        <input
          className="App-link"
          type="file"
          id="input"
          onChange={(e) => this.handleFileChange(e.target.files)}
        />
        {this.state.items.map(item => (
          <div key={item.label}>
            <p>{item.label}</p>
            <div className="score-container">
              <div className="score-amount" style={{ width: `${(parseFloat(item.score) / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
