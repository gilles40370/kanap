const orderId = getOrderId()
displayOrderId(orderId)
removeAllLocalstorage()

// recupere l id envoyer par la page cart suite as la validation du form
function getOrderId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId")
}

// faire apparaitre le numero de commande
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = orderId
}

// pour effaccer le localStorage apres avoir tous valider
function removeAllLocalstorage() {
  const localStorage = window.localStorage
  localStorage.clear()
}