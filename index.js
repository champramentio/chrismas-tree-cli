const { promisify } = require("util");
const timeout = promisify(setTimeout);

const padding = 5;
const star = ["  | ", " \\|/ ", "--*--", " /|\\", "  | "];
const CSI = "\x1b["; //Control Sequence Introducer
const RESET = "\x1b[m"; //reset the CSI
const LEFT_LEAF = `${CSI}32m>${RESET}`; //green color
const RIGHT_LEAF = `${CSI}32m<${RESET}`; //green color
const LEAVES = [LEFT_LEAF, RIGHT_LEAF];
const BELLS = [
	`${CSI}93m*${RESET}`,
	`${CSI}96mö${RESET}`,
	`${CSI}97m@${RESET}`,
	`${CSI}91m@${RESET}`,
	`${CSI}38;5;21mß${RESET}`, //8-bit color for blue
	`${CSI}38;5;205mü${RESET}`, //8-bit color for pink
	`${CSI}38;5;208m/${RESET}` //8-bit color for orange
];

(async function () {
	while (true) {
		console.log(CSI + "H" + CSI + "J"); //clear the whole screen
		print_tree();
		await timeout(1000);
	}
})();

process.stdout.on("resize", () => print_tree());

function print_tree() {
	const height = process.stdout.rows - 15;

	let line = 0;
	let width_of_tree = 1;
	let space = height - 1;
	const space_for_star = space - 1;

	for (const star_line of star) {
		console.log(CSI + "33m" + " ".repeat(padding) + " ".repeat(space_for_star) + star_line + " ".repeat(space_for_star) + "  ".repeat(padding) + RESET);
	}

	while (line < height) {
		console.log(" ".repeat(padding) + " ".repeat(space) + LEFT_LEAF + random_leaf(width_of_tree) + RIGHT_LEAF + " ".repeat(space) + " ".repeat(padding));
		line++;
		width_of_tree += 2;
		space--;
	}

	const width_of_trunk = 5;
	const space_for_trunk = Math.floor((width_of_tree - 2 - width_of_trunk) / 2);
	console.log(" ".repeat(padding) + " ".repeat(space_for_trunk) + "|   |" + " ".repeat(space_for_trunk) + " ".repeat(padding));
	console.log(" ".repeat(padding) + " ".repeat(space_for_trunk) + "|   |" + " ".repeat(space_for_trunk) + " ".repeat(padding));
	console.log(" ".repeat(padding) + "_".repeat(space_for_trunk) + "|___|" + "_".repeat(space_for_trunk) + " ".repeat(padding));
	console.log(" ".repeat(padding) + "/".repeat(space_for_trunk) + "/////" + "/".repeat(space_for_trunk) + " ".repeat(padding));
}

function random_leaf(width) {
	let str = "";
	for (let i = 0; i < width; i++) {
		if (Math.random() < 0.5) {
			str += LEAVES[Math.floor(Math.random() * LEAVES.length)];
		} else {
			str += BELLS[Math.floor(Math.random() * BELLS.length)];
		}
	}
	return str;
}
