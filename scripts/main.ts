import GameManager from "./GameManager.js";
import TitleManager from "./TitleManager.js";
import PlayerManager from "./PlayerManager.js";

runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime: IRuntime)
{
	(globalThis as any).playerManager = new PlayerManager();

	runtime.addEventListener("beforeanylayoutstart", () => OnLayoutStart(runtime));
}

function OnLayoutStart(runtime: IRuntime)
{
	const layoutName = runtime.layout.name;

	if ((globalThis as any).titleManager) {
		(globalThis as any).titleManager.destroy();
		(globalThis as any).titleManager = null;
	}
	if ((globalThis as any).gameManager) {
		(globalThis as any).gameManager.destroy();
		(globalThis as any).gameManager = null;
	}

	if (layoutName === "Title") {
		(globalThis as any).titleManager = new TitleManager(runtime);
	} else if (layoutName === "Game") {
		(globalThis as any).gameManager = new GameManager(runtime);
	}
}