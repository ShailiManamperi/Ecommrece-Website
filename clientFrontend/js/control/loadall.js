// Get container element
const container = document.getElementById("product-container");

// Function to fetch items from API and render
async function loadProducts() {
    try {
        const res = await fetch("http://localhost:5001/api/admin/main/itemdetails");
        const data = await res.json();

        if (!data.success) {
            container.innerHTML = `<p class="text-danger">Failed to load products: ${data.message}</p>`;
            return;
        }

        // Convert API data into product objects
        let products = data.data.map((item) => ({
            id: item.I_Id,
            img: item.image ? `data:image/jpeg;base64,${item.image}` : "img/placeholder.png",
            name: item.I_name || "No Name",
            price: item.sellPrice || 0,
            oldPrice: (item.sellPrice || 0) + 5000
        }));

        // ✅ Shuffle and select 8 random products
        products = products
            .sort(() => Math.random() - 0.5) // Randomize order
            .slice(0, 8); // Take first 8

        // Render selected products
        container.innerHTML = products
            .map(
                (p) => `
            <div class="col-lg-3 col-md-6">
                <div class="single-product">
                    <img class="img-fluid" src="${p.img}" alt="${p.name}">
                    <div class="product-details">
                        <h6>${p.name} (${p.id})</h6>
                        <div class="price">
                            <h6>Rs.${p.price.toFixed(2)}</h6>
                            <h6 class="l-through">Rs.${p.oldPrice.toFixed(2)}</h6>
                        </div>
                        <div class="prd-bottom">
                            <a href="#" class="social-info add-to-cart" 
                               data-id="${p.id}" 
                               data-name="${p.name}" 
                               data-price="${p.price}" 
                               data-img="${p.img}">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to cart</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-sync"></span>
                                <p class="hover-text">compare</p>
                            </a>
                            <a href="single-product.html?id=${encodeURIComponent(p.id)}" class="social-info">
                                <span class="lnr lnr-move"></span>
                                <p class="hover-text">view more</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `
            )
            .join("");

        // Attach add-to-cart event listeners
        const cartButtons = document.querySelectorAll(".add-to-cart");
        cartButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                const user = JSON.parse(localStorage.getItem("user")); // Get logged user
                if (!user) {
                    window.location.href = "login.html";
                    return;
                }

                // Create product object
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    img: btn.dataset.img,
                    quantity: 1
                };

                // Get existing cart
                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                // ✅ Check if product already exists in cart
                const existingItemIndex = cart.findIndex(item => item.id === product.id);

                if (existingItemIndex !== -1) {
                    // Increase only quantity if exists
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add as new product if not exists
                    cart.push(product);
                }

                // Save back to localStorage
                localStorage.setItem("cart", JSON.stringify(cart));
            });
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-danger">Error loading products.</p>`;
    }
}

// Call on page load
loadProducts();
