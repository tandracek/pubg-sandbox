const pubg = require("pubg.js");
const fs = require("fs");

class PubgData {

  constructor(client) {
    this.client = client;
  }

  async getPlayersLatestMatch (name) {
    const player = await this.client.getPlayer(name);
    const matches = player.relationships.matches;
    if (!matches.length) {
      throw `No matches exist for player ${name}`;
    }
    const matchId = matches[0].id;
    console.log(`Retrieving match with id ${matchId}`);
    return await this.client.getMatch(matchId);
  }

  async getPlayersLatestTelemetry (name) {
    const match = await this.getPlayersLatestMatch(name);
    return await this.client.getTelemetry(match);
  }

  getPlayerTelemetryEvents (telemetry, name) {
    return telemetry.filter(item => {
      return (item.character && item.character.name === name) ||
             (item.attacker && item.attacker.name == name) ||
             (item.victim && item.victim.name == name) || 
             (item.killer && item.killer.name == name);
    });
  }

  wasItemDropped (telemetry, itemPickupEvent) {
    const events = telemetry.filter(event => event._T === "LogItemUnequip" && 
                                     isRoughlySamePosition(event, itemPickupEvent) && 
                                     getItemName(event) === getItemName(itemPickupEvent) &&
                                     areAroundTheSameTime(event, itemPickupEvent));
    return (events.length > 0);
  }

  findSpawnedWeapons (telemetry) {
    return telemetry.filter(event => event._T === "LogItemPickup" && 
                                     event.item.category === "Weapon" &&
                                     !this.wasItemDropped(telemetry, event));
  }
}

const isInRange = (minInclusive, maxInclusive, number) => {
  return number >= minInclusive && number <= maxInclusive;
}

const getItemName = (event) => {
  if (!event.item) {
    return "";
  }
  return event.item.itemId;
}

const areAroundTheSameTime = (event1, event2) => {
  const dateBefore = new Date(event1._D);
  const dateAfter = new Date(event1._D);
  const date2 = new Date(event2._D);
  dateBefore.setMinutes(dateBefore.getMinutes() - 2);
  dateAfter.setMinutes(dateAfter.getMinutes() + 2);
  return isInRange(dateBefore, dateAfter, date2);
}

const isRoughlySamePosition = (event1, event2) => {
  const location1 = event1.character.location;
  const location2 = event2.character.location;
  return (isInRange(location1.x - 100, location1.x + 100, location2.x) && 
          isInRange(location1.y - 100, location1.y + 100, location2.y) && 
          isInRange(location1.z - 100, location1.z + 100, location2.z));
}

module.exports = PubgData;