

// Inicializar el swiper para categorías
var swiperCategories = new Swiper(".categories__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
  breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 4, spaceBetween: 40 },
      1400: { slidesPerView: 6, spaceBetween: 24 },
  },
});

// Manejo de pestañas de productos
const tabs = document.querySelectorAll('[data-target]'),
    tabsContents = document.querySelectorAll('[content]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);
      tabsContents.forEach((tabsContent) => {
          tabsContent.classList.remove('active-tab');
      });
      target.classList.add('active-tab');
      tabs.forEach((tab) => {
          tab.classList.remove('active-tab');
      });
      tab.classList.add('active-tab');
  });
});

// Añadir al archivo main.js existente
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(id, name, price) {
    const existingProduct = cart.find(item => item.id === id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showMiniCart();
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function showMiniCart() {
    const miniCart = document.getElementById('mini-cart');
    if (!miniCart) {
        const miniCartHTML = `
            <div id="mini-cart">
                <h4>Carrito de Compras</h4>
                <div id="cart-items"></div>
                <div id="cart-total"></div>
                <button onclick="window.location.href='/cart'" class="btn-cart">
                    Ver Carrito
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', miniCartHTML);
    }
    
    const miniCartElement = document.getElementById('mini-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    
    miniCartElement.style.display = 'block';
    setTimeout(() => {
        miniCartElement.style.display = 'none';
    }, 5000);
}

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Limpiar el contenido actual
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <span>${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.name}')">Eliminar</button>
        `;
        
        cartContainer.appendChild(productElement);
    });
    
    document.getElementById('total-price').textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(name) {
    const productIndex = cart.findIndex(item => item.name === name);

    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito desde el almacenamiento local
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.addEventListener('DOMContentLoaded', function() {
        displayCartItems();
    });

    // Función para mostrar los elementos del carrito
    function displayCartItems() {
        const cartItems = document.getElementById('cartItems');
        const cartTotalAmount = document.getElementById('total-price');
        cartItems.innerHTML = '';
        let total = 0;
    
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="btn-remove" onclick="removeFromCart('${item.id}')">Eliminar</button></td>
            `;
            cartItems.appendChild(row);
            total += item.price * item.quantity;
        });
    
        cartTotalAmount.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Función para añadir un producto al carrito
    function addToCart(productId, productName, productPrice) {
        const existingProductIndex = cart.findIndex(item => item.id === productId);
    
        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1
            });
        }
    
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }


    function removeFromCart(productId) {
        const productIndex = cart.findIndex(item => item.id === productId);
    
        if (productIndex > -1) {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            } else {
                cart.splice(productIndex, 1);
            }
        }
    
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
    // Añadir evento a los botones de "Añadir al carrito"
    document.querySelectorAll('.cart__btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');

            addToCart(productId, productName, productPrice);
        });
    });

    displayCartItems();
});

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="btn-remove" data-index="${index}">Eliminar</button></td>
        `;
        cartItems.appendChild(row);
        total += item.price * item.quantity;
    });

    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}