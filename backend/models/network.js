let mongoose = require("mongoose");

let NetworkSchema = new mongoose.Schema({
    name: String,
    company: String,
    city: String,
    country: String,
    stations: [Object],
});


module.exports = mongoose.model("Network",NetworkSchema);
