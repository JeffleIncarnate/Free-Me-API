const argon2 = require("argon2");

let normal = "yes";

async () => {
  try {
    console.log(await argon2.hash("password"));
  } catch (err) {
    console.log(err);
  }
};
