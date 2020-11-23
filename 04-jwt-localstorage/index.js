const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()

// You should actually store your JWT secret in your .env file - but to keep this example as simple as possible...
const jwtsecret = "the most secret string of text in history"

app.use(express.json())

app.use(express.static("public"))

app.post("/login", (req, res) => {
  if (req.body.username === "johndoe" && req.body.password === "qwerty") {
    res.json({ status: "success", token: jwt.sign({ name: "John Doe", favColor: "green" }, jwtsecret) })
  } else {
    res.json({ status: "failure" })
  }
})

app.post("/topsecret", (req, res) => {
  jwt.verify(req.body.token, jwtsecret, function (err, decoded) {
    if (err) {
      res.json({ status: "failure" })
    } else {
      res.json({ status: "success", message: `Hello ${decoded.name} your favorite color is ${decoded.favColor} and we can tell you the secret info that the sky is blue.` })
    }
  })
})

app.listen(3000)
