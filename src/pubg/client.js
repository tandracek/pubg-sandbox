const pubg = require("pubg.js");

class ApiClient {
    constructor(apiKey) {
        this.client = new pubg.Client(apiKey, "xbox-na");
    }
    getPlayer(name) {
        return client.getPlayer({ name: name });
    }
    getMatch(id) {
        return client.getMatch(id);
    }
    getTelemetry(match) {
        return match.fetchTelemetry();
    }
}
exports.default = ApiClient;
