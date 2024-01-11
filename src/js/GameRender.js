export default class GameRender {
	constructor(board) {
		this.board = board;
		this.cells = [];
		this.field = null;
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

	static createTitle(maxMiss) {
		const title = document.createElement("div");
		title.classList.add("title");
		title.innerHTML = `
			<p>Привет! Бей гоблина - набирай очки.</p> 
			<p>${maxMiss} упущенных гоблинов или промахов - GameOver! Удачи!</p>
		`;

		return title;
	}

	renderGameOver(points) {
		const wrap = document.createElement("div");
		wrap.classList.add("gameover-wrap");

		const maxSavePointsJSON = localStorage.getItem("maxPointsGoblin");
		const maxSavePoints = maxSavePointsJSON ? JSON.parse(maxSavePointsJSON) : 0;

		const diff = maxSavePoints - points;
		let messDiff;

		if (diff > 0) {
			messDiff = `Это немногим меньше рекорда - ${points}!`;
		}

		if (diff < 0) {
			messDiff = `Это немногим больше рекорда - ${points}!`;
		}

		if (diff == 0) {
			messDiff = `Кстати, ты уже столько набирал!`;
		}

		const message = `
			Проигрыш! Гоблины оказались сильнее тебя - бывает со всеми...
			Но ты успел убить кучу гоблинов - целых 
			 ${points}!
			 ${messDiff}
			Попробуешь снова?
		`;

		wrap.textContent = message;
		this.field.append(wrap);
	}
}
