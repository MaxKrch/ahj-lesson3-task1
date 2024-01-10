//по сути, весь код будет здесь, будет созаватсья один объект и запускатсь один метод, для создания объекта нужно плучить селектор

export default class Controller {
	constructor(container) {
		this.container = document.querySelector(container);
		this.board = 4;
		this.cells = [];
		this.activeCell = null;
		this.init();
	}

	init() {
		this.createCells();
		this.renderField();
		this.choiceGoblin();
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

	renderField() {
		const field = document.createElement("div");
		field.classList.add("field-wrap");

		for (let row of this.cells) {
			const newRow = document.createElement("div");
			newRow.classList.add("field-row");

			for (let cell of row) {
				newRow.append(cell);
			}

			field.append(newRow);
		}

		this.container.append(field);
	}

	receivingCells() {
		const allCells = [];
		for (let row of this.cells) {
			for (let cell of row) {
				allCells.push(cell);
			}
		}
		return allCells;
	}

	choiceGoblin() {
		setInterval(() => {
			const allCells = this.receivingCells();
			const availableCells = allCells.filter((item) => {
				return item !== this.activeCell;
			});

			const index = Math.floor(Math.random() * availableCells.length);
			const newActiveCell = availableCells[index];
			this.moveGoblin(newActiveCell);
		}, 1000);
	}

	moveGoblin(newCell) {
		const oldActiveCell = this.container.querySelector(".goblin");

		if (oldActiveCell) {
			oldActiveCell.classList.remove("goblin");
		}

		newCell.classList.add("goblin");
	}
}
