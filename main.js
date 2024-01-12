/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/GameController.js
class GameController {
  constructor(container, gameState, gameRender) {
    this.container = document.querySelector(container);
    this.gameRender = gameRender;
    this.state = gameState;
    this.cellWithGoblin = null;
    this.idMoverGoblin = null;
    this.init();
    this.registerEvent();
  }
  registerEvent() {
    this.gameRender.field.addEventListener("click", event => {
      if (event.target.classList.contains("field-cell")) {
        this.hitHole(event);
      }
    });
    const newGame = document.querySelectorAll(".new-game");
    newGame.forEach(item => {
      item.addEventListener("click", () => {
        this.startNewGame();
      });
    });
  }
  init() {
    this.gameRender.createCells();
    this.gameRender.renderField(this.container, this.state.maxMiss);
    setTimeout(() => {
      this.choiceCellWithGoblin();
    }, 1000);
  }
  receivingCells() {
    const allCells = [];
    for (let row of this.gameRender.cells) {
      for (let cell of row) {
        allCells.push(cell);
      }
    }
    return allCells;
  }
  choiceCellWithGoblin() {
    const allCells = this.receivingCells();
    const availableCells = allCells.filter(item => {
      return item !== this.cellWithGoblin;
    });
    const index = Math.floor(Math.random() * availableCells.length);
    const newCellWithGoblin = availableCells[index];
    this.moveCellWithGoblin(newCellWithGoblin);
    if (this.idMoverGoblin === null) {
      this.idMoverGoblin = setInterval(() => {
        this.state.miss += 1;
        if (this.state.miss < this.state.maxMiss) {
          this.choiceCellWithGoblin();
        } else {
          this.gameOver();
        }
      }, 1000);
    }
  }
  moveCellWithGoblin(newCell) {
    const oldCellWithGoblin = this.container.querySelector(".goblin");
    if (oldCellWithGoblin) {
      oldCellWithGoblin.classList.remove("goblin");
    }
    this.cellWithGoblin = newCell;
    newCell.classList.add("goblin");
  }
  hitHole(event) {
    this.chekGoblin(event.target);
  }
  chekGoblin(target) {
    if (target === this.cellWithGoblin) {
      this.state.points += 1;
      clearInterval(this.idMoverGoblin);
      this.idMoverGoblin = null;
      this.choiceCellWithGoblin();
      return;
    }
    this.state.miss += 1;
    if (this.state.miss < this.state.maxMiss) {
      clearInterval(this.idMoverGoblin);
      this.idMoverGoblin = null;
      this.choiceCellWithGoblin();
      return;
    }
    this.gameOver();
  }
  gameOver() {
    this.updateRecord();
    this.gameRender.renderGameOver(this.state.points);
    this.deleteGoblin();
    clearInterval(this.idMoverGoblin);
  }
  deleteGoblin() {
    this.cellWithGoblin.classList.remove("goblin");
  }
  updateRecord() {
    const maxSavePointsJSON = localStorage.getItem("maxPointsGoblin");
    const maxSavePoints = maxSavePointsJSON ? JSON.parse(maxSavePointsJSON) : 0;
    if (this.state.points > maxSavePoints) {
      const newMaxPoints = this.state.points;
      localStorage.setItem("maxPointsGoblin", JSON.stringify(newMaxPoints));
    }
  }
  startNewGame() {
    location.reload();
  }
}
;// CONCATENATED MODULE: ./src/js/GameState.js
class GameState {
  constructor(maxMiss) {
    this.maxMiss = maxMiss;
    this.points = 0;
    this.miss = 0;
  }
}
;// CONCATENATED MODULE: ./src/js/GameRender.js
class GameRender {
  constructor(board) {
    this.board = board;
    this.cells = [];
    this.field = null;
    this.gameOver = null;
  }
  createCells() {
    for (let i = 0; i < this.board; i += 1) {
      const row = [];
      for (let k = 0; k < this.board; k += 1) {
        const newCell = document.createElement("div");
        newCell.classList.add("field-cell");
        row.push(newCell);
      }
      this.cells.push(row);
    }
  }
  renderField(container, maxMiss) {
    const field = document.createElement("div");
    field.classList.add("field-wrap");
    const modal = GameRender.createModal();
    this.gameOver = modal;
    field.append(modal);
    const title = GameRender.createTitle(maxMiss);
    field.append(title);
    for (let row of this.cells) {
      const newRow = document.createElement("div");
      newRow.classList.add("field-row");
      for (let cell of row) {
        newRow.append(cell);
      }
      field.append(newRow);
    }
    this.field = field;
    container.append(field);
  }
  static createModal() {
    const modal = document.createElement("div");
    modal.classList.add("gameover-wrap", "hidden-item");
    modal.innerHTML = `
			<button class="new-game new-game-modal">Начать заново</button>
		`;
    return modal;
  }
  static createTitle(maxMiss) {
    const title = document.createElement("div");
    title.classList.add("title");
    title.innerHTML = `
			<p class="title-mess">Бей гоблина - набирай очки.</p> 
			<p class="title-mess">${maxMiss} сбежавших гоблинов или твоих промахов - GameOver!</p>
			<button class="new-game">Начать заново</button>
		`;
    return title;
  }
  renderGameOver(points) {
    const maxSavePointsJSON = localStorage.getItem("maxPointsGoblin");
    const maxSavePoints = maxSavePointsJSON ? JSON.parse(maxSavePointsJSON) : 0;
    const messageWrap = document.createElement("div");
    const diff = maxSavePoints - points;
    console.log(diff, maxSavePoints, points);
    let messDiff;
    if (diff > 0) {
      messDiff = `Это чуть меньше рекорда - ${maxSavePoints}!`;
    }
    if (diff < 0) {
      messDiff = `Это чуть больше рекорда - ${maxSavePoints}!`;
    }
    if (diff === 0) {
      messDiff = "";
    }
    const message = `
			<p class="gameover-mess">GameOver!</p> 
			<p class="gameover-mess">Гоблины оказались куда сильнее тебя...</p>
			<p class="gameover-mess">Но ты успел отправить на тот свет кучу гоблинов - ${points}!</p>
			<p class="gameover-mess">${messDiff}</p>
			<p class="gameover-mess">Попробуешь снова?</p>
		`;
    this.gameOver.classList.remove("hidden-item");
    messageWrap.innerHTML = message;
    this.gameOver.prepend(messageWrap);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



const gameState = new GameState(5);
const gameRender = new GameRender(4);
new GameController("#app", gameState, gameRender);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;