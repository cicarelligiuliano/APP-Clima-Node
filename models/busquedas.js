const axios = require("axios");
const fs = require("fs");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor(props) {
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((el) => {
      let palabras = el.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      limit: 5,
      //   types: "place%2Cpostcode%2Caddress",
      access_token: process.env.MAPBOX_KEY,
      language: "es",
    };
  }

  async ciudad(lugar = "") {
    // console.log("Ciudad: ", lugar);
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();

      //   console.log(resp.data.features);

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_KEY,
          units: "metric",
          lang: "es",
        },
      });

      const resp = await instance.get();

      return {
        clima: resp.data.weather[0].description,
        temp: resp.data.main.temp,
        temp_min: resp.data.main.temp_min,
        temp_max: resp.data.main.temp_max,
        humidity: resp.data.main.humidity,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 4);
    this.historial.unshift(lugar.toLocaleLowerCase());

    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return null;
    const db = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(db);

    console.log(data);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
