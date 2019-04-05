const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select("user_id", "name", "password");
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

async function add(user) {
  const [id] = await db("users").insert(user);
  console.log(id);
  return findById(id);
}

function findById(id) {
  return db("users")
    .where({ user_id: id })
    .first();
}
