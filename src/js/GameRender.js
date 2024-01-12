export default class GameRender {
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
			<button class="new-game new-game-modal">Начать занова</button>
		`;
		return modal;
	}

	static createTitle(maxMiss) {
		const title = document.createElement("div");
		title.classList.add("title");
		title.innerHTML = `
			<p class="title-mess">Бей гоблина - набирай очки.</p> 
			<p class="title-mess">${maxMiss} сбежавших гоблинов или твоих промахов - GameOver!</p>
			<button class="new-game">Начать занова</button>
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
