const cart = [];
// -------------------------recall data-----------------------------
itemsInLocalstorage();
cart.forEach((item) => displayItem(item));

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

function itemsInLocalstorage() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}
// ---------------------------visual party-----------------------------------
function displayItem(item) {
  const article = makeArticle(item);
  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);

  const cartItemcontent = makeCartContent(item);
  article.appendChild(cartItemcontent);

  displayArticle(article);
  displayCalculateTotalPrice();
  displayTotalQuantity(item);
}

function displayCalculateTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}
function displayTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

function makeCartContent(item) {
  const cartItemcontent = document.createElement("div");
  cartItemcontent.classList.add("cart__item__content");
  const description = makeDescription(item);
  const settings = makeSettings(item);
  cartItemcontent.appendChild(description);
  cartItemcontent.appendChild(settings);
  return cartItemcontent;
}

function makeDescription(item) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const pColor = document.createElement("p");
  pColor.textContent = item.color;
  const pPrice = document.createElement("p");
  pPrice.textContent = item.price + " € ";
  description.appendChild(h2);
  description.appendChild(pColor);
  description.appendChild(pPrice);
  return description;
}

function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantitySelect(settings, item);
  deleteToSettings(settings);
  return settings;
}

function deleteToSettings(settings) {
  const deleteSettings = document.createElement("div");
  deleteSettings.classList.add("cart__item__content__settings__delete");
  deleteSettings.addEventListener("click", () => deleteItem(item));

  const pDelete = document.createElement("p");
  pDelete.textContent = "Supprimer";
  deleteSettings.appendChild(pDelete);
  settings.appendChild(deleteSettings);
}

function deleteItem(item) {
  const itemDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemDelete, 1);
  displayCalculateTotalPrice();
  displayTotalQuantity();
  saveNewDataInLocalstorage(item);
  deleteArticleFromPage(item);
}

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}

function addQuantitySelect(settings, item) {
  const quantitySelect = document.createElement("div");
  quantitySelect.classList.add("cart__item__content__settings__quantity");
  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté : ";
  quantitySelect.appendChild(pQuantity);

  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    priceAndQuantityAdjustment(item.id, input.value, item)
  );

  pQuantity.appendChild(input);
  settings.appendChild(pQuantity);
}

function priceAndQuantityAdjustment(id, newValue, item) {
  const changePriceAndQuantity = cart.find((item) => item.id === id);
  changePriceAndQuantity.quantity = Number(newValue);
  item.quantity = changePriceAndQuantity.quantity;
  displayCalculateTotalPrice();
  displayTotalQuantity();
  saveNewDataInLocalstorage(item);
}
function saveNewDataInLocalstorage(item) {
  const newDateSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, newDateSave);
}

function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("card__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

function makeImageDiv(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

// --------------------party form-------------------------

function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Please select items to buy");
    return;
  }

  if (isFormInvalid()) return;
  if (isEmailInvalid()) return;

  const body = makeRequestBody();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId;
    })
    .catch((err) => console.error(err));
}

function isEmailInvalid() {
  const email = document.querySelector("#email").value;
  const regex = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  if (regex.test(email) === false) {
    alert("merçie de rentrée une adresse email valide");
    return true;
  }
  return false;
}

function isFormInvalid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("mercie de remplir tous les champs");
      return true;
    }
    return false;
  });
}

function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsInlocalstorage(),
  };
  return body;
}

function getIdsInlocalstorage() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}
