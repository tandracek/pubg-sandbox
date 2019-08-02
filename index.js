const fs = require("fs");
const PubgData = require("./pubg/retrieval");
const Overlay = require('./pubg/overlay');
const ApiClient = require("./pubg/client");
const winston = require('winston');

winston.add(new winston.transports.Console());

const apiKey = "";
const retrieval = new PubgData(new ApiClient(apiKey));

const writeLatest = () => {
  retrieval.getPlayersLatestTelemetry("FourTA").then(telemtry => {
    fs.writeFileSync("telemtry-7-3-18.json", JSON.stringify(telemtry));
  }).catch(err => {
    winston.error(err);
  });
}

const writeLatestForPlayer = () => {
  const telemetry = fs.readFileSync("telemtry-7-3-18.json");
  const playerTelemetry = retrieval.getPlayerTelemetryEvents(JSON.parse(telemetry), "sandsrock200");
  fs.writeFileSync("killer_telemetry-7-3-18.json", JSON.stringify(playerTelemetry));
}

const findThings = () => {
  const telemetry = JSON.parse(fs.readFileSync("telemtry-7-3-18.json"));
  const things = telemetry.filter(item => {
    return item._T === "LogItemPickup" && item.item.itemId === "Item_Weapon_Groza_C";
  });
  for (let thing of things) {
    winston.debug(JSON.stringify(thing));
  }
}

const getWeaponsFromFile = (fromFilename, toFilename) => {
  const telemetry = JSON.parse(fs.readFileSync(fromFilename));
  const spawnedWeapons = retrieval.findSpawnedWeapons(telemetry);
  fs.writeFileSync(toFilename, JSON.stringify(spawnedWeapons));
}

const weapons = JSON.parse(fs.readFileSync("reference/weapons-7-3-18.json"));
Overlay.init("miramar_map.jpeg").then(overlay => {
  overlay.addTelemetryCoordinates(weapons, Overlay.RED, 2);
  overlay.write("mapped_miramar.png");
}).catch(err => {
  console.log(err);
});
