import GameController from "./GameController";
import GameState from "./GameState";
import GameRender from "./GameRender";

const gameState = new GameState(5);
const gameRender = new GameRender(4);

new GameController("#app", gameState, gameRender);
