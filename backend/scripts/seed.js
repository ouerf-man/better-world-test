const axios = require("axios");
const Network = require("../models/network");

// this script is used to seed the database
async function seed() {
  const hasNetworks = (await Network.find({})).length > 0;
  if (hasNetworks) return;
  const networks = await axios.get("http://api.citybik.es/v2/networks");
  console.log(networks)
  networks.data.networks.forEach(async (network) => {
    const networkDetailsResponse = await axios.get(
      `http://api.citybik.es/v2/networks/${network.id}`
    );
    const networkDetails = networkDetailsResponse.data.network
    Network.create({
      stations: networkDetails.stations,
      name: networkDetails?.name,
      company: networkDetails?.company.join(','),
      city: networkDetails?.location.city,
      country: networkDetails?.location.country,
    })
      .then(() => console.log(`Added network ${network.id}`))
      .catch((error) =>
        console.error(`Error adding network ${network.id}:`, error)
      );
  });
}

module.exports = seed;
