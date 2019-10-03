const app = require("./app");
const https = require("https");
const config = require("./utils/config");

const server = https.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
