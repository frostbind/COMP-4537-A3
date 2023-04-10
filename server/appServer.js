const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("../connectDB.js")
const { populatePokemons } = require("../populatePokemons.js")
const { getTypes } = require("../getTypes.js")
const { handleErr } = require("../errorHandler.js")
const morgan = require("morgan")
const cors = require("cors")

const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("../errors.js")

const { asyncWrapper } = require("../asyncWrapper.js")

const dotenv = require("dotenv")
dotenv.config();

const app = express()
var pokeModel = null;

const jwt = require("jsonwebtoken")
const userModel = require("../userModel.js")

const authUser = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new PokemonAuthError("No Token: Please provide a valid JWT token in the Authorization header.")
  }

  const userWithToken = await userModel.findOne({ token })
  userModel.find(function (err, docs) {
    if (err) {
      console.log(err)
    } else {
      console.log("token: ", token);  
      console.log("Current users: ", docs);
    }
  })

  if (!userWithToken || userWithToken.token_invalid) {
    throw new PokemonAuthError("Please Login.")
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    next()
  } catch (err) {
    throw new PokemonAuthError("Invalid user.")
  }
})

// const authUser = asyncWrapper(async (req, res, next) => {
//   const token = req.query.appid

//   if (!token) {
//     throw new PokemonAuthError("No Token: Please provide an appid query parameter.")
//   }

//   const userWithToken = await userModel.findOne({ token })
//   userModel.find(function (err, docs) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log("token: ", token);  
//       console.log("Current users: ", docs);
//     }
//   })

//   if (!userWithToken || userWithToken.token_invalid) {
//     throw new PokemonAuthError("Please Login.")
//   }

//   try {
//     const verified = jwt.verify(token, process.env.TOKEN_SECRET)
//     next()
//   } catch (err) {
//     throw new PokemonAuthError("Invalid user.")
//   }
// })

const authAdmin = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ token: req.query.appid })

  if (user.role !== "admin") {
    throw new PokemonAuthError("Access denied")
  }

  next()
})

app.use(express.static('public'));

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });
  const pokeSchema = await getTypes();
  pokeModel = mongoose.model('pokemons', pokeSchema);

  app.listen(8888, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${8888}`);
  })
})
start()

app.use(express.json())

app.use(morgan(":method"))

app.use(cors({
  origin: '*' // replace with your frontend URL or * for all origins
}));

app.get('/home', asyncWrapper(async (req, res) => {
  res.sendFile(__dirname + '/search.html');
}))

app.use(authUser) // All routes below this line are protected

app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  // try {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
  // } catch (err) { res.json(handleErr(err)) }
}))

app.get('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const { id } = req.query
  const docs = await pokeModel.find({ "id": id })
  if (docs.length != 0) res.json(docs)
  else res.json({ errMsg: "Pokemon not found" })
  // } catch (err) { res.json(handleErr(err)) }
}))
app.get("*", (req, res) => {
  // res.json({
  //   msg: "Improper route. Check API docs plz."
  // })
  throw new PokemonNoSuchRouteError("");
})

app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  // try {
  console.log(req.body);
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
  // } catch (err) { res.json(handleErr(err)) }
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    // res.json({ errMsg: "Pokemon not found" })
    throw new PokemonNotFoundError("");
  // } catch (err) { res.json(handleErr(err)) }
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  // console.log(docs);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({ msg: "Not found", })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({  msg: "Not found" })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))



app.use(handleErr)
