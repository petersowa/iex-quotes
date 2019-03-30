import React from 'react';
import StockSymbolInput from './StockSymbolInput';
import ShowStockQuote from './ShowStockQuote';

import {IEXCredits} from './IEX';

export default class App extends React.Component {
  state = {
    quote: {
      timeStamp: new Date(),
      symbol: ''
    }
  };

  refreshCountdown = 120;

  getSubmit = symbol => {
    const timeStamp = new Date();
    this.setState({quote: {symbol, timeStamp}});
  };

  update = () => {
    if (this.refreshCountdown > 0) {
      this.refreshCountdown--;
      return;
    }
    this.refreshCountdown = 120;
    console.log(this.state.quote.symbol, this.state.quote.timeStamp);
    this.setState({quote: {symbol: this.state.quote.symbol, timeStamp: new Date()}});
  };

  componentWillUpdate() {
    this.update();
  }

  componentDidMount() {
    if (!this.interval) {
      this.interval = setInterval(this.update, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <StockSymbolInput getSubmit={this.getSubmit} />
        <ShowStockQuote quote={this.state.quote} />
        <IEXCredits className="IEXCredits" />
      </div>
    );
  }
}
