// import { storage } from "./storage.js";

// export const cart = {
//   items: [],

//   add(product) {
//     const existing = this.items.find(i => i.name === product.name);
//     if (existing) {
//       existing.qty++;
//     } else {
//       this.items.push({ ...product, qty: 1 });
//     }
//     this.update();
//   },

//   remove(name) {
//     this.items = this.items.filter(i => i.name !== name);
//     this.update();
//   },

//   updateQty(name, qty) {
//     const item = this.items.find(i => i.name === name);
//     if (item) item.qty = qty;
//     this.update();
//   },

//   calculateTotals() {
//     const subtotal = this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
//     const tax = subtotal * 0.05;
//     const discount = subtotal > 50 ? subtotal * 0.1 : 0;
//     const total = subtotal + tax - discount;
//     return { subtotal, tax, discount, total };
//   },

//   update() {
//     storage.save(this.items);
//     this.render();
//   },

//   render() {
//     const container = document.getElementById("cart-items");
//     const count = document.getElementById("cart-count");
//     container.innerHTML = "";
//     count.textContent = this.items.reduce((sum, i) => sum + i.qty, 0);

//     this.items.forEach(item => {
//       const div = document.createElement("div");
//       div.className = "cart-item";
//       div.innerHTML = `
//         <span>${item.name} ($${item.price})</span>
//         <div>
//           <input type="number" min="1" value="${item.qty}">
//           <button class="remove">x</button>
//         </div>
//       `;
//       div.querySelector("input").addEventListener("change", e => this.updateQty(item.name, +e.target.value));
//       div.querySelector(".remove").addEventListener("click", () => this.remove(item.name));
//       container.appendChild(div);
//     });

//     const { subtotal, tax, discount, total } = this.calculateTotals();
//     document.getElementById("subtotal").textContent = subtotal.toFixed(2);
//     document.getElementById("tax").textContent = tax.toFixed(2);
//     document.getElementById("discount").textContent = discount.toFixed(2);
//     document.getElementById("total").textContent = total.toFixed(2);
//   },

//   loadFromStorage() {
//     this.items = storage.load();
//     this.render();
//   }
// };


// ✅ cart.js
import { Storage } from "./storage.js";

export const Cart = {
  items: Storage.getCart(),

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.updateCart();
  },

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.updateCart();
  },

  changeQuantity(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = qty > 0 ? qty : 1;
      this.updateCart();
    }
  },

  getTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = +(subtotal * 0.05).toFixed(2);
    const discount = subtotal > 30 ? 5 : 0;
    const total = +(subtotal + tax - discount).toFixed(2);
    return { subtotal, tax, discount, total };
  },

  updateCart() {
    Storage.saveCart(this.items);
    this.renderCart();
    this.updateCount();
  },

  updateCount() {
    document.getElementById("cart-count").textContent = this.items.length;
  },

  clearCart() {
    this.items = [];
    Storage.clearCart();
    this.renderCart();
    this.updateCount();
  },

  renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const { subtotal, tax, discount, total } = this.getTotals();
    cartContainer.innerHTML = "";

    this.items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name} (${item.quantity}x)</span>
        <div>
          <button class="dec" data-id="${item.id}">-</button>
          <button class="inc" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">🗑️</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
  }
};

// ✅ Cart Event Listeners (dynamic)
document.addEventListener("click", e => {
  if (e.target.classList.contains("remove")) {
    Cart.removeItem(+e.target.dataset.id);
  } else if (e.target.classList.contains("inc")) {
    const id = +e.target.dataset.id;
    const item = Cart.items.find(i => i.id === id);
    Cart.changeQuantity(id, item.quantity + 1);
  } else if (e.target.classList.contains("dec")) {
    const id = +e.target.dataset.id;
    const item = Cart.items.find(i => i.id === id);
    Cart.changeQuantity(id, item.quantity - 1);
  }
});

document.getElementById("confirm-order").addEventListener("click", () => {
  alert("✅ Order Confirmed! Thank you for shopping with HAMI_ 🥕");
  Cart.clearCart();
});

