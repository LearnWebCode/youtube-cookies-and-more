const ourForm = document.getElementById("ourForm")
const usernameField = document.getElementById("username")
const passwordField = document.getElementById("password")

ourForm.addEventListener("submit", async e => {
  e.preventDefault()
  const response = await axios.post("/login", { username: usernameField.value, password: passwordField.value })
  if (response.data.status == "success") {
    localStorage.setItem("ourToken", response.data.token)
  } else {
    alert("Sorry, try again.")
  }
})

document.getElementById("getsecret").addEventListener("click", async function () {
  const response = await axios.post("/topsecret", { token: localStorage.getItem("ourToken") })
  if (response.data.status == "success") {
    document.getElementById("message-area").textContent = response.data.message
  } else {
    document.getElementById("message-area").textContent = "Only logged in users can see this info."
  }
})
