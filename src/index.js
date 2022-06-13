import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    
    ui(){
      var arr1 = [0,1,2];
      var arr2 = [];
      
      arr1.map(i=>(
        arr2.push(
          <div className="board-row" key = {i}>
            {arr1.map(j => (
                this.renderSquare(3*i + j)
              ))}
          </div>
        )
      ))
      
      return arr2
    }
  
    render() {
      return (
        <div>
          {this.ui()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
          }
        ],
        isClick: Array(9).fill(null),
        stepNumber: 0,
        xIsNext: true,
        ihis : Array(9).fill(null),
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const ihis = this.state.ihis.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      ihis[history.length] = i;
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        ihis : ihis,
      });
    }
  
    jumpTo(step) {
      const isClick = Array(9).fill(null);
      isClick[step] = true;
      this.setState({
        isClick:isClick,
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const ihis = this.state.ihis;
      const bstyle = {
        fontWeight : 'bold',
      }
      
      const moves = history.map((step, move) => {
        const place = [parseInt(ihis[move]/3), ihis[move]%3];
        const desc = move ?
          'Go to move #' + move + ' place : '+ place:
          'Go to game start';
        
        return (
          <li key={move}>
            <button style = {this.state.isClick[move]? bstyle:null} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        if (current.squares.includes(null)){
          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }else{
          status = "Draw";
        }
        
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  