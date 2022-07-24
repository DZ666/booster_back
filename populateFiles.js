const fs = require("fs");
const ncp = require("ncp");
const { getAllServicesNames } = require("./miscellaneousTools");

// Имена файлов/папок для переноса по сервисам и их конечный путь
const items = [
  { name: ".env", path: "/" },
  { name: ".local.env", path: "/" },
  { name: ".stage.env", path: "/" },
  { name: "envType.ts", path: "/" },
  { name: "tools", path: "/src/" },
];

async function main() {
  for (const { name, path } of items) {
    for (const service of getAllServicesNames()) {
      await new Promise((resolve, reject) => {
        const pth = `./services/${service}${path}${name}`;
        fs.rmSync(pth, { force: true, recursive: true });
        ncp(`./${name}`, pth, function (err) {
          if (err) reject(err);
          resolve();
        });
      });
    }
  }
}

main();
