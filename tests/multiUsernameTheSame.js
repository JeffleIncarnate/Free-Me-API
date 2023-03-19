let database = ["dhruvrayat", "dhruvrayat"];
let passwords = ["yes", "two"];

let myLoginUsername = "dhruvrayat";
let myLoginPassword = "two";

for (let i = 0; i < database.length; i++) {
  let username = database[i];
  let password = passwords[i];

  if (username === myLoginUsername && myLoginPassword === password) {
    console.log("Found User!");
    break;
  }

  console.log("Can not find user");
}
