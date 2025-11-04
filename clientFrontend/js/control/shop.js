// --- 1️⃣ Global Variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 6;

let selectedBrand = null;
let selectedColor = null;
let selectedCategory = null;
let selectedSubCategory = null;
let priceRange = [0, 300000];

// --- 2️⃣ Selectors
const productContainer = document.querySelector(".category-list .row");
const brandFilters = document.querySelectorAll("input[name='brand']");
const colorFilters = document.querySelectorAll("input[name='color']");
const paginationTop = document.querySelectorAll(".filter-bar .pagination")[0];
const paginationBottom = document.querySelectorAll(".filter-bar .pagination")[1];
const showCountSelects = document.querySelectorAll(".filter-bar select");
const categoryContainer = document.querySelector("#categoryMenu");

// --- 3️⃣ Fetch Products
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5001/api/admin/main/itemdetails-categoryvice");
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    allProducts = data.data.map(item => ({
      id: item.I_Id?.trim(),
      name: item.I_name?.trim() || "No Name",
      price: Number(item.sellPrice) || 0,
      brand: item.brand?.trim().toUpperCase() || "UNKNOWN",
      color: item.color?.trim().toUpperCase() || "N/A",
      category: item.category?.trim() || "Misc",
      subCategory: item.subCategory?.trim() || "",
      image: item.image
        ? `data:image/jpeg;base64,${item.image}`
        : "img/placeholder.png"
    }));

    renderCategoryMenu();
    filterProducts();
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    productContainer.innerHTML = `<p class="text-danger w-100 text-center">Failed to load products.</p>`;
  }
}

// --- 4️⃣ Dynamic Category Menu (Bootstrap 4 collapse style)
function renderCategoryMenu() {
  const categoryContainer = document.querySelector("#categoryMenu");
  if (!categoryContainer) return;
  categoryContainer.innerHTML = "";

  // Group categories and subcategories
  const grouped = {};
  allProducts.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = new Set();
    if (p.subCategory) grouped[p.category].add(p.subCategory);
  });

  // Create category list
  const ul = document.createElement("ul");
  ul.className = "main-categories";

  Object.entries(grouped).forEach(([cat, subs], index) => {
    const collapseId = `cat-${index}`;
    const li = document.createElement("li");
    li.className = "main-nav-list";

    li.innerHTML = `
      <a data-toggle="collapse" href="#${collapseId}" role="button" aria-expanded="false" aria-controls="${collapseId}">
        <span class="lnr lnr-arrow-right toggle-arrow me-1"></span> ${cat}
        <span class="number">(${subs.size})</span>
      </a>
      <ul class="collapse list-unstyled ms-3 mt-1" id="${collapseId}">
        ${Array.from(subs)
          .map(
            sub => `
            <li class="main-nav-list child">
              <a href="#" data-category="${cat}" data-subcategory="${sub}">
                ${sub}
              </a>
            </li>`
          )
          .join("")}
      </ul>
    `;
    ul.appendChild(li);
  });

  categoryContainer.appendChild(ul);

  // --- Collapse arrow rotation
  $(categoryContainer)
    .find('[data-toggle="collapse"]')
    .on("click", function () {
      const $arrow = $(this).find(".lnr");
      const target = $(this).attr("href");

      // Toggle the clicked arrow
      $arrow.toggleClass("lnr-arrow-right lnr-arrow-down");

      // Reset all other arrows
      $(categoryContainer)
        .find('[data-toggle="collapse"]')
        .not(this)
        .find(".lnr")
        .removeClass("lnr-arrow-down")
        .addClass("lnr-arrow-right");

      // Ensure only one open at a time
      $(categoryContainer)
        .find(".collapse")
        .not(target)
        .collapse("hide");

      // Select category
      const catName = $(this).text().trim().split("(")[0].trim();
      if (selectedCategory === catName && !selectedSubCategory) {
        selectedCategory = null;
      } else {
        selectedCategory = catName;
        selectedSubCategory = null;
      }

      highlightSelection();
      filterProducts();
    });

  // --- Subcategory click
  categoryContainer.querySelectorAll(".child a").forEach(subEl => {
    subEl.addEventListener("click", e => {
      e.preventDefault();
      const sub = subEl.dataset.subcategory;
      const cat = subEl.dataset.category;

      if (selectedSubCategory === sub) {
        selectedSubCategory = null;
      } else {
        selectedCategory = cat;
        selectedSubCategory = sub;
      }

      highlightSelection();
      filterProducts();
    });
  });
}


// --- 5️⃣ Highlight Active Category/Subcategory
function highlightSelection() {
  // Reset highlights
  document.querySelectorAll(".main-nav-list > a").forEach(a => a.classList.remove("text-success"));
  document.querySelectorAll(".child a").forEach(a => a.classList.remove("text-success"));

  // Highlight selected
  if (selectedSubCategory) {
    document
      .querySelectorAll(`.child a[data-subcategory="${selectedSubCategory}"]`)
      .forEach(a => a.classList.add("text-success"));
  } else if (selectedCategory) {
    document.querySelectorAll(".main-nav-list > a").forEach(a => {
      if (a.textContent.trim().startsWith(selectedCategory)) {
        a.classList.add("text-success");
      }
    });
  }
}

// --- 6️⃣ Render Products
function renderProducts(products) {
  productContainer.innerHTML = "";

  if (!products.length) {
    productContainer.innerHTML = `<p class="text-center w-100">No products found</p>`;
    return;
  }

  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";
    col.innerHTML = `
      <div class="single-product">
        <img class="img-fluid" src="${p.image}" alt="${p.name}">
        <div class="product-details">
          <h6>${p.name} (${p.id})</h6>
          <div class="price"><h6>Rs.${p.price.toLocaleString()}</h6></div>
          <div class="prd-bottom">
            <a href="#" class="social-info"><span class="ti-bag"></span><p class="hover-text">add to cart</p></a>
            <a href="#" class="social-info"><span class="lnr lnr-heart"></span><p class="hover-text">wishlist</p></a>
            <a href="single-product.html?id=${p.id}" class="social-info"><span class="lnr lnr-move"></span><p class="hover-text">view more</p></a>
          </div>
        </div>
      </div>`;
    productContainer.appendChild(col);
  });
}

// --- 7️⃣ Pagination
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  [paginationTop, paginationBottom].forEach(pagination => {
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    const prevDisabled = currentPage === 1 ? "disabled" : "";
    pagination.insertAdjacentHTML(
      "beforeend",
      `<a href="#" class="prev-arrow ${prevDisabled}"><i class="fa fa-long-arrow-left"></i></a>`
    );

    for (let i = 1; i <= totalPages; i++) {
      pagination.insertAdjacentHTML(
        "beforeend",
        `<a href="#" class="${i === currentPage ? "active" : ""}">${i}</a>`
      );
    }

    const nextDisabled = currentPage === totalPages ? "disabled" : "";
    pagination.insertAdjacentHTML(
      "beforeend",
      `<a href="#" class="next-arrow ${nextDisabled}"><i class="fa fa-long-arrow-right"></i></a>`
    );

    pagination.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        if (link.classList.contains("disabled")) return;
        if (link.classList.contains("prev-arrow") && currentPage > 1) currentPage--;
        else if (link.classList.contains("next-arrow") && currentPage < totalPages) currentPage++;
        else if (!isNaN(link.textContent)) currentPage = parseInt(link.textContent);
        filterProducts();
        scrollToTop();
      });
    });
  });
}

// --- 8️⃣ Apply Filters
function filterProducts() {
  filteredProducts = allProducts.filter(p => {
    const categoryOk = !selectedCategory || p.category === selectedCategory;
    const subCatOk = !selectedSubCategory || p.subCategory === selectedSubCategory;
    const brandOk = !selectedBrand || p.brand === selectedBrand;
    const colorOk = !selectedColor || p.color === selectedColor;
    const priceOk = p.price >= priceRange[0] && p.price <= priceRange[1];
    return categoryOk && subCatOk && brandOk && colorOk && priceOk;
  });

  const total = filteredProducts.length;
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, total);
  const paginated = filteredProducts.slice(start, end);

  renderProducts(paginated);
  renderPagination(total);
}

// --- 9️⃣ Brand Filter (Unselectable)
brandFilters.forEach(input => {
  input.addEventListener("click", () => {
    if (input.dataset.checked === "true") {
      input.checked = false;
      input.dataset.checked = "false";
      selectedBrand = null;
    } else {
      brandFilters.forEach(b => b.dataset.checked = "false");
      input.dataset.checked = "true";
      selectedBrand = input.id.trim().toUpperCase();
    }
    currentPage = 1;
    filterProducts();
  });
});

// --- 🔟 Color Filter (Unselectable)
colorFilters.forEach(input => {
  input.addEventListener("click", () => {
    if (input.dataset.checked === "true") {
      input.checked = false;
      input.dataset.checked = "false";
      selectedColor = null;
    } else {
      colorFilters.forEach(c => c.dataset.checked = "false");
      input.dataset.checked = "true";
      selectedColor = input.id.trim().toUpperCase();
    }
    currentPage = 1;
    filterProducts();
  });
});

// --- 11️⃣ Show Count
showCountSelects.forEach(select => {
  select.addEventListener("change", e => {
    const value = e.target.options[e.target.selectedIndex].text;
    itemsPerPage = parseInt(value.replace("Show", "").trim()) || 6;
    showCountSelects.forEach(s => (s.value = e.target.value));
    currentPage = 1;
    filterProducts();
  });
});

// --- 12️⃣ Scroll Helper
function scrollToTop() {
  window.scrollTo({
    top: document.querySelector(".category-list").offsetTop - 100,
    behavior: "smooth"
  });
}

// --- 13️⃣ Init
document.addEventListener("DOMContentLoaded", loadProducts);

// --- 14️⃣ Small Style Enhancement
// Rotate arrow when expanded
const style = document.createElement("style");
style.innerHTML = `
  .main-nav-list > a .lnr.rotated {
    transform: rotate(90deg);
    transition: transform 0.2s;
  }
`;
document.head.appendChild(style);
