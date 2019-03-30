import React from 'react';

export default class StockSymbolInput extends React.Component {
  state = {
    symbol: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.getSubmit(this.state.symbol);
    this.setState({symbol: ''});
  };

  handleChange = event => {
    this.setState({symbol: event.target.value.toUpperCase()});
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Type in a Stock Symbol: </label>
        <input type="text" onChange={this.handleChange} value={this.state.symbol} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
