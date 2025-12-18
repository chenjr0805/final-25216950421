// cart.js - 购物车页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化购物车
    initCart();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 检查用户登录状态
    checkLoginStatus();
    
    // 加载推荐商品
    loadRecommendations();
});

// 初始化购物车
function initCart() {
    // 更新购物车数量
    updateCartCount();
    
    // 加载购物车商品
    loadCartItems();
    
    // 计算总计
    calculateTotal();
}

// 更新购物车数量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count, #floating-cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// 加载购物车商品
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 更新统计信息
    document.getElementById('total-items').textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cart.length === 0) {
        // 显示购物车为空的状态
        document.getElementById('cart-empty').style.display = 'block';
        document.getElementById('cart-content').style.display = 'none';
        return;
    }
    
    // 显示购物车内容
    document.getElementById('cart-empty').style.display = 'none';
    document.getElementById('cart-content').style.display = 'block';
    
    // 清空现有商品列表
    const cartItemsList = document.querySelector('.cart-items-list');
    cartItemsList.innerHTML = '';
    
    // 按商品ID分组，相同商品不同规格分开显示
    const groupedItems = groupCartItems(cart);
    
    // 渲染购物车商品
    Object.keys(groupedItems).forEach(key => {
        const item = groupedItems[key];
        const cartItem = createCartItem(item);
        cartItemsList.appendChild(cartItem);
    });
    
    // 更新选中商品信息
    updateSelectedItemsInfo();
}

// 按商品ID和规格分组购物车商品
function groupCartItems(cart) {
    const grouped = {};
    
    cart.forEach(item => {
        const key = `${item.id}-${item.color || ''}-${item.storage || ''}`;
        
        if (!grouped[key]) {
            grouped[key] = {
                ...item,
                selected: false
            };
        } else {
            grouped[key].quantity += item.quantity;
        }
    });
    
    return grouped;
}

// 创建购物车商品项
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;
    div.dataset.key = `${item.id}-${item.color || ''}-${item.storage || ''}`;
    
    div.innerHTML = `
        <div class="cart-item-select">
            <label class="checkbox">
                <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''}>
            </label>
        </div>
        
        <div class="cart-item-info">
            <div class="cart-item-image">
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </a>
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">
                    <a href="product.html?id=${item.id}">${item.name}</a>
                </h3>
                
                <div class="cart-item-specs">
                    ${item.color ? `<div class="cart-item-spec"><span>颜色:</span>${item.color}</div>` : ''}
                    ${item.storage ? `<div class="cart-item-spec"><span>规格:</span>${item.storage}</div>` : ''}
                </div>
                
                <div class="cart-item-availability">
                    <span class="availability-text">有货</span>
                </div>
            </div>
        </div>
        
        <div class="cart-item-actions">
            <div class="cart-item-price">
                <div class="current-price">¥${item.price.toFixed(2)}</div>
                <div class="original-price">¥${(item.price * 1.2).toFixed(2)}</div>
            </div>
            
            <div class="quantity-control-cart">
                <button class="quantity-btn-cart minus" type="button">-</button>
                <input type="number" class="quantity-input-cart" value="${item.quantity}" min="1" max="99" readonly>
                <button class="quantity-btn-cart plus" type="button">+</button>
            </div>
            
            <div class="cart-item-buttons">
                <button class="btn-delete" type="button">
                    <i class="fas fa-trash-alt"></i> 删除
                </button>
                <button class="btn-favorite-cart" type="button">
                    <i class="far fa-heart"></i> 收藏
                </button>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    const checkbox = div.querySelector('.item-checkbox');
    const minusBtn = div.querySelector('.minus');
    const plusBtn = div.querySelector('.plus');
    const quantityInput = div.querySelector('.quantity-input-cart');
    const deleteBtn = div.querySelector('.btn-delete');
    const favoriteBtn = div.querySelector('.btn-favorite-cart');
    
    // 选择商品
    checkbox.addEventListener('change', function() {
        item.selected = this.checked;
        div.classList.toggle('selected', this.checked);
        updateSelectedItemsInfo();
        calculateTotal();
        updateCheckoutButton();
    });
    
    // 减少数量
    minusBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateCartItemQuantity(item, quantity);
        }
    });
    
    // 增加数量
    plusBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity < 99) {
            quantity++;
            quantityInput.value = quantity;
            updateCartItemQuantity(item, quantity);
        }
    });
    
    // 数量输入框变化
    quantityInput.addEventListener('change', function() {
        let quantity = parseInt(this.value) || 1;
        if (quantity < 1) quantity = 1;
        if (quantity > 99) quantity = 99;
        this.value = quantity;
        updateCartItemQuantity(item, quantity);
    });
    
    // 删除商品
    deleteBtn.addEventListener('click', function() {
        if (confirm('确定要删除这个商品吗？')) {
            removeCartItem(item);
        }
    });
    
    // 收藏商品
    favoriteBtn.addEventListener('click', function() {
        toggleFavorite(item);
    });
    
    // 检查是否已收藏
    checkFavoriteStatus(item.id, favoriteBtn);
    
    return div;
}

// 更新购物车商品数量
function updateCartItemQuantity(item, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 找到所有相同规格的商品
    const itemIndices = cart.reduce((indices, cartItem, index) => {
        if (cartItem.id === item.id && 
            cartItem.color === item.color && 
            cartItem.storage === item.storage) {
            indices.push(index);
        }
        return indices;
    }, []);
    
    if (itemIndices.length > 0) {
        // 更新第一个找到的商品数量，删除其他的
        cart[itemIndices[0]].quantity = newQuantity;
        
        // 删除重复项
        for (let i = itemIndices.length - 1; i > 0; i--) {
            cart.splice(itemIndices[i], 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 更新显示
        updateCartCount();
        calculateTotal();
        
        // 显示成功消息
        showNotification('商品数量已更新', 'success');
    }
}

// 移除购物车商品
function removeCartItem(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 移除所有相同规格的商品
    cart = cart.filter(cartItem => 
        !(cartItem.id === item.id && 
          cartItem.color === item.color && 
          cartItem.storage === item.storage)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 重新加载购物车
    loadCartItems();
    updateCartCount();
    
    // 显示成功消息
    showNotification('商品已从购物车移除', 'success');
}

// 切换收藏状态
function toggleFavorite(item) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteBtn = document.querySelector(`.cart-item[data-key="${item.id}-${item.color || ''}-${item.storage || ''}"] .btn-favorite-cart`);
    
    if (favorites.includes(item.id)) {
        // 取消收藏
        const index = favorites.indexOf(item.id);
        favorites.splice(index, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
        favoriteBtn.classList.remove('active');
        showNotification('已取消收藏', 'info');
    } else {
        // 添加收藏
        favorites.push(item.id);
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        favoriteBtn.classList.add('active');
        showNotification('已添加到收藏', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 检查收藏状态
function checkFavoriteStatus(productId, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(productId)) {
        button.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        button.classList.add('active');
    }
}

// 更新选中商品信息
function updateSelectedItemsInfo() {
    const selectedItems = document.querySelectorAll('.item-checkbox:checked');
    const selectedCount = selectedItems.length;
    
    const selectedItemsInfo = document.getElementById('selected-items-info');
    const selectedCountSpan = document.getElementById('selected-count');
    
    if (selectedCount > 0) {
        selectedItemsInfo.style.display = 'inline';
        selectedCountSpan.textContent = selectedCount;
    } else {
        selectedItemsInfo.style.display = 'none';
    }
}

// 计算总计
function calculateTotal() {
    const selectedItems = document.querySelectorAll('.cart-item.selected');
    
    let subtotal = 0;
    let totalSaving = 0;
    
    selectedItems.forEach(item => {
        const price = parseFloat(item.querySelector('.current-price').textContent.replace('¥', ''));
        const originalPrice = parseFloat(item.querySelector('.original-price').textContent.replace('¥', ''));
        const quantity = parseInt(item.querySelector('.quantity-input-cart').value);
        
        subtotal += price * quantity;
        totalSaving += (originalPrice - price) * quantity;
    });
    
    // 计算运费（满99包邮）
    let shippingFee = subtotal >= 99 ? 0 : 10;
    
    // 获取优惠券折扣
    const couponDiscount = parseFloat(localStorage.getItem('couponDiscount') || 0);
    
    // 计算总额
    const totalAmount = subtotal + shippingFee - couponDiscount;
    
    // 更新显示
    document.getElementById('subtotal').textContent = `¥${subtotal.toFixed(2)}`;
    document.getElementById('shipping-fee').textContent = `¥${shippingFee.toFixed(2)}`;
    document.getElementById('coupon-discount').textContent = `-¥${couponDiscount.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `¥${totalAmount.toFixed(2)}`;
    document.getElementById('total-saving').textContent = `¥${totalSaving.toFixed(2)}`;
}

// 更新结算按钮状态
function updateCheckoutButton() {
    const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutCount = document.getElementById('checkout-count');
    
    checkoutCount.textContent = selectedCount;
    
    if (selectedCount > 0) {
        checkoutBtn.disabled = false;
    } else {
        checkoutBtn.disabled = true;
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 全选/全不选
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.addEventListener('change', function() {
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        const storeCheckbox = document.querySelector('.store-checkbox');
        
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        if (storeCheckbox) {
            storeCheckbox.checked = this.checked;
        }
    });
    
    // 店铺全选
    const storeCheckbox = document.querySelector('.store-checkbox');
    if (storeCheckbox) {
        storeCheckbox.addEventListener('change', function() {
            const itemCheckboxes = document.querySelectorAll('.item-checkbox');
            const selectAllCheckbox = document.getElementById('select-all');
            
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
            
            selectAllCheckbox.checked = this.checked;
        });
    }
    
    // 折叠/展开店铺
    const collapseBtn = document.querySelector('.btn-collapse');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', function() {
            this.classList.toggle('collapsed');
            const itemsList = document.querySelector('.cart-items-list');
            itemsList.style.display = this.classList.contains('collapsed') ? 'none' : 'block';
        });
    }
    
    // 批量删除
    const batchDeleteBtn = document.getElementById('batch-delete');
    batchDeleteBtn.addEventListener('click', function() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            showNotification('请先选择要删除的商品', 'warning');
            return;
        }
        
        if (confirm(`确定要删除选中的${selectedItems.length}件商品吗？`)) {
            selectedItems.forEach(checkbox => {
                const cartItem = checkbox.closest('.cart-item');
                const itemKey = cartItem.dataset.key;
                const [id, color, storage] = itemKey.split('-');
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => 
                    !(item.id.toString() === id && 
                      (item.color || '') === color && 
                      (item.storage || '') === storage)
                );
                
                localStorage.setItem('cart', JSON.stringify(cart));
            });
            
            // 重新加载购物车
            loadCartItems();
            updateCartCount();
            showNotification(`已删除${selectedItems.length}件商品`, 'success');
        }
    });
    
    // 清空购物车
    const clearCartBtn = document.getElementById('clear-cart');
    clearCartBtn.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            showNotification('购物车已经是空的', 'info');
            return;
        }
        
        if (confirm('确定要清空整个购物车吗？')) {
            localStorage.removeItem('cart');
            loadCartItems();
            updateCartCount();
            showNotification('购物车已清空', 'success');
        }
    });
    
    // 移到收藏夹
    const moveToFavoritesBtn = document.getElementById('move-to-favorites');
    moveToFavoritesBtn.addEventListener('click', function() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            showNotification('请先选择要收藏的商品', 'warning');
            return;
        }
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let addedCount = 0;
        
        selectedItems.forEach(checkbox => {
            const cartItem = checkbox.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.id);
            
            if (!favorites.includes(itemId)) {
                favorites.push(itemId);
                addedCount++;
                
                // 更新按钮状态
                const favoriteBtn = cartItem.querySelector('.btn-favorite-cart');
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
                favoriteBtn.classList.add('active');
            }
        });
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // 从购物车中移除
        selectedItems.forEach(checkbox => {
            const cartItem = checkbox.closest('.cart-item');
            const itemKey = cartItem.dataset.key;
            const [id, color, storage] = itemKey.split('-');
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => 
                !(item.id.toString() === id && 
                  (item.color || '') === color && 
                  (item.storage || '') === storage)
            );
            
            localStorage.setItem('cart', JSON.stringify(cart));
        });
        
        // 重新加载购物车
        loadCartItems();
        updateCartCount();
        
        if (addedCount > 0) {
            showNotification(`已将${addedCount}件商品添加到收藏夹`, 'success');
        } else {
            showNotification('选中的商品已经在收藏夹中了', 'info');
        }
    });
    
    // 继续购物
    const continueShoppingBtn = document.querySelector('.btn-continue-shopping');
    continueShoppingBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 去结算
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            showNotification('请先选择要结算的商品', 'warning');
            return;
        }
        
        // 收集选中的商品
        const checkoutItems = [];
        selectedItems.forEach(checkbox => {
            const cartItem = checkbox.closest('.cart-item');
            const itemKey = cartItem.dataset.key;
            const [id, color, storage] = itemKey.split('-');
            
            const item = {
                id: parseInt(id),
                name: cartItem.querySelector('.cart-item-title a').textContent,
                price: parseFloat(cartItem.querySelector('.current-price').textContent.replace('¥', '')),
                image: cartItem.querySelector('.cart-item-image img').src,
                quantity: parseInt(cartItem.querySelector('.quantity-input-cart').value),
                color: color || null,
                storage: storage || null
            };
            
            checkoutItems.push(item);
        });
        
        // 保存到临时存储
        sessionStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
        
        // 跳转到结算页面
        window.location.href = 'checkout.html';
    });
    
    // 选择优惠券
    const chooseCouponBtn = document.getElementById('choose-coupon');
    chooseCouponBtn.addEventListener('click', function() {
        openCouponModal();
    });
    
    // 优惠券搜索
    const cartSearchInput = document.getElementById('cart-search-input');
    const cartSearchBtn = document.getElementById('cart-search-btn');
    
    cartSearchBtn.addEventListener('click', function() {
        searchCartItems(cartSearchInput.value);
    });
    
    cartSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCartItems(this.value);
        }
    });
}

// 搜索购物车商品
function searchCartItems(keyword) {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (!keyword.trim()) {
        // 显示所有商品
        cartItems.forEach(item => {
            item.style.display = 'grid';
        });
        return;
    }
    
    let foundCount = 0;
    
    cartItems.forEach(item => {
        const itemName = item.querySelector('.cart-item-title a').textContent.toLowerCase();
        const searchTerm = keyword.toLowerCase();
        
        if (itemName.includes(searchTerm)) {
            item.style.display = 'grid';
            foundCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (foundCount === 0) {
        showNotification(`未找到包含"${keyword}"的商品`, 'info');
    }
}

// 打开优惠券模态框
function openCouponModal() {
    const couponModal = document.getElementById('coupon-modal');
    couponModal.classList.add('active');
    
    // 初始化优惠券标签页
    initCouponTabs();
    
    // 初始化优惠券使用按钮
    initCouponUseButtons();
}

// 初始化优惠券标签页
function initCouponTabs() {
    const couponTabs = document.querySelectorAll('.coupon-tab');
    
    couponTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // 更新标签页状态
            couponTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应列表
            document.getElementById('available-coupons').style.display = type === 'available' ? 'block' : 'none';
            document.getElementById('unavailable-coupons').style.display = type === 'unavailable' ? 'block' : 'none';
        });
    });
}

// 初始化优惠券使用按钮
function initCouponUseButtons() {
    const useCouponBtns = document.querySelectorAll('.btn-use-coupon');
    
    useCouponBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const discountAmount = parseFloat(this.dataset.amount);
            
            // 计算当前总金额，判断是否满足使用条件
            const selectedItems = document.querySelectorAll('.item-checkbox:checked');
            let subtotal = 0;
            
            selectedItems.forEach(item => {
                const price = parseFloat(item.closest('.cart-item').querySelector('.current-price').textContent.replace('¥', ''));
                const quantity = parseInt(item.closest('.cart-item').querySelector('.quantity-input-cart').value);
                subtotal += price * quantity;
            });
            
            // 检查是否满足最低消费（假设满100才能使用）
            if (subtotal < 100) {
                showNotification('订单金额需满100元才能使用此优惠券', 'warning');
                return;
            }
            
            // 保存优惠券折扣
            localStorage.setItem('couponDiscount', discountAmount);
            
            // 关闭模态框
            document.getElementById('coupon-modal').classList.remove('active');
            
            // 重新计算总计
            calculateTotal();
            
            // 显示成功消息
            showNotification(`已成功使用优惠券，立减¥${discountAmount}`, 'success');
        });
    });
}

// 加载推荐商品
function loadRecommendations() {
    // 模拟推荐商品数据
    const recommendations = [
        {
            id: 7,
            name: '智能空气净化器家用',
            price: 1299,
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
        },
        {
            id: 5,
            name: '女士春季连衣裙新款',
            price: 299,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80'
        },
        {
            id: 8,
            name: '无线蓝牙降噪耳机',
            price: 799,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
        }
    ];
    
    const recommendationList = document.getElementById('recommendation-list');
    recommendationList.innerHTML = '';
    
    recommendations.forEach(product => {
        const recommendationItem = createRecommendationItem(product);
        recommendationList.appendChild(recommendationItem);
    });
}

// 创建推荐商品项
function createRecommendationItem(product) {
    const a = document.createElement('a');
    a.className = 'recommendation-item';
    a.href = `product.html?id=${product.id}`;
    
    a.innerHTML = `
        <div class="recommendation-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="recommendation-info">
            <div class="recommendation-title">${product.name}</div>
            <div class="recommendation-price">¥${product.price.toFixed(2)}</div>
        </div>
    `;
    
    return a;
}

// 检查用户登录状态
function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userData = JSON.parse(localStorage.getItem('user')) || 
                    JSON.parse(sessionStorage.getItem('user'));
    
    if (userData) {
        loginLink.textContent = `欢迎，${userData.username}`;
        loginLink.href = 'user-center.html';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加动画关键帧
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// 获取通知颜色
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#52c41a';
        case 'error': return '#ff4d4f';
        case 'warning': return '#faad14';
        default: return '#1890ff';
    }
}

// 监听购物车变化（用于其他页面的更新）
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        updateCartCount();
        loadCartItems();
    }
});

// 页面卸载前保存购物车状态
window.addEventListener('beforeunload', function() {
    // 保存当前的选择状态
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const selections = {};
    
    checkboxes.forEach(checkbox => {
        const cartItem = checkbox.closest('.cart-item');
        if (cartItem && cartItem.dataset.key) {
            selections[cartItem.dataset.key] = checkbox.checked;
        }
    });
    
    localStorage.setItem('cartSelections', JSON.stringify(selections));
});

// 页面加载时恢复选择状态
window.addEventListener('load', function() {
    const selections = JSON.parse(localStorage.getItem('cartSelections')) || {};
    
    Object.keys(selections).forEach(key => {
        const checkbox = document.querySelector(`.cart-item[data-key="${key}"] .item-checkbox`);
        if (checkbox) {
            checkbox.checked = selections[key];
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});

// 导出功能（用于其他页面调用）
window.cartUtils = {
    addToCart: function(productId, productName, price, image, quantity = 1, color = null, storage = null) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 检查是否已存在相同规格的商品
        const existingIndex = cart.findIndex(item => 
            item.id === productId && 
            item.color === color && 
            item.storage === storage
        );
        
        if (existingIndex > -1) {
            // 更新数量
            cart[existingIndex].quantity += quantity;
        } else {
            // 添加新商品
            cart.push({
                id: productId,
                name: productName,
                price: price,
                image: image,
                quantity: quantity,
                color: color,
                storage: storage,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 触发storage事件，通知其他页面
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cart',
            newValue: JSON.stringify(cart)
        }));
        
        return true;
    },
    
    getCartCount: function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    clearCart: function() {
        localStorage.removeItem('cart');
        
        // 触发storage事件
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cart',
            newValue: null
        }));
        
        return true;
    },
    
    getCartItems: function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
};