// // getting-started.js
// //sudo systemctl start mongod -> command to start mongodb daemon on ubuntu
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {

  //connecting to database
  // await mongoose.connect('mongodb://localhost:27017/auth_plugin_development');

  await mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.rfx5ng5.mongodb.net/?retryWrites=true&w=majority`);


  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connection to Auth db"));

db.once('open', () => {
  console.log('Connected to Auth db successfully');
});