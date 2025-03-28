// Main application logic for Costco Metals Tracker

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();
    
    // Set up event listeners
    setupEventListeners();
});

function initApp() {
    // Update last refresh time
    updateLastRefreshTime();
    
    // Generate current year for footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Load products data
    loadProducts();
    
    // Update product stats
    updateProductStats();
    
    // Simulate a recheck every 2 minutes (for demo purposes)
    setInterval(simulateRecheck, 120000);
}

function setupEventListeners() {
    // Add click handlers for filter buttons
    const filterButtons = document.querySelectorAll('.filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply the selected filter
            filterProducts(filter);
        });
    });
}

function loadProducts() {
    // Clear loading spinner
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    // Check if product data is available
    if (!productData || productData.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No product data available. Please try again later.</p>';
        return;
    }
    
    // Loop through products and create product cards
    productData.forEach(product => {
        // Create product card
        const productCard = createProductCard(product);
        
        // Add to product grid
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    // Create product card element
    const card = document.createElement('div');
    card.className = `product-card ${product.type}`;
    if (product.inStock) {
        card.classList.add('in-stock');
    } else {
        card.classList.add('out-of-stock');
    }
    
    // Set innerHTML using template
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
        </div>
        <div class="product-info">
            <div class="product-type">${product.type.toUpperCase()}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description.slice(0, 100)}...</p>
            <div class="product-meta">
                <div class="product-price">${product.price}</div>
                <div class="product-status ${product.inStock ? 'status-in-stock' : 'status-out-of-stock'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
        </div>
    `;
    
    // Add click event to visit Costco product page
    card.addEventListener('click', function() {
        window.open(product.url, '_blank');
    });
    
    return card;
}

function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        // First hide all products
        product.style.display = 'none';
        
        // Then show based on filter
        switch(filter) {
            case 'all':
                product.style.display = 'block';
                break;
            case 'silver':
                if (product.classList.contains('silver')) {
                    product.style.display = 'block';
                }
                break;
            case 'gold':
                if (product.classList.contains('gold')) {
                    product.style.display = 'block';
                }
                break;
            case 'instock':
                if (product.classList.contains('in-stock')) {
                    product.style.display = 'block';
                }
                break;
        }
    });
}

function updateProductStats() {
    // Find specific products and update stats
    const silverEagle = productData.find(p => p.id === "4000339858");
    const goldBar = productData.find(p => p.id === "4000186760");
    const mapleLeaf = productData.find(p => p.id === "4000252852");
    
    // Update Silver Eagle stats
    if (silverEagle) {
        document.getElementById('silverEagleLastSeen').textContent = silverEagle.lastSeen;
        document.getElementById('silverEagleAvgPrice').textContent = silverEagle.averagePrice;
        document.getElementById('silverEagleRestock').textContent = silverEagle.restockProbability;
    }
    
    // Update Gold Bar stats
    if (goldBar) {
        document.getElementById('goldBarLastSeen').textContent = goldBar.lastSeen;
        document.getElementById('goldBarAvgPrice').textContent = goldBar.averagePrice;
        document.getElementById('goldBarRestock').textContent = goldBar.restockProbability;
    }
    
    // Update Maple Leaf stats
    if (mapleLeaf) {
        document.getElementById('mapleLeafLastSeen').textContent = mapleLeaf.lastSeen;
        document.getElementById('mapleLeafAvgPrice').textContent = mapleLeaf.averagePrice;
        document.getElementById('mapleLeafRestock').textContent = mapleLeaf.restockProbability;
    }
}

function updateLastRefreshTime() {
    const now = new Date();
    const formattedTime = formatDateTime(now);
    
    // Update the last-updated displays
    document.getElementById('lastUpdatedTime').textContent = formattedTime;
    document.getElementById('footerLastUpdated').textContent = formattedTime;
    
    // Update status indicator message
    document.querySelector('#statusIndicator span').textContent = `Last checked ${formattedTime}`;
}

function formatDateTime(date) {
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
}

function simulateRecheck() {
    // This function simulates checking for inventory updates
    // In a real implementation, this would make API calls to check inventory
    
    // Show checking animation
    const statusIndicator = document.getElementById('statusIndicator');
    const pulseElement = statusIndicator.querySelector('.pulse');
    const textElement = statusIndicator.querySelector('span');
    
    // Change to "checking" state
    pulseElement.style.backgroundColor = '#ff9f0a';
    textElement.textContent = 'Checking inventory...';
    
    // Simulate network delay
    setTimeout(() => {
        // Randomly update one product's status for demonstration
        if (Math.random() > 0.9) { // 10% chance to find something in stock
            // Pick a random product
            const randomIndex = Math.floor(Math.random() * productData.length);
            const randomProduct = productData[randomIndex];
            
            // Set it as in-stock
            randomProduct.inStock = true;
            
            // Update UI
            loadProducts();
            
            // Set status to "found in stock"
            pulseElement.style.backgroundColor = '#28cd41';
            textElement.textContent = `${randomProduct.name} now in stock!`;
            
            // Show notification
            showNotification(`${randomProduct.name} is now in stock at Costco!`);
        } else {
            // No changes, set back to normal
            pulseElement.style.backgroundColor = '#28cd41';
            updateLastRefreshTime();
        }
    }, 1500);
}

function showNotification(message) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert(message);
        return;
    }
    
    // Check if permission is already granted
    if (Notification.permission === "granted") {
        new Notification("Costco Metals Tracker", {
            body: message,
            icon: "images/notification-icon.png"
        });
    } 
    // Otherwise, request permission from the user
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification("Costco Metals Tracker", {
                    body: message,
                    icon: "images/notification-icon.png"
                });
            }
        });
    }
}

// Function to get placeholder images when real images aren't available
function handleImageError(img) {
    img.src = 'images/placeholder.jpg';
}