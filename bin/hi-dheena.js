#!/usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

// 🎨 List of fonts to cycle
const fonts = ['Roman', 'Rebel', 'Colossal', 'DOS Rebel'];

// 🌈 Cycle fonts using a simple counter stored in a file
import fs from "fs";
import path from "path";

const counterFile = path.join(process.cwd(), ".dheenai_banner_count");

// Read last counter
let count = 0;
try {
    if (fs.existsSync(counterFile)) {
        const saved = parseInt(fs.readFileSync(counterFile, "utf8"));
        if (!isNaN(saved)) count = saved;
    }
} catch (e) { /* ignore */ }

// Pick font based on counter
const font = fonts[count % fonts.length];

// Save next counter
try {
    fs.writeFileSync(counterFile, ((count + 1) % fonts.length).toString());
} catch (e) { /* ignore */ }

// Generate banner
const banner = figlet.textSync('DheenAI', {
    font,
    horizontalLayout: 'default',
    verticalLayout: 'default'
});

console.log(gradient.instagram.multiline(banner));
console.log(chalk.whiteBright("Developer: Thinakaran Manokaran"));
console.log(chalk.whiteBright("Portfolio: https://www.thinakaran.dev"));
console.log("\n" + chalk.cyanBright("👋 Hi! I’m DheenAi 💫. Type your message below (type 'exit' to quit):"));

// CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.greenBright("🧠 Dheena > ")
});

rl.prompt();

rl.on("line", async (line) => {
    const query = line.trim();
    if (!query) return rl.prompt();

    if (query.toLowerCase() === "exit") {
        console.log(chalk.yellowBright("👋 Goodbye! Have a nice day!"));
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
        console.log(chalk.cyanBright("🤖 My name is ") + chalk.magentaBright("DheenAi 💫") + chalk.cyanBright(" — your smart AI companion!"));
        rl.prompt();
        return;
    }

    try {
        const url = `https://dheenai.onrender.com/?text=${encodeURIComponent(query)}`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.text();
        console.log(chalk.cyanBright("🤖 ") + (data.trim() || "No response"));
    } catch (err) {
        console.error(chalk.redBright("❌ Error: ") + err.message);
    }

    rl.prompt();
});
