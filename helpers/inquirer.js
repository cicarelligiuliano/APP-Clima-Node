const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir\n`,
      },
    ],
  },
];
const Enter = [
  {
    type: "input",
    name: "opcion",
    message: `Presione ${"ENTER".green} para continuar `,
    choices: ["Enter"],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("=======================".green);
  console.log("Selecciones una opción".green);
  console.log("=======================\n".green);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
};

const pausa = async () => {
  console.log("\n");
  const { opcion } = await inquirer.prompt(Enter);
  return opcion;
};

const leerInput = async (message) => {
  const question = {
    type: "input",
    name: "ciudad",
    message,
    validate(value) {
      if (value.length === 0) {
        return "Por favor ingrese la ciudad a buscar";
      }
      return true;
    },
  };
  const { ciudad } = await inquirer.prompt(question);
  return ciudad;
};

const listarCiudades = async (tareas) => {
  const opciones = tareas.map((el, idx) => ({
    value: el.id,
    name: `${(idx + 1 + ".").green} ${el.nombre}`,
  }));
  opciones.unshift({ value: "0", name: "0.".green + " Cancelar" });

  const posibles = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices: opciones,
    },
  ];
  const { id } = await inquirer.prompt(posibles);

  return id;
};

const confirmar = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const { ok } = await inquirer.prompt(question);

  return ok;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarCiudades,
  confirmar,
};
