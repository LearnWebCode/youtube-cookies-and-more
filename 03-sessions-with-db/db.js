const dotenv = require("dotenv")
dotenv.config()
const mongodb = require("mongodb")

mongodb.connect(process.env.CONNECTIONSTRING, { useUnifiedTopology: true }, function (err, client) {
  module.exports = client
  const app = require("./app.js")
  app.listen(process.env.PORT || 3000)
})
