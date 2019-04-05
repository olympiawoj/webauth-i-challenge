const server = require("./server.js");

const port = 5000;

server.listen(port, () => {
  console.log(`\n **API now running on port ${port}`);
});
