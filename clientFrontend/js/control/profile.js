document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const ordersList = document.getElementById("my-orders");

  // Load saved profile
  const savedProfile = JSON.parse(localStorage.getItem("customerProfile")) || {};

  // Prefill form if data exists
  if (Object.keys(savedProfile).length > 0) {
    form.firstName.value = savedProfile.firstName || "";
    form.lastName.value = savedProfile.lastName || "";
    form.email.value = savedProfile.email || "";
    form.company.value = savedProfile.company || "";
    form.contact1.value = savedProfile.contact1 || "";
    form.contact2.value = savedProfile.contact2 || "";
    form.address.value = savedProfile.address || "";
  }

  // Save or update profile
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const profile = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim(),
      contact1: form.contact1.value.trim(),
      contact2: form.contact2.value.trim(),
      address: form.address.value.trim(),
    };

    localStorage.setItem("customerProfile", JSON.stringify(profile));
    alert("Profile details updated successfully!");
  });

  // Load Orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">No orders yet<span></span></a>`;
    ordersList.appendChild(li);
  } else {
    orders.forEach((order, index) => {
      const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="#">
          Order #${index + 1} 
          <span class="middle">${order.items.length} items</span>
          <span class="last">Rs.${total.toFixed(2)}</span>
        </a>
      `;
      ordersList.appendChild(li);
    });
  }
});
