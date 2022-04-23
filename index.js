const {
  leerInput,
  inquirerMenu,
  pausa,
  listarCiudades,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas.js");
require("colors");
require("dotenv").config();

// console.log(process.env);

const main = async () => {
  let opt = "";
  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const ciudad = await leerInput("Ingrese Ciudad");

        //Buscar lugares
        const lugares = await busquedas.ciudad(ciudad);
        //Seleccionar el lugar
        const id = await listarCiudades(lugares);

        //Mostrar datos del lugar
        const lugarSel = lugares.find((l) => l.id === id);
        if (id == "0") continue;

        busquedas.agregarHistorial(lugarSel.nombre);

        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

        //Resultados
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ".green, lugarSel.nombre);
        console.log("Lat: ".green, lugarSel.lat);
        console.log("Lng: ".green, lugarSel.lng);
        console.log("Clima: ".green, clima.clima);
        console.log("Temperatura actual: ".green, clima.temp, "°C");
        console.log("Minima: ".green, clima.temp_min, "°C");
        console.log("Maxima: ".green, clima.temp_max, "°C");
        console.log("Humedad: ".green, clima.humidity, "%");

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((l, idx) => {
          console.log(`${(idx + 1 + ".").green} ${l}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
