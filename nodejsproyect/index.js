const morgan = require('morgan');
const express = require('express');
const app = express();
// Rutas
const pokemon = require('./routes/pokemon')
const user = require('./routes/user')
// Midleware
const auth = require('./middleware/auth')
const notFound = require('./middleware/notFound')
const index = require('./middleware/index')
const cors = require('./middleware/cors')

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Main page
app.get("/", index);

app.use("/user", user);
app.use(auth);
app.use("/pokemon", pokemon);

// Más midleware
app.use(notFound);

// Initializing port
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running ... ");
});