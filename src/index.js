import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

function Square(props) {
    return (
        <button 
            className="square" 
            style={{ color: props.pinkLine ? "pink" : "black" }}
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );    
}

// 输赢计算函数
function CalculateWinner(squares){
    // 枚举所有的获胜局的连线结果
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let obj = {
        winner: null,
        lines: []
    };
    // 判断上面的枚举值对应位置是否有全部由相同的棋子，从而判断输赢
    for(let i=0; i<lines.length; i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            obj = {
                winner: squares[a],
                lines: [a,b,c]
            };
            return obj;
        }
    }
    return obj;
}
  
class Board extends React.Component {
    renderSquare(i) {
        // find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined
      const pinkLine = this.props.winnerLine.find(m => m === i);
      return <Square 
        key={i}
        value={this.props.squares[i]} 
        pinkLine={pinkLine} 
        onClick={() => this.props.onClick(i)} 
      />;
    }
  
    render() {
        
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // 历史记录，存储了每个记录的棋盘情况，以及记录当前记录最后一招棋的坐标点
            history: [{
                squares: Array(9).fill(null),
                lastStep: 'GAME START',
            }],
            //是否轮到对手下棋
            isNext: true,
            // 下到第几步，在悔棋后，悔棋步数的步数会全部删除
            stepNum: 0,
            //是否翻转历史记录
            sort: false,
        };
    }

    handleClick(i){
        // slice（）切头不切尾,将悔棋之后的步数全部丢弃
        const history = this.state.history.slice(0, this.state.stepNum + 1);;
        const current = history[history.length - 1];
        // 获取状态squares数组中的所有值
        const squares = current.squares.slice();
        // 若游戏结束或者点击的方框有值，就点击无效
        if(squares[i] || CalculateWinner(squares).winner){
            return;
        }
        squares[i] = this.state.isNext?'X':'O';
        const x = i%3 + 1;
        const y = Math.floor(i/3)+1;
        const coords = x + ',' + y
        this.setState({
            history: history.concat([{
                squares: squares,
                lastStep: coords,
            }]),
            isNext: !this.state.isNext,
            stepNum: history.length,
        });
    }

    handleSort() {
        this.setState({
          sort: !this.state.sort
        });
    }

    jumpTo(move){
        this.setState({
            stepNum: move,
            isNext: (move%2) === 0,
        });
    }


    render() {
        let history = this.state.history;
        const current = history[this.state.stepNum];
        const winner = CalculateWinner(current.squares).winner;
        const winnerLine = CalculateWinner(current.squares).lines;

        // 历史记录翻转模块
        if (this.state.sort) {
            history = this.state.history.slice();
            history.reverse();
        }
        // 参数解释：
        // 1.step：代表history中的每一个squares+lastStep数组；
        // 2.move：代表history中的每一个squares+lastStep索引。
        const moves = history.map((step,move) =>
            {
                const desc = '(' + step.lastStep + ')';
                return(
                    <li key={move}>
                        <button 
                            style={{color: (this.state.stepNum == move)?'red':'black'}}
                            onClick = {() => this.jumpTo(move)}
                        >{desc}
                        </button>
                    </li>
                );
            }
        );

        // 判断棋盘是否走完，为后续和棋判断提供条件
        let isFinished = true;
        for(let i=0; i<current.squares.length; i++){
            if(!current.squares[i]){
                isFinished = false;
            }
        }

        let status;
        if(winner){
            status = 'Winner:' + winner;
        }else if(isFinished && !winner){
            status = '打成平手';
        }else{
            status = 'Next player:' + (this.state.isNext?'X':'O');
        }
        return (
            <div className="game">
            <div className="game-board">
                <Board squares={current.squares} winnerLine={winnerLine} onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
            <div className="status">{status}</div>
                <button onClick={() => this.handleSort()}>
                    sort
                </button>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );



