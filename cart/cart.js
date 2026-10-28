document.addEventListener("DOMContentLoaded", () => {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let discountMultiplier = 1;

    const cartItemsContainer = document.querySelector(".cart-items");
    const applyBtn = document.querySelector(".btnapply");
    const couponInput = document.getElementById("coupontxt");

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty.</p>`;
            updateTotal();
            updateItemCount();
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <img class="item-img" src="${item.image}" alt="${item.title}">
                
                <div class="item-details">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-rating">
                        <span class="stars">★★★★★</span>
                        <span class="review-count">(9 Reviews)</span>
                    </div>
                    <div class="item-shipping">
                        <img class="truck-icon" src="shipping.png" alt="shipping">
                        <span class="shipping-text">Shipping • <span class="in-stock">In Stock</span></span>
                    </div>
                </div>

                <div class="item-actions">
                    <span class="item-price">₱${item.price.toLocaleString()}</span>
                    <div class="quantity-controls">
                        <button class="qty-btn minus-btn" data-index="${index}">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn plus-btn" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);

            if (index < cart.length - 1) {
                const divider = document.createElement("hr");
                divider.className = "item-divider";
                cartItemsContainer.appendChild(divider);
            }
        });

        attachEventListeners();
        updateTotal();
        updateItemCount();
    }

    function attachEventListeners() {
        document.querySelectorAll(".plus-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                cart[index].quantity++;
                saveCart();
                renderCart();
            });
        });

        document.querySelectorAll(".minus-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    renderCart();
                }
            });
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });
    }

    if (applyBtn && couponInput) {
        applyBtn.addEventListener("click", () => {
            var enteredCode = couponInput.value.trim().toUpperCase();
            if (enteredCode === "BSITSTUDENT26") {
                discountMultiplier = 0.8;
                alert("Coupon applied successfully! (20% Off)");
                updateTotal();
            } else if (enteredCode === "") {
                alert("Please enter a coupon code.");
            } else {
                alert("Invalid coupon code.");
                discountMultiplier = 1; 
                updateTotal();
            }
        });
    }

    function updateTotal() {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        let finalTotal = subtotal * discountMultiplier;
        var totalSpan = document.getElementById("estimated-total");
        if (totalSpan) {
            totalSpan.textContent = "₱" + Math.round(finalTotal).toLocaleString();
        }
    }

    function updateItemCount() {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        var countSpan = document.querySelector(".CartText span");
        if (countSpan) {
            countSpan.textContent = `(${totalItems} Item${totalItems !== 1 ? 's' : ''})`;
        }
    }

    renderCart();
});