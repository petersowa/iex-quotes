import React from 'react';
import axios from 'axios';

const IEXCredits = props => (
  <pre {...props}>
    “Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View{' '}
    <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.”
  </pre>
);

class IEX {
  static paths = {
    stockAPI: 'https://api.iextrading.com/1.0/stock/',
    dividends: 'dividends/1y',
    delayedQuote: 'delayed-quote',
    quote: 'quote',
    earnings: 'earnings',
    financials: 'financials',
    company: 'company',
    chart: 'chart/3m',
    stats: 'stats',
    previous: 'previous',
    peers: 'peers',
    news: 'news/last/5',
    logo: 'logo'
  };

  static getData = url => sym => {
    const query = IEX.paths.stockAPI + sym + '/' + url;
    console.log(query);
    return axios.get(query);
  };
}

export {IEXCredits, IEX};
