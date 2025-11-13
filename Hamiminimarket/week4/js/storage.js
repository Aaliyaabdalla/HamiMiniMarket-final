// export const storage = {
//   key: "hami_cart_v1",
//   save(data) {
//     localStorage.setItem(this.key, JSON.stringify(data));
//   },
//   load() {
//     const data = localStorage.getItem(this.key);
//     return data ? JSON.parse(data) : [];
//   }
// };


// ✅ storage.js
export const Storage = {
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  getCart() {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  },

  clearCart() {
    localStorage.removeItem("cart");
  }
};
