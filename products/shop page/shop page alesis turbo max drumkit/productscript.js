document.addEventListener("DOMContentLoaded", () => {
    const addToCartBtn = document.getElementById("add-to-cart");
    const buyNowBtn = document.getElementById("buy-now");
    const viewCartBtn = document.getElementById("view-cart");
    const quantityInput = document.getElementById("quantity");
    const cartSummaryText = document.getElementById("cart-summary-text");

    // Helper to get cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    // Helper to save cart and update the live summary widget on the page
    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartSummary();
    }

    // Update the mini cart summary widget
    function updateCartSummary() {
        let cart = getCart();
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cartSummaryText) {
            cartSummaryText.innerHTML = `${totalItems} item(s) | Subtotal: <strong>₱${subtotal.toLocaleString()}</strong>`;
        }
    }

    // Extract product details directly from your HTML elements
    function getProductDetails() {
        const title = document.querySelector(".product-info h1").textContent.trim();
        const priceText = document.querySelector(".product-info .price").textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
        const image = document.querySelector(".product-visual img").getAttribute("src");
        const quantity = parseInt(quantityInput.value) || 1;

        return { title, price, image, quantity };
    }

    // "Add to cart" Button Click
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            let product = getProductDetails();
            let cart = getCart();

            let existingIndex = cart.findIndex(item => item.title === product.title);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += product.quantity;
            } else {
                cart.push(product);
            }

            saveCart(cart);
            alert(`${product.title} (x${product.quantity}) added to your cart!`);
        });
    }

    // "Buy now" Button Click (Adds product and redirects using your nested path)
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", () => {
            let product = getProductDetails();
            let cart = getCart();

            let existingIndex = cart.findIndex(item => item.title === product.title);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += product.quantity;
            } else {
                cart.push(product);
            }

            saveCart(cart);
            window.location.href = "../../../cart/cart.html";
        });
    }

    // "View cart" Button Click
    if (viewCartBtn) {
        viewCartBtn.addEventListener("click", () => {
            window.location.href = "../../../cart/cart.html";
        });
    }

    // Run summary update immediately when the page loads
    updateCartSummary();
});