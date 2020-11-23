document.getElementById("ajax").addEventListener("click", async () => {
  const response = await fetch("/ajax-example")
  data = await response.json()
  alert(data.message)
})
