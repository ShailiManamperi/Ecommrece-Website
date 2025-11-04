document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("cart-body");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    // Keep coupon + checkout rows
    const couponRow = tableBody.querySelector(".bottom_button");
    const checkoutRow = tableBody.querySelector(".out_button_area");

    // Clear all old product & subtotal rows
    tableBody.querySelectorAll("tr[data-index], .subtotal_row, .empty_row").forEach(r => r.remove());

    // --- If cart empty ---
    if (cart.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.classList.add("empty_row");
      emptyRow.innerHTML = `<td colspan="4" class="text-center"><h4>Your cart is empty.</h4></td>`;
      tableBody.insertBefore(emptyRow, checkoutRow);
      updateTotals();
      return;
    }

    // --- Insert product rows BEFORE coupon row ---
    cart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-index", index);
      tr.innerHTML = `
        <td>
          <div class="media">
            <div class="d-flex">
              <img src="${item.img}" alt="${item.name}" 
                   style="width:100px;height:100px;object-fit:cover;">
            </div>
            <div class="media-body"><p>${item.name}</p></div>
          </div>
        </td>
        <td><h5>Rs.${item.price.toFixed(2)}</h5></td>
        <td>
          <div class="product_count d-flex align-items-center justify-content-center gap-1">
            <button class="decrease items-count btn btn-sm btn-light" type="button">
              <i class="lnr lnr-chevron-down"></i>
            </button>
            <input type="text" class="qty" value="${item.quantity}" readonly 
                   style="width:45px;text-align:center;border:1px solid #ccc;border-radius:4px;">
            <button class="increase items-count btn btn-sm btn-light" type="button">
              <i class="lnr lnr-chevron-up"></i>
            </button>
          </div>
        </td>
        <td><h5 class="item-total">Rs.${(item.price * item.quantity).toFixed(2)}</h5></td>
      `;
      tableBody.insertBefore(tr, couponRow);
    });

    // --- Subtotal row AFTER coupon row ---
    const subtotalRow = document.createElement("tr");
    subtotalRow.classList.add("subtotal_row");
    subtotalRow.innerHTML = `
      <td></td><td></td>
      <td><h5>Subtotal</h5></td>
      <td><h5 id="subtotal">Rs.0.00</h5></td>
    `;
    tableBody.insertBefore(subtotalRow, checkoutRow);

    attachHandlers();
    updateTotals();
  }

  function updateTotals() {
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.quantity);
    const subtotalElem = document.getElementById("subtotal");
    if (subtotalElem) subtotalElem.textContent = `Rs.${subtotal.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function attachHandlers() {
    const rows = tableBody.querySelectorAll("tr[data-index]");
    rows.forEach(row => {
      const index = parseInt(row.getAttribute("data-index"));
      const incBtn = row.querySelector(".increase");
      const decBtn = row.querySelector(".decrease");
      const qtyInput = row.querySelector(".qty");
      const totalCell = row.querySelector(".item-total");

      incBtn.addEventListener("click", () => {
        cart[index].quantity++;
        qtyInput.value = cart[index].quantity;
        totalCell.textContent = `Rs.${(cart[index].price * cart[index].quantity).toFixed(2)}`;
        saveCart();
        updateTotals();
      });

      decBtn.addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else if (confirm(`Remove "${cart[index].name}" from cart?`)) {
          cart.splice(index, 1);
          saveCart();
          renderCart();
          return;
        }
        qtyInput.value = cart[index]?.quantity || 0;
        totalCell.textContent = `Rs.${(cart[index]?.price * cart[index]?.quantity || 0).toFixed(2)}`;
        saveCart();
        updateTotals();
      });
    });
  }

  renderCart();
});

