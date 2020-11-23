const express = require("express")
const cookieParser = require("cookie-parser")
const csurf = require("csurf")
const csrfProtection = csurf({ cookie: { httpOnly: true } })
app = express()

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get("/", csrfProtection, (req, res) => {
  //console.log(req.cookies)
  res.cookie("simpletest", "qwerty")
  res.send(`<form action="/transfer-money" method="POST">
    <input type="text" name="amount" placeholder="amount">
    <input type="text" name="to" placeholder="Send to...">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button>Submit</button>
  </form>`)
})

app.post("/transfer-money", csrfProtection, (req, res) => {
  console.log(req.cookies)
  if (req.cookies.simpletest === "qwerty") {
    console.log("Success!")
  } else {
    console.log("Failed!")
  }
  res.send("--")
})

app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err)

  res.status(403)
  res.send("CSRF attack detected!")
})

app.listen(3000)
