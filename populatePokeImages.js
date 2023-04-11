const mongoose = require("mongoose")
const https = require('https');
const ProgressBar = require('progress');

const populatePokeImages = (pokeSchema) => {
  return new Promise((resolve, reject) => {
    pokeImageModel = mongoose.model('pokeImages', pokeSchema);
    for (i = 1; i <= 807; i++) {
        https.get(`https://pokeapi.co/api/v2/pokemon/${i}`, function (res) {
            var chunks = "";
            res.on("data", (chunk) => {
            chunks += chunk;
            });
            res.on("end", async () => {
            const poke = JSON.parse(chunks);
            pokeImageModel.findOneAndUpdate({ "id": poke.id }, { "id": poke.id, "name": poke.name, "image": poke.sprites.front_default }, { upsert: true, new: true }, async (err, result) => {
                if (err) console.log(err);
                resolve();
            });
            });
        })
    }
  })
}


module.exports = { populatePokeImages }