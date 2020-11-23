const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const client = require("./db.js")
const csurf = require("csurf")

const app = express()
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    // You should actually store your JWT secret in your .env file - but to keep this example as simple as possible...
    secret: "supersecret difficult to guess string",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ client: client })
  })
)

app.use(csurf())

app.get("/", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/choose-name" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Submit</button>
  </form>
  <form action="/logout" method="POST">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Logout</button>
  </form>
  `)
})

app.post("/choose-name", (req, res) => {
  req.session.user = req.body.name.trim()
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
})

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
})

module.exports = app
