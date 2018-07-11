const pubg = require("pubg.js");

class ApiClient {
    constructor(apiKey) {
        this.client = new pubg.Client(apiKey, "xbox-na");
    }
    getPlayer(name) {
        return this.client.getPlayer({ name: name });
    }
    getMatch(id) {
        return this.client.getMatch(id);
    }
    getTelemetry(match) {
        return match.fetchTelemetry();
    }
}
module.exports = ApiClient;
