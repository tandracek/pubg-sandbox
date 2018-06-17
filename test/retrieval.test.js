const assert = require("assert");
const fs = require("fs");
const PubgData = require("../pubg/retrieval");
const RealClient = require("../pubg/client");

const itemEvent = {
  "character": {
     "name": "FourTA",
     "teamId": 25,
     "health": 100,
     "location": {
        "x": 210238.234375,
        "y": 229720.09375,
        "z": 1456.97998046875
     },
     "ranking": 0,
     "accountId": "account.36fb33809f464aa3b299cbcfe07eda18"
  },
  "item": {
     "itemId": "Item_Weapon_SmokeBomb_C",
     "stackCount": 1,
     "category": "Equipment",
     "subCategory": "Throwable",
     "attachedItems": []
  },
  "_V": 2,
  "_D": "2018-06-10T02:48:32.119Z",
  "_T": "LogItemPickup"
};

describe("Retrieval", function() {
  describe("get item event", function() {
    const retrieval = new PubgData(new RealClient("whatever"));
    const telemtry = fs.readFileSync("../FourTA_telemetry.json");
    const event = retrieval.findItemDropEvent(telemtry, itemEvent);
    console.log(event);
  });
});