const express = require("express")
const cookieParser = require("cookie-parser")
const csurf = require("csurf")
const csrfProtection = csurf({ cookie: { httpOnly: true } })
const jwt = require("jsonwebtoken")
const path = require("path")
const app = express()

// You should actually store your JWT secret in your .env file - but to keep this example as simple as possible...
const jwtsecret = "the most secret string of text in history"

app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get("/", (req, res) => {
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.render("login")
    } else {
      res.render("logged-in", { name: decoded.name })
    }
  })
})

app.post("/login", (req, res) => {
  if (req.body.username === "johndoe" && req.body.password === "qwerty") {
    res.cookie("cookieToken", jwt.sign({ name: "John Doe", favColor: "green" }, jwtsecret), { httpOnly: true })
    res.redirect("/")
  } else {
    res.send(`<p>Incorrect login. <a href="/">Go back home.</a></p>`)
  }
})

app.get("/logout", (req, res) => {
  res.clearCookie("cookieToken")
  res.redirect("/")
})

// have a GET request that is token protected but doesnt need CSRF because it is not modifying any data
app.get("/get-secret-data", mustBeLoggedIn, (req, res) => {
  res.send(`<p>Welcome to the top secret data page. Only logged in users like you can access this amazing content. <a href="/">Go back home.</a></p>`)
})

// example json / api endpoint
app.get("/ajax-example", mustBeLoggedIn, (req, res) => {
  res.json({ message: "Two plus two is four and grass is green." })
})

// show the money transfer form
app.get("/transfer-money", csrfProtection, mustBeLoggedIn, (req, res) => {
  res.render("transfer-money-form", { csrf: req.csrfToken() })
})

// have a POST request that verifies token AND needs to be CSRF protected because it hypothetically modifies data
app.post("/transfer-money", csrfProtection, mustBeLoggedIn, (req, res) => {
  res.send("Thank you, we are working on processing your transaction.")
})

// Our token checker middleware
function mustBeLoggedIn(req, res, next) {
  jwt.verify(req.cookies.cookieToken, jwtsecret, function (err, decoded) {
    if (err) {
      res.redirect("/")
    } else {
      next()
    }
  })
}

app.listen(3000)
