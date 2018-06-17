import pubg from "pubg.js";
import fs from "fs";

export default class PubgData {

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

  getPlayerTelemetryEvents (telemetry, name) {
    return telemtry.filter(item => {
      return item.character && item.character.name === name;
    });
  }

  //if a drop item event for the same item occured at the same position
  // verify that the drop item event occured before the pickup
  findItemDropEvent (telemtry, itemPickupEvent) {
    const { location } = itemPickupEvent.character;
    const events = telemetry.filter(event => isSamePosition(event, itemPickupEvent) && 
                                     event._T === "LOGITEMDROP" && 
                                     getItemName(event) === getItemName(itemPickupEvent) &&
                                     new Date(event._D) < new Date(itemPickupEvent._D));
    if (events.length > 0) {
      //TODO figure out what to do if more than 1 event is found
      return events[0];
    } else {
      return {};
    }
  }
}

const getItemName = (event) => {
  if (!event.item) {
    return "";
  }
  return event.item.itemId;
}

const isSamePosition = (event1, event2) => {
  const location1 = event1.character.location;
  const location2 = event2.character.location;
  return (location1.x === location2.x && location1.y == location2.y && location1.z === location2.z);
}