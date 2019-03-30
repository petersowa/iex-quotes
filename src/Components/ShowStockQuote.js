import React from 'react';

import {IEX} from './IEX.js';

const formatFixed = num =>
  Number(num)
    .toFixed(3)
    .toString();

const showField = (obj, ...fields) =>
  fields.map(field => {
    if (field in obj) {
      let result = obj[field];

      if (field.endsWith('Percent')) {
        result = formatFixed(result * 100) + ' %';
      } else if (field.endsWith('Time') || field.endsWith('Updated') || field.endsWith('Update')) {
        result = new Date(result).toLocaleString();
      } else if (!isNaN(result)) {
        result = formatFixed(result);
      }

      return (
        <tr key={field}>
          <td>{makeString(field)}</td>
          <td>{result}</td>
        </tr>
      );
    }
    return null;
  });

const makeString = field =>
  field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

class ShowStockQuote extends React.Component {
  state = {
    quote: {},
    logo: '',
    previous: ''
  };

  constructor(props) {
    super(props);
    const loadState = sessionStorage.getItem('showstockquote-state');
    console.log(loadState);
    if (!!loadState) {
      //console.log('load state is', loadState);
      this.state = JSON.parse(loadState);
    }
    //console.log('constructor');
  }

  async fetchStockData(sym) {
    try {
      const data = [
        IEX.getData(IEX.paths.logo)(sym),
        IEX.getData(IEX.paths.quote)(sym),
        IEX.getData(IEX.paths.previous)(sym),
        IEX.getData(IEX.paths.company)(sym),
        IEX.getData(IEX.paths.financials)(sym),
        IEX.getData(IEX.paths.stats)(sym),
        IEX.getData(IEX.paths.news)(sym)
      ];
      const [logo, quote, previous, company, financials, stats, news] = await Promise.all(data);
      console.log(logo);
      const timeStamp = this.props.quote.timeStamp;
      this.setState(
        {
          timeStamp,
          logo: logo.data.url,
          quote: quote.data,
          previous: previous.data,
          company: company.data,
          financials: financials.data,
          stats: stats.data,
          news: news.data
        },
        () => {
          sessionStorage.setItem('showstockquote-state', JSON.stringify(this.state));
        }
      );
    } catch (err) {
      console.error('error', err);
    }
  }

  componentDidUpdate(prevProps) {
    const {quote} = this.props;
    const {quote: prevQuote} = prevProps;
    if (quote.symbol === '') return;
    if (quote.symbol === prevQuote.symbol && quote.timeStamp === prevQuote.timeStamp) return;

    this.fetchStockData(this.props.quote.symbol);
  }

  renderImage = (imageUrl, alt = 'logo') => <img src={imageUrl} alt={alt} />;

  renderTableFormat = data => (
    <div>
      <table>
        <thead>
          <tr>
            <th>{this.renderImage(data.logo, 'company logo')}</th>
            <th>{JSON.stringify(data.company, null, 2)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <pre>{JSON.stringify(data.quote, null, 2)}</pre>
            </td>
            <td>
              <pre>{JSON.stringify(data.previous, null, 2)}</pre>
            </td>
          </tr>
          <tr>
            <td>
              <pre>{JSON.stringify(data.financials, null, 2)}</pre>
            </td>
            <td>
              <pre>{JSON.stringify(data.stats, null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  renderHeader = (company, logo) => {
    if (!company) return <div />;
    const {symbol: stocksym, companyName, website, description, CEO, sector, tags} = company;
    return (
      <div>
        <h1>
          <div className="companyLogo">{this.renderImage(logo, 'company logo')}</div>
          <a href={website}>{companyName}</a> - {stocksym} - {sector}
        </h1>

        <ul>
          <li>{description}</li>
          <li>CEO: {CEO}</li>
          <li>TAGS: {tags.map(tag => '[' + tag + ']')}</li>
        </ul>
      </div>
    );
  };

  renderObject = obj => {
    //console.log(Object.keys(obj));
    return Object.keys(obj).map(key => showField(obj, key));
  };

  renderObjectTable = (obj = {}) => {
    //console.log('line 153', obj);
    //return <div>data</div>;
    if (Object.keys(obj).length === 0) return <div>No Data</div>;
    return (
      <div>
        <table>
          <tbody>{this.renderObject(obj)}</tbody>
        </table>
      </div>
    );
  };

  renderQuote = quote => {
    return (
      <div>
        <table>
          <tbody>{this.renderObject(quote)}</tbody>
        </table>
      </div>
    );
  };

  renderList = list => <ul>{list.map(item => <li>{item}</li>)}</ul>;

  render() {
    return (
      <div>
        {this.renderHeader(this.state.company, this.state.logo)}
        {['quote', 'previous', 'stats'].map(key => {
          if (key in this.state) {
            return <div key={key}>{this.renderObjectTable(this.state[key])}</div>;
          }
          return '';
        })}
      </div>
    );
  }
}

export default ShowStockQuote;
