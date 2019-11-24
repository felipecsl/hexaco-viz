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
    this.state = { traits: {} };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(files) {
    const colors = ['score-main', 'score-alt'];
    let component = this;
    for (let i = 0; i < files.length; i++) {
      ((file, color) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          pdfToText(e.target.result).then((items) => {
            let i = 0;
            while (i < items.length) {
              let label = items[i++].trim();
              let values = [{
                color: color,
                score: items[i++],
                median: items[i++],
                tenth90th: items[i++]
              }];
              component.setState((state) => {
                let newState = { traits: state.traits };
                newState.traits[label] = newState.traits[label] ? newState.traits[label].concat(values) : values;
                return newState;
              });
            }
          });
        };
        reader.readAsArrayBuffer(file);
      })(files[i], colors[i]);
    }
  }

  render() {
    return (
      <div className="App" >
        <h1>HEXACO test results viz</h1>
        <input
          className="App-link"
          type="file"
          multiple={true}
          accept=".pdf"
          id="input"
          onChange={(e) => this.handleFileChange(e.target.files)}
        />
        {Object.getOwnPropertyNames(this.state.traits).map(trait =>
          this.state.traits[trait].map((item) => (
            <div key={trait + item.color}>
              {item.color === 'score-main' &&
                <p>{trait}</p>
              }
              <div className='score-container'>
                <span className='score-num'>{item.score}</span>
                <div className={'score-amount ' + item.color} style={{
                  width: `${(parseFloat(item.score) / 5) * 100}%`
                }}>
                </div>
              </div>
            </div>
          ))
        )
        }
      </div>
    );
  }
}

export default App;
