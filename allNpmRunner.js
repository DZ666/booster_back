const { spawn } = require("child_process");
const { getAllServicesNames } = require("./miscellaneousTools");
const { cpus } = require("os");

const Color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
}

function logWithColor(text, ...settings) {
  console.log(`${settings.join("")}${text}${Color.Reset}`);
}

function getArgCommands() {
  const index = process.argv.indexOf("--commands");
  if (index < 0) {
    throw Error("`--commands` arg is not found");
  } else {
    const commands = process.argv.slice(index + 1);
    if (!commands.length) {
      throw Error("no commands to npm were found");
    }
    return commands;
  }
}

(async function main() {
  const cpusNum = cpus().length;
  logWithColor(`Number of Logical CPUs detected: ${cpusNum}`, Color.Bright, Color.FgGreen);
  logWithColor(`Limiting parallel concurrent threads to ${cpusNum}`, Color.Bright, Color.FgGreen);
  const chunkedNames = getAllServicesNames().reduce((acc, name) => {
    const len = acc.length;
    if (!len) acc.push([name]);
    else {
      if (acc[len - 1].length < cpusNum)
        acc[len - 1].push(name);
      else acc.push([name]);
    }
    return acc;
  }, [])
  for (const chunks of chunkedNames) {
    const promises = [];
    logWithColor(`processing services: ${chunks.join(", ")}`, Color.Bright, Color.FgGreen);
    for (const service of chunks) {
      promises.push(new Promise((res, rej) => {
        const proc = spawn("npm", [...getArgCommands(), "--prefix", `services/${service}/`], { stdio: "inherit", shell: process.platform === "win32" });
        proc.on("exit", res);
        proc.on("error", rej);
      }))
    }
    const results = await Promise.all(promises);
    const err = results.find(res => res !== 0) || 0;
    if (err) {
      process.exit(err);
    }
  }
})();