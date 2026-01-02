#!/usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import fs from "fs";
import path from "path";

// 🎨 Fonts to rotate
const fonts = ['Rebel', 'Colossal', 'DOS Rebel', 'Roman'];

// 🌈 Counter file for rotating banner
const counterFile = path.join(process.cwd(), ".dheenai_banner_count");
let count = 1;
try {
    if (fs.existsSync(counterFile)) {
        const saved = parseInt(fs.readFileSync(counterFile, "utf8"));
        if (!isNaN(saved)) count = saved;
    }
} catch (e) { /* ignore */ }

const font = fonts[count % fonts.length];
try {
    fs.writeFileSync(counterFile, ((count + 1) % fonts.length).toString());
} catch (e) { /* ignore */ }

// 🎭 Generate banner
let banner = figlet.textSync('DheenAI', { font });
const terminalWidth = process.stdout.columns || 80;
banner = banner
    .split("\n")
    .map(line => {
        const padding = Math.max(0, Math.floor((terminalWidth - line.length) / 2));
        return " ".repeat(padding) + line;
    })
    .join("\n");

console.log(gradient.instagram.multiline(banner));
console.log(chalk.whiteBright("Developer: Thinakaran Manokaran".padStart(Math.floor((terminalWidth + "Developer: Thinakaran Manokaran".length) / 2))));
console.log(chalk.whiteBright("Portfolio: https://www.thinakaran.dev".padStart(Math.floor((terminalWidth + "Portfolio: https://www.thinakaran.dev".length) / 2))));
console.log(
    "\n" +
    chalk.cyan("👋 Hi! I’m ") +
    chalk.magentaBright("DheenAI") +
    chalk.cyan(" 💫. Type your message below (type ") +
    chalk.redBright("'exit'") +
    chalk.cyan(" to quit):")
);

// 🧠 CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.greenBright("🧠 Dheena > ")
});

rl.prompt();

// ⏳ Animated loading (🤖 •, ••, •••)
const showLoading = () => {
    const frames = ["🤖 •", "🤖 ••", "🤖 •••"];
    let i = 0;
    // process.stdout.write("\n");
    return setInterval(() => {
        process.stdout.write(`\r${chalk.cyanBright(frames[i++ % frames.length])}  `);
    }, 300);
};

rl.on("line", async (line) => {
    const query = line.trim();
    if (!query) return rl.prompt();

    if (query.toLowerCase() === "exit") {
        console.log(chalk.yellowBright("\n👋 Goodbye! Have a nice day!"));
        process.exit(0);
    }

    const lower = query.toLowerCase();
    if (
        lower.includes("your name") ||
        lower.includes("who are you") ||
        lower.includes("what is your name") ||
        lower.includes("who created you") ||
        lower.includes("name please") ||
        lower.match(/\bname\b/)
    ) {
        console.log(chalk.cyanBright("🤖 My name is ") + chalk.magentaBright("DheenAI 💫") + chalk.cyanBright(" — your smart AI companion!"));
        rl.prompt();
        return;
    }

    // 🎬 Show loading animation
    const loader = showLoading();

    try {
        const url = `https://ai-bl64.onrender.com/?text=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.text();

        clearInterval(loader);
        process.stdout.write("\r"); // clear loading line
        console.log(chalk.whiteBright(`🤖 ${data.trim() || "No response"}`));
    } catch (err) {
        clearInterval(loader);
        process.stdout.write("\r");
        console.error(chalk.redBright("❌ Error: ") + err.message);
    }

    rl.prompt();
});
