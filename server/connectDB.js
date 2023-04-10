const { mongoose } = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
console.log(process.env)

const connectDB = async (input) => {
  try {
    const x = await mongoose.connect('mongodb://127.0.0.1:27017/test', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to db");
    if (input.drop === true)
      mongoose.connection.db.dropDatabase();
    // console.log("Dropped db");
    // get the data from Github 
  } catch (error) {
    console.log('db error');
  }
}

module.exports = { connectDB }