// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const proceedBtn = document.getElementById("login_form");

  proceedBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Login info
    const loginData = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value.trim(),
    };
    console.log(loginData);
    // Billing info
    // const billingData = {
    //   firstName: document.getElementById("first").value.trim(),
    //   lastName: document.getElementById("last").value.trim(),
    //   company: document.getElementById("company").value.trim(),
    //   phone: document.getElementById("number").value.trim(),
    //   email: document.getElementById("email").value.trim(),
    //   address1: document.getElementById("add1").value.trim(),
    //   address2: document.getElementById("add2").value.trim(),
    //   city: document.getElementById("city").value.trim(),
    //   zip: document.getElementById("zip").value.trim(),
    //   notes: document.getElementById("message").value.trim(),
    // };

    // const orderPayload = {
    //   login: loginData,
    //   billing: billingData,
    // };

    // console.log("Submitting order:", orderPayload);

    // try {
    //   const response = await fetch("http://localhost:5000/api/checkout", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(orderPayload),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    //     alert("Order submitted successfully!");
    //   } else {
    //     alert(`Error: ${result.message || "Something went wrong"}`);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("Server error — please try again later.");
    // }
  });
});

// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const payButton = document.querySelector(".order_box .primary-btn");
  const billingForm = document.getElementById("biil_form");

  if (!payButton || !billingForm) return;

  payButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // Collect billing details
    const billingData = {
      firstName: document.getElementById("first").value.trim(),
      lastName: document.getElementById("last").value.trim(),
      company: document.getElementById("company").value.trim(),
      email: document.getElementById("email").value.trim(),
      contact1: document.querySelectorAll("#number")[0]?.value.trim() || "",
      contact2: document.querySelectorAll("#number")[1]?.value.trim() || "",
      address1: document.getElementById("add1").value.trim(),
      address2: document.getElementById("add2").value.trim(),
      city: document.getElementById("city").value.trim(),
      notes: document.getElementById("message").value.trim(),
    };

    // Collect order details from list
    const products = [];
    document.querySelectorAll(".order_box .list li").forEach((item, index) => {
      if (index === 0) return; // Skip header row

      const name = item.querySelector("a")?.childNodes[0]?.textContent?.trim();
      const quantity = item.querySelector(".middle")?.textContent?.replace("x", "").trim();
      const price = item.querySelector(".last")?.textContent?.replace("$", "").trim();

      if (name && quantity && price) {
        products.push({ name, quantity, price });
      }
    });

    // Collect totals
    const subtotal = document.querySelector(".list_2 li:nth-child(1) span")?.textContent.replace("$", "").trim();
    const delivery = document.querySelector(".list_2 li:nth-child(2) span")?.textContent.trim();
    const total = document.querySelector(".list_2 li:nth-child(3) span")?.textContent.replace("$", "").trim();

    const orderData = {
      billing: billingData,
      products,
      subtotal,
      delivery,
      total,
      date: new Date().toISOString(),
    };

    console.log("Submitting order:", orderData);

    // try {
    //   const response = await fetch("http://localhost:5000/api/orders", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(orderData),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    //     alert("✅ Order saved successfully!");
    //     billingForm.reset();
    //   } else {
    //     alert(`❌ Error: ${result.message || "Failed to save order."}`);
    //   }
    // } catch (err) {
    //   console.error("Error saving order:", err);
    //   alert("⚠️ Could not save order. Please try again.");
    // }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.querySelector(".order_box .list");
  const summaryList = document.querySelector(".order_box .list_2");

  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderOrderBox() {
    // Clear existing items (but keep first title row)
    orderList.querySelectorAll("li:not(:first-child)").forEach(li => li.remove());

    let subtotal = 0;

    // --- If cart empty ---
    if (cart.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.innerHTML = `<a href="#">Your cart is empty <span></span></a>`;
      orderList.appendChild(emptyLi);

      updateSummary(0);
      return;
    }

    // --- Render cart items ---
    cart.forEach(item => {
      const total = item.price * item.quantity;
      subtotal += total;

      const li = document.createElement("li");
      li.innerHTML = `
        <a href="#">
          ${item.id}
          <span class="middle">x ${item.quantity}</span>
          <span class="last">Rs.${total.toFixed(2)}</span>
        </a>
      `;
      orderList.appendChild(li);
    });

    updateSummary(subtotal);
  }

  function updateSummary(subtotal) {
    // const deliveryCharge = subtotal > 0 ? 50 : 0; // example flat rate
    // const total = subtotal + deliveryCharge;

    // Clear and rebuild summary list
    summaryList.innerHTML = `
      <li><a href="#">Subtotal <span>Rs.${subtotal.toFixed(2)}</span></a></li>
      
    `;
  }

  renderOrderBox();
});


