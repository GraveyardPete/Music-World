document.addEventListener("DOMContentLoaded", () => {
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch {
        cart = [];
    }

    const selectedItems = document.getElementById("selected-items");
    const subtotalElement = document.getElementById("subtotal");
    const discountRow = document.getElementById("discount-row");
    const discountAmountElement = document.getElementById("discount-amount");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const checkoutForm = document.getElementById("checkout-form");
    const placeOrderButton = checkoutForm.querySelector(".place-order");

    const COUPON_CODE = "BSITSTUDENT26";
    const DISCOUNT_RATE = 0.20;
    const SHIPPING_FEE = 0;

    const formatPrice = amount =>
        "₱" + amount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    function getCouponCode() {
        const possibleKeys = [
            "coupon",
            "couponCode",
            "appliedCoupon",
            "discountCode"
        ];

        for (const storage of [sessionStorage, localStorage]) {
            for (const key of possibleKeys) {
                const value = storage.getItem(key);

                if (value && value.trim().toUpperCase() === COUPON_CODE) {
                    return COUPON_CODE;
                }
            }
        }

        return "";
    }

    function getSubtotal() {
        return cart.reduce((sum, item) => {
            const price = Math.max(0, Number(item.price) || 0);
            const quantity = Math.max(0, Number(item.quantity) || 0);

            return sum + price * quantity;
        }, 0);
    }

    function renderItems() {
        selectedItems.replaceChildren();

        if (cart.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-cart";
            message.textContent = "Your cart is empty. Please add items before checking out.";
            selectedItems.appendChild(message);

            placeOrderButton.disabled = true;
            updateSummary();
            return;
        }

        cart.forEach(item => {
            const itemContainer = document.createElement("div");
            itemContainer.className = "checkout-item";

            if (item.image) {
                const image = document.createElement("img");
                image.className = "checkout-item-image";
                image.src = item.image;
                image.alt = item.title || "Product image";

                image.addEventListener("error", () => {
                    image.style.display = "none";
                });

                itemContainer.appendChild(image);
            }

            const details = document.createElement("div");
            details.className = "checkout-item-details";

            const title = document.createElement("p");
            title.className = "checkout-item-title";
            title.textContent = item.title || "Unnamed product";

            const quantity = document.createElement("p");
            quantity.className = "checkout-item-quantity";
            quantity.textContent = "Quantity: " + Math.max(0, Number(item.quantity) || 0);

            const price = document.createElement("div");
            price.className = "checkout-item-price";
            price.textContent = formatPrice(
                Math.max(0, Number(item.price) || 0) *
                Math.max(0, Number(item.quantity) || 0)
            );

            details.append(title, quantity, price);
            itemContainer.appendChild(details);
            selectedItems.appendChild(itemContainer);
        });

        placeOrderButton.disabled = false;
        updateSummary();
    }

    function updateSummary() {
        const subtotal = getSubtotal();
        const discount = getCouponCode() === COUPON_CODE
            ? subtotal * DISCOUNT_RATE
            : 0;

        const shipping = SHIPPING_FEE;
        const total = Math.max(0, subtotal - discount + shipping);

        subtotalElement.textContent = formatPrice(subtotal);
        discountAmountElement.textContent = "−" + formatPrice(discount);
        shippingElement.textContent = formatPrice(shipping);
        totalElement.textContent = formatPrice(total);

        discountRow.hidden = discount <= 0;
    }

    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
        }

        if (!checkoutForm.reportValidity()) {
            return;
        }

        const formData = new FormData(checkoutForm);
        const subtotal = getSubtotal();
        const couponCode = getCouponCode();
        const discount = couponCode === COUPON_CODE
            ? subtotal * DISCOUNT_RATE
            : 0;

        const order = {
            orderId: "MW-" + Date.now(),
            customer: {
                fullname: formData.get("fullname").trim(),
                email: formData.get("email").trim(),
                address: formData.get("address").trim(),
                city: formData.get("city").trim()
            },
            payment: formData.get("payment"),
            items: cart.map(item => ({
                title: item.title || "Unnamed product",
                image: item.image || "",
                price: Math.max(0, Number(item.price) || 0),
                quantity: Math.max(0, Number(item.quantity) || 0)
            })),
            subtotal: subtotal,
            coupon: couponCode || null,
            discount: discount,
            shipping: SHIPPING_FEE,
            total: Math.max(0, subtotal - discount + SHIPPING_FEE),
            date: new Date().toISOString()
        };

        try {
            localStorage.setItem("lastOrder", JSON.stringify(order));

            alert(
                "Order placed successfully!\n" +
                "Order number: " + order.orderId + "\n" +
                "Total: " + formatPrice(order.total)
            );

            localStorage.removeItem("cart");
            localStorage.removeItem("coupon");
            sessionStorage.removeItem("coupon");
            sessionStorage.removeItem("couponCode");
            sessionStorage.removeItem("appliedCoupon");
            sessionStorage.removeItem("discountCode");

            window.location.href = "home.html";
        } catch {
            alert("Unable to save your order. Please check your browser storage and try again.");
        }
    });

    renderItems();
});
