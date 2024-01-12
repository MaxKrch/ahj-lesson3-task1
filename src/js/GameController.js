export default class GameController {
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
		this.gameRender.field.addEventListener("click", (event) => {
			if (event.target.classList.contains("field-cell")) {
				this.hitHole(event);
			}
		});

		const newGame = document.querySelectorAll(".new-game");
		newGame.forEach((item) => {
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
		const availableCells = allCells.filter((item) => {
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
