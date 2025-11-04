// ✅ Extract Item ID from URL (e.g. single-product.html?id=I123)
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

// ✅ Select DOM elements for updating
const productTitle = document.querySelector(".s_product_text h3");
const productPrice = document.querySelector(".s_product_text h2");
const productDesc = document.querySelector(".s_product_text p");
const productCategory = document.querySelector(".s_product_text ul li:first-child a");
const productAvailability = document.querySelector(".s_product_text ul li:last-child a");
const productImageContainer = document.querySelector(".s_Product_carousel");
const addToCartBtn = document.querySelector(".primary-btn"); // "Add to Cart" button
const qtyInput = document.getElementById("sst");

// ✅ Description & Specification Tab Elements
const descriptionTab = document.querySelector("#home");
const specTableBody = document.querySelector("#profile table tbody");

// ✅ Item variable for storing current product details
let currentItem = null;

// ✅ Function to load single item detail
async function loadItemDetail() {
  if (!itemId) {
    console.error("❌ No Item ID found in URL.");
    document.querySelector(".s_product_text").innerHTML = `<p class="text-danger">Invalid product link.</p>`;
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/api/admin/main/itemdetails/${itemId}`);
    const data = await res.json();

    if (!data.success) {
      console.error("❌ Failed to load item detail:", data.message);
      document.querySelector(".s_product_text").innerHTML = `<p class="text-danger">${data.message}</p>`;
      return;
    }

    const item = data.data;
    currentItem = item; // store for later Add to Cart

    // ✅ Update product image carousel
    const productImage = item.image
      ? `data:image/jpeg;base64,${item.image}`
      : "img/placeholder.png";

    productImageContainer.innerHTML = `
      <div class="single-prd-item">
        <img class="img-fluid" src="${productImage}" alt="${item.I_name}">
      </div>
    `;

    // ✅ Update product title and price
    productTitle.textContent = `${item.I_name || "Unnamed Item"} (${item.I_Id || "No ID"})`;
    productPrice.textContent = `Rs.${(item.sellPrice || 0).toFixed(2)}`;

    // ✅ Update short description
    productDesc.textContent = item.stDesc || "No short description available.";

    // ✅ Update category and stock availability
    const categoryName = item.mnCategory || "Uncategorized";
    const type = item.type || "";
    const availabilityText =
      item.availableQty && item.availableQty > 0 ? "In Stock" : "Out of Stock";

    productCategory.innerHTML = `<span>Category</span> : ${categoryName} - ${type}`;
    productAvailability.innerHTML = `<span>Availability</span> : ${availabilityText}`;

    // ✅ Update long description
    descriptionTab.innerHTML = `<p>${item.lgdesc || "No long description available."}</p>`;

    // ✅ Update specifications
    specTableBody.innerHTML = `
      ${item.width ? `<tr><td><h5>Width</h5></td><td><h5>${item.width}</h5></td></tr>` : ""}
      ${item.height ? `<tr><td><h5>Height</h5></td><td><h5>${item.height}</h5></td></tr>` : ""}
      ${item.depth ? `<tr><td><h5>Depth</h5></td><td><h5>${item.depth}</h5></td></tr>` : ""}
      ${item.weight ? `<tr><td><h5>Weight</h5></td><td><h5>${item.weight}</h5></td></tr>` : ""}
      ${item.qualityCheck ? `<tr><td><h5>Quality checking</h5></td><td><h5>${item.qualityCheck}</h5></td></tr>` : ""}
      ${item.freshDuration ? `<tr><td><h5>Freshness Duration</h5></td><td><h5>${item.freshDuration}</h5></td></tr>` : ""}
      ${item.packetType ? `<tr><td><h5>When packeting</h5></td><td><h5>${item.packetType}</h5></td></tr>` : ""}
      ${item.eachBox ? `<tr><td><h5>Each Box contains</h5></td><td><h5>${item.eachBox}</h5></td></tr>` : ""}
    `;

  } catch (error) {
    console.error("❌ Error fetching item detail:", error);
    document.querySelector(".s_product_text").innerHTML = `<p class="text-danger">Error loading item details.</p>`;
  }
}

// ✅ Add to Cart Functionality
function addToCart() {
  if (!currentItem) {
    alert("❌ Item details not loaded yet. Please wait.");
    return;
  }

  const qty = parseInt(qtyInput.value) || 1;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ FIXED: correct field name (I_Id instead of I_id)
  const productId = currentItem.I_Id || currentItem.id;

  const existingIndex = cart.findIndex(i => i.id === productId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: productId,
      name: currentItem.I_name,
      price: currentItem.sellPrice,
      quantity: qty,
      img: currentItem.image
        ? `data:image/jpeg;base64,${currentItem.image}`
        : "img/placeholder.png"
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${currentItem.I_name} added to cart!`);
}

// ✅ Event listener for Add to Cart button
addToCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addToCart();
});

// ✅ Run on page load
document.addEventListener("DOMContentLoaded", loadItemDetail);
