const assert = require("assert");
const fs = require("fs");
const PubgData = require("../pubg/retrieval");
const ApiClient = require("../pubg/client");
const DummyClient = require("./dummyClient");

const pickupDroppedEvent = {
  "character": {
    "name": "BARCODE55",
    "teamId": 24,
    "health": 100,
    "location": {
      "x": 386429.75,
      "y": 326018.4375,
      "z": 12593.9697265625
    },
    "ranking": 0,
    "accountId": "account.d0d140bace694d1c9f92aa8c16ee5ce0"
  },
  "item": {
    "itemId": "Item_Weapon_Groza_C",
    "stackCount": 1,
    "category": "Weapon",
    "subCategory": "Main",
    "attachedItems": [

    ]
  },
  "_D": "2018-07-04T04:35:04.206Z",
  "_T": "LogItemPickup"
};

const pickupSpawnedEvent = {
  "character": {
    "name": "FourTA",
    "teamId": 5,
    "health": 100,
    "location": {
      "x": 207661.25,
      "y": 286786.21875,
      "z": 9307.7001953125
    },
    "ranking": 0,
    "accountId": "account.36fb33809f464aa3b299cbcfe07eda18"
  },
  "item": {
    "itemId": "Item_Weapon_HK416_C",
    "stackCount": 1,
    "category": "Weapon",
    "subCategory": "Main",
    "attachedItems": []
  },
  "_D": "2018-07-04T04:19:03.134Z",
  "_T": "LogItemPickup"
}

describe.skip("Retrieval", function () {
  const retrieval = new PubgData(new DummyClient());
  const telemetry = JSON.parse(fs.readFileSync("reference/telemetry-7-3-18.json"));

  it("item was dropped", function () {
    const dropped = retrieval.wasItemDropped(telemetry, pickupDroppedEvent);
    assert.ok(dropped);
  });

  it("item was spawned", function() {
    const dropped = retrieval.wasItemDropped(telemetry, pickupSpawnedEvent);
    assert.ok(!dropped);
  });
});