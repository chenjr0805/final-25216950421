// product.js - 商品详情页功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化购物车数量
    updateCartCount();
    
    // 从URL获取商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // 加载商品数据
    loadProductData(productId);
    
    // 初始化事件监听器
    initEventListeners();
    
    // 加载相关商品
    loadRelatedProducts(productId);
    
    // 检查用户登录状态
    checkLoginStatus();
});

// 更新购物车数量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count, #floating-cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// 加载商品数据
async function loadProductData(productId) {
    try {
        // 从本地存储或API获取商品数据
        const product = await fetchProductById(productId);
        
        if (!product) {
            showNotification('商品不存在', 'error');
            window.location.href = 'index.html';
            return;
        }
        
        // 更新页面内容
        updateProductPage(product);
        
        // 更新面包屑导航
        updateBreadcrumb(product);
        
    } catch (error) {
        console.error('加载商品数据失败:', error);
        showNotification('加载商品失败', 'error');
    }
}

// 模拟API获取商品数据
async function fetchProductById(productId) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟商品数据库
    const products = [
        {
            id: 1,
            name: '苹果iPhone 14 Pro Max 256GB 深空黑色',
            category: 'electronics',
            subCategory: '手机',
            price: 8999,
            originalPrice: 9999,
            description: `
                <h3>灵动岛，全新登场</h3>
                <p>iPhone 14 Pro Max 带来了突破性的创新体验。全新的灵动岛设计，将通知、提醒和实时活动整合在一处，让重要信息一目了然。</p>
                <img src="https://images.unsplash.com/photo-1675864663150-434b5dbe5f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" alt="iPhone 14 Pro Max">
                
                <h3>4800万像素主摄，Pro级影像系统</h3>
                <p>搭载4800万像素主摄，四合一像素传感器，照片细节惊人。第二代传感器位移式光学图像防抖功能，夜间模式优化，拍出更出色的照片。</p>
                
                <h3>A16仿生芯片，性能强劲</h3>
                <p>采用A16仿生芯片，6核中央处理器，5核图形处理器，性能提升明显。全天候显示功能，息屏也能查看时间和小部件。</p>
            `,
            images: [
                'https://images.unsplash.com/photo-1675864663150-434b5dbe5f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
                'https://images.unsplash.com/photo-1675864667660-5695d8c2a554?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1675864667660-5695d8c2a554?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                'https://images.unsplash.com/photo-1675864663150-434b5dbe5f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80'
            ],
            specifications: {
                '品牌': 'Apple',
                '型号': 'iPhone 14 Pro Max',
                '屏幕尺寸': '6.7英寸',
                '分辨率': '2796x1290像素',
                '处理器': 'A16仿生芯片',
                '内存': '6GB',
                '存储容量': '256GB',
                '后置摄像头': '4800万像素+1200万像素+1200万像素',
                '前置摄像头': '1200万像素',
                '电池容量': '4323mAh',
                '操作系统': 'iOS 16',
                '网络类型': '5G',
                'SIM卡类型': '双卡双待',
                '机身颜色': '深空黑色、银色、金色、暗紫色',
                '产品尺寸': '160.7×77.6×7.85mm',
                '产品重量': '240g'
            },
            colors: [
                { name: '深空黑色', value: '#1C1C1E', imageIndex: 0 },
                { name: '银色', value: '#F2F2F7', imageIndex: 1 },
                { name: '金色', value: '#F5E2C8', imageIndex: 2 },
                { name: '暗紫色', value: '#5856D6', imageIndex: 3 }
            ],
            storage: [
                { capacity: '128GB', price: 7999, stock: 50 },
                { capacity: '256GB', price: 8999, stock: 100 },
                { capacity: '512GB', price: 10999, stock: 30 },
                { capacity: '1TB', price: 12999, stock: 10 }
            ],
            currentColor: 0,
            currentStorage: 1,
            stock: 100,
            rating: 4.8,
            reviews: 1250,
            tags: ['新品', '热卖', '旗舰机']
        },
        // 可以添加更多商品
    ];
    
    return products.find(p => p.id === productId) || products[0];
}

// 更新商品页面
function updateProductPage(product) {
    // 更新商品标题
    document.getElementById('product-title').textContent = product.name;
    document.title = product.name + ' - 京享购物商城';
    
    // 更新价格信息
    const currentPrice = product.storage[product.currentStorage].price;
    document.getElementById('product-price').textContent = '¥' + currentPrice.toFixed(2);
    
    if (product.originalPrice) {
        document.getElementById('original-price').textContent = '价格：¥' + product.originalPrice.toFixed(2);
        const discount = Math.round((1 - currentPrice / product.originalPrice) * 100);
        document.getElementById('discount-info').textContent = '优惠' + discount + '%';
    }
    
    // 更新主图片
    updateProductImages(product);
    
    // 更新商品描述
    document.getElementById('product-description').innerHTML = product.description;
    
    // 更新规格参数表格
    updateSpecificationsTable(product.specifications);
    
    // 更新规格选项
    updateSpecOptions(product);
    
    // 更新库存信息
    document.getElementById('stock-count').textContent = product.stock > 0 ? '有货' : '缺货';
    document.getElementById('stock-count').className = product.stock > 10 ? 'stock-available' : 'stock-low';
    
    // 更新评价数量
    document.getElementById('review-count').textContent = `(${product.reviews})`;
    document.getElementById('average-rating').textContent = product.rating;
    
    // 更新收藏按钮状态
    updateFavoriteButton(product.id);
    
    // 保存当前商品数据到全局变量
    window.currentProduct = product;
}

// 更新商品图片
function updateProductImages(product) {
    const mainImage = document.getElementById('main-image');
    const thumbnailList = document.getElementById('thumbnail-list');
    
    // 清空缩略图列表
    thumbnailList.innerHTML = '';
    
    // 更新主图
    mainImage.src = product.images[product.currentColor || 0];
    mainImage.alt = product.name;
    
    // 添加缩略图
    product.images.forEach((image, index) => {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = `thumbnail-item ${index === (product.currentColor || 0) ? 'active' : ''}`;
        thumbnailItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${product.name} - 图片${index + 1}`;
        img.loading = 'lazy';
        
        thumbnailItem.appendChild(img);
        thumbnailList.appendChild(thumbnailItem);
        
        // 缩略图点击事件
        thumbnailItem.addEventListener('click', function() {
            // 更新主图
            mainImage.src = image;
            
            // 更新活动状态
            document.querySelectorAll('.thumbnail-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新当前颜色索引
            if (window.currentProduct) {
                window.currentProduct.currentColor = index;
            }
        });
    });
    
    // 图片放大镜效果
    initImageZoom(mainImage);
}

// 图片放大镜效果
function initImageZoom(mainImage) {
    const zoomContainer = document.getElementById('image-zoom');
    
    mainImage.addEventListener('mousemove', function(e) {
        if (!zoomContainer.style.backgroundImage) {
            zoomContainer.style.backgroundImage = `url('${this.src}')`;
        }
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / this.width) * 100;
        const yPercent = (y / this.height) * 100;
        
        zoomContainer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        zoomContainer.style.backgroundSize = '200%';
        
        // 显示放大镜
        zoomContainer.style.opacity = '1';
        
        // 定位放大镜
        zoomContainer.style.left = (x + 20) + 'px';
        zoomContainer.style.top = (y + 20) + 'px';
    });
    
    mainImage.addEventListener('mouseleave', function() {
        zoomContainer.style.opacity = '0';
    });
}

// 更新规格参数表格
function updateSpecificationsTable(specs) {
    const specTable = document.getElementById('spec-table');
    specTable.innerHTML = '';
    
    Object.entries(specs).forEach(([key, value]) => {
        const row = document.createElement('tr');
        
        const th = document.createElement('th');
        th.textContent = key;
        
        const td = document.createElement('td');
        td.textContent = value;
        
        row.appendChild(th);
        row.appendChild(td);
        specTable.appendChild(row);
    });
}

// 更新规格选项
function updateSpecOptions(product) {
    // 颜色选择
    const colorSpec = document.getElementById('color-spec');
    const colorOptions = colorSpec.querySelector('.spec-options');
    colorOptions.innerHTML = '';
    
    product.colors.forEach((color, index) => {
        const option = document.createElement('div');
        option.className = `spec-option ${index === product.currentColor ? 'active' : ''}`;
        option.dataset.index = index;
        option.dataset.type = 'color';
        
        // 创建颜色方块
        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = color.value;
        colorBox.style.borderRadius = '4px';
        colorBox.style.marginRight = '8px';
        colorBox.style.border = '1px solid var(--border-color)';
        
        option.appendChild(colorBox);
        option.appendChild(document.createTextNode(color.name));
        colorOptions.appendChild(option);
    });
    
    // 存储容量选择
    const storageSpec = document.getElementById('storage-spec');
    const storageOptions = storageSpec.querySelector('.spec-options');
    storageOptions.innerHTML = '';
    
    product.storage.forEach((item, index) => {
        const option = document.createElement('div');
        option.className = `spec-option ${index === product.currentStorage ? 'active' : ''} ${item.stock === 0 ? 'disabled' : ''}`;
        option.dataset.index = index;
        option.dataset.type = 'storage';
        
        option.textContent = item.capacity;
        if (item.stock === 0) {
            option.title = '缺货';
        }
        
        storageOptions.appendChild(option);
    });
}

// 初始化事件监听器
function initEventListeners() {
    // 数量控制
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.getElementById('quantity-minus');
    const plusBtn = document.getElementById('quantity-plus');
    
    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 99) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 1;
        if (value < 1) value = 1;
        if (value > 99) value = 99;
        this.value = value;
    });
    
    // 规格选择事件委托
    document.querySelector('.product-specs').addEventListener('click', function(e) {
        const option = e.target.closest('.spec-option');
        if (!option || option.classList.contains('disabled')) return;
        
        const type = option.dataset.type;
        const index = parseInt(option.dataset.index);
        
        if (type === 'color') {
            // 更新颜色选择
            document.querySelectorAll('.spec-option[data-type="color"]').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            // 更新商品图片
            if (window.currentProduct) {
                window.currentProduct.currentColor = index;
                updateProductImages(window.currentProduct);
            }
        } else if (type === 'storage') {
            // 更新存储选择
            document.querySelectorAll('.spec-option[data-type="storage"]').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            // 更新价格
            if (window.currentProduct) {
                window.currentProduct.currentStorage = index;
                const currentPrice = window.currentProduct.storage[index].price;
                document.getElementById('product-price').textContent = '¥' + currentPrice.toFixed(2);
            }
        }
    });
    
    // 标签页切换
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // 更新标签状态
            document.querySelectorAll('.tab-header').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // 显示对应内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
    
    // 加入购物车按钮
    document.getElementById('add-to-cart-btn').addEventListener('click', addToCartFromDetail);
    
    // 立即购买按钮
    document.getElementById('buy-now-btn').addEventListener('click', buyNow);
    
    // 收藏按钮
    document.getElementById('favorite-btn').addEventListener('click', toggleFavoriteFromDetail);
    
    // 加载更多评价
    document.getElementById('load-more-reviews').addEventListener('click', loadMoreReviews);
    
    // 提交咨询
    document.getElementById('submit-question').addEventListener('click', submitQuestion);
}

// 从详情页加入购物车
function addToCartFromDetail() {
    if (!window.currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
    const colorIndex = window.currentProduct.currentColor || 0;
    const storageIndex = window.currentProduct.currentStorage || 0;
    
    const cartItem = {
        id: window.currentProduct.id,
        name: window.currentProduct.name,
        price: window.currentProduct.storage[storageIndex].price,
        image: window.currentProduct.images[colorIndex],
        quantity: quantity,
        color: window.currentProduct.colors[colorIndex].name,
        storage: window.currentProduct.storage[storageIndex].capacity,
        addedAt: new Date().toISOString()
    };
    
    // 保存到购物车
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查是否已存在相同规格的商品
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.color === cartItem.color && 
        item.storage === cartItem.storage
    );
    
    if (existingIndex > -1) {
        // 更新数量
        cart[existingIndex].quantity += quantity;
    } else {
        // 添加新商品
        cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车数量
    updateCartCount();
    
    // 显示成功消息
    showNotification('商品已成功加入购物车！', 'success');
    
    // 添加动画效果
    const button = document.getElementById('add-to-cart-btn');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> 已添加';
    button.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = '';
    }, 1500);
}

// 立即购买
function buyNow() {
    if (!window.currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
    const colorIndex = window.currentProduct.currentColor || 0;
    const storageIndex = window.currentProduct.currentStorage || 0;
    
    // 创建临时订单
    const orderItem = {
        id: window.currentProduct.id,
        name: window.currentProduct.name,
        price: window.currentProduct.storage[storageIndex].price,
        image: window.currentProduct.images[colorIndex],
        quantity: quantity,
        color: window.currentProduct.colors[colorIndex].name,
        storage: window.currentProduct.storage[storageIndex].capacity
    };
    
    // 保存为立即购买的商品
    sessionStorage.setItem('buyNowItem', JSON.stringify(orderItem));
    
    // 跳转到结算页面
    window.location.href = 'checkout.html?type=buynow';
}

// 更新收藏按钮状态
function updateFavoriteButton(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(productId);
    const favoriteBtn = document.getElementById('favorite-btn');
    
    if (isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
    }
}

// 切换收藏状态
function toggleFavoriteFromDetail() {
    if (!window.currentProduct) return;
    
    const productId = window.currentProduct.id;
    const favoriteBtn = document.getElementById('favorite-btn');
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(productId)) {
        // 取消收藏
        favorites = favorites.filter(id => id !== productId);
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
        showNotification('已取消收藏', 'info');
    } else {
        // 添加收藏
        favorites.push(productId);
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        showNotification('已添加到收藏', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 更新面包屑导航
function updateBreadcrumb(product) {
    const categoryLink = document.getElementById('category-link');
    const productName = document.getElementById('product-name');
    
    categoryLink.textContent = getCategoryName(product.category);
    categoryLink.href = `index.html?category=${product.category}`;
    productName.textContent = product.name;
}

// 获取分类名称
function getCategoryName(categoryId) {
    const categoryMap = {
        'electronics': '电子产品',
        'clothing': '服装鞋包',
        'home': '家居生活',
        'books': '图书音像',
        'food': '食品生鲜'
    };
    
    return categoryMap[categoryId] || '商品分类';
}

// 加载相关商品
async function loadRelatedProducts(currentProductId) {
    try {
        const relatedProducts = await fetchRelatedProducts(currentProductId);
        const container = document.getElementById('related-products');
        container.innerHTML = '';
        
        relatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('加载相关商品失败:', error);
    }
}

// 模拟获取相关商品
async function fetchRelatedProducts(currentProductId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 模拟相关商品数据
    return [
        {
            id: 2,
            name: '小米13 Ultra 12GB+256GB',
            price: 5999,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1772&q=80',
            rating: 4.7
        },
        {
            id: 3,
            name: '联想拯救者Y9000P 游戏本',
            price: 10999,
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1768&q=80',
            rating: 4.9
        },
        {
            id: 8,
            name: '无线蓝牙降噪耳机',
            price: 799,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
            rating: 4.6
        },
        {
            id: 6,
            name: '北欧简约实木餐桌椅',
            price: 2499,
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
            rating: 4.8
        },
        {
            id: 4,
            name: '男士商务休闲西装',
            price: 499,
            image: 'https://images.unsplash.com/photo-1594938374182-2511f37b2e98?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
            rating: 4.5
        }
    ];
}

// 加载更多评价
function loadMoreReviews() {
    // 模拟加载更多评价
    const reviewList = document.getElementById('review-list');
    
    for (let i = 0; i < 3; i++) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-user">用户${Math.floor(Math.random() * 10000)}</span>
                <div class="review-rating">
                    ${'★'.repeat(5)}
                </div>
                <span class="review-time">2023-10-${10 + i}</span>
            </div>
            <div class="review-content">
                商品质量很好，物流速度快，客服态度也很好，非常满意的一次购物体验！
            </div>
        `;
        reviewList.appendChild(reviewItem);
    }
}

// 提交咨询
function submitQuestion() {
    const questionInput = document.getElementById('question-input');
    const question = questionInput.value.trim();
    
    if (!question) {
        showNotification('请输入问题内容', 'warning');
        return;
    }
    
    if (question.length < 5) {
        showNotification('问题内容太短', 'warning');
        return;
    }
    
    // 模拟提交
    showNotification('问题提交成功，客服将在24小时内回复', 'success');
    questionInput.value = '';
}

// 检查登录状态
function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
        loginLink.textContent = `欢迎，${userData.username}`;
        loginLink.href = 'user-center.html';
    }
}

// 创建商品卡片（复用）
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">¥${product.price.toFixed(2)}</span>
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> 加入购物车
                </button>
            </div>
        </div>
    `;
    
    // 点击事件
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.product-actions')) {
            window.location.href = `product.html?id=${product.id}`;
        }
    });
    
    // 加入购物车按钮事件
    const addCartBtn = card.querySelector('.btn-add-cart');
    addCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 添加到购物车逻辑
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('商品已加入购物车', 'success');
    });
    
    return card;
}

// 生成星级评分
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#52c41a';
        case 'error': return '#ff4d4f';
        case 'warning': return '#faad14';
        default: return '#1890ff';
    }
}