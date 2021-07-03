const axios = require('axios');

async function awakeHeroku(host) {
  return await axios.get(host);
}

module.exports = {
  awakeHeroku,
}
