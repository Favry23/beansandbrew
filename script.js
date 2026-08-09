// Shopping Cart functionality
let cart = [];

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    updateCartCount();
    alert(itemName + ' added to cart!');
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function openCart() {
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('total-price').textContent = '0.00';
        return;
    }
    
    let totalPrice = 0;
    let html = '';
    
    cart.forEach((item, index) => {
        totalPrice += item.price;
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} BHD</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCartItems();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    displayCheckoutSummary();
    closeCart();
    document.getElementById('checkout-modal').style.display = 'block';
}

function displayCheckoutSummary() {
    const summaryContainer = document.getElementById('summary-items');
    let totalPrice = 0;
    let html = '';
    
    cart.forEach(item => {
        totalPrice += item.price;
        html += `<div class="summary-item">
            <span>${item.name}</span>
            <span>${item.price.toFixed(2)} BHD</span>
        </div>`;
    });
    
    summaryContainer.innerHTML = html;
    document.getElementById('summary-total').textContent = totalPrice.toFixed(2);
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Handle payment method toggle
document.addEventListener('DOMContentLoaded', function() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const codInfo = document.getElementById('cod-info');
            const benefitInfo = document.getElementById('benefit-info');
            
            if (this.value === 'cod') {
                codInfo.style.display = 'block';
                benefitInfo.style.display = 'none';
            } else if (this.value === 'benefit') {
                codInfo.style.display = 'none';
                benefitInfo.style.display = 'block';
            }
        });
    });
});

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = checkoutForm.querySelector('input[type="text"]').value;
            const email = checkoutForm.querySelector('input[type="email"]').value;
            const phone = checkoutForm.querySelector('input[type="tel"]').value;
            const address = checkoutForm.querySelector('textarea').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Calculate total
            let total = 0;
            cart.forEach(item => {
                total += item.price;
            });
            
            // Create order summary
            let orderItems = cart.map(item => `- ${item.name}: ${item.price.toFixed(2)} BHD`).join('\n');
            
            // Prepare email content
            let emailContent = `
New Order Received!

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Home Address: ${address}

Order Items:
${orderItems}

Total: ${total.toFixed(2)} BHD

Payment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Benefit Pay'}
`;
            
            if (paymentMethod === 'benefit') {
                const transactionRef = document.getElementById('transaction-ref').value;
                emailContent += `Transaction Reference: ${transactionRef || 'Not provided'}`;
            }
            
            // Send email via Formspree
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('items', orderItems);
            formData.append('total', total.toFixed(2) + ' BHD');
            formData.append('payment_method', paymentMethod);
            
            if (paymentMethod === 'benefit') {
                formData.append('transaction_ref', document.getElementById('transaction-ref').value);
            }
            
            // Using Formspree service
            fetch('https://formspree.io/f/myzywglw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Order submitted successfully! We will contact you soon to confirm your order.');
                    cart = [];
                    updateCartCount();
                    closeCheckout();
                    checkoutForm.reset();
                } else {
                    alert('There was an error submitting your order. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your order. Please try again.');
            });
        });
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target == checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

// Add event listener to cart icon
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('.cart-icon');
    if (cartLink) {
        cartLink.addEventListener('click', openCart);
    }
});

// Handle contact form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const message = event.target.querySelector('textarea').value;
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('type', 'contact');
    
    fetch('https://formspree.io/f/myzywglw', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Message sent successfully! We will get back to you soon.');
            event.target.reset();
        } else {
            alert('There was an error sending your message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});
