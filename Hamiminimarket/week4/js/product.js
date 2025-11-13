
//  product.js
import { Cart } from "./cart.js";

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const cartSidebar = document.getElementById("cart-sidebar");
const cartIcon = document.getElementById("cart-icon");

let products = [];

//  Load products
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
    Cart.renderCart();
    Cart.updateCount();
  });

//  Display products
function displayProducts(list) {
  productList.innerHTML = "";
  list.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

//  Search & Filter
function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const priceLimit = priceFilter.value === "all" ? Infinity : +priceFilter.value;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchValue) &&
    (category === "all" || p.category === category) &&
    p.price <= priceLimit
  );
  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);

//  Add to Cart button
productList.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = +e.target.dataset.id;
    const product = products.find(p => p.id === id);
    Cart.addItem(product);
    showToast(`${product.name} added to cart`);
  }
});

//  Cart Sidebar Toggle
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
});

//  Toast Notification
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast show";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2000);
}
