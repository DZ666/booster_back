const prompt = require("prompt");

const schma = {
  properties: {
    type: {
      description: "тип операции",
      type: "string",
      pattern: /^(new|update)$/,
      message: "Тип может быть 'new' или 'update'",
      required: true,
    },
    name: {
      description: "имя нового сервиса",
      type: "string",
      message: "Имя обязательно",
      ask: function () {
        return prompt.history('type')?.value === 'new';
      },
      required: true,
    }
  },
};

function create_new(name) {
  console.log("\nсоздаём новый сервис - '" + name + "'...");
}

function update() {
  console.log("\nобновляем все сервисы...");
}

async function main() {
  prompt.start();

  const { type, name } = await prompt.get(schma);
  switch (type) {
    case "new":
      create_new(name);
      break;
    case "update":
      update();
      break;
  }
}

main();
