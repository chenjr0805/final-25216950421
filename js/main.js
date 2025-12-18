// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化购物车数量
    updateCartCount();
    
    // 轮播图功能
    initSlider();
    
    // 商品加载
    loadProducts();
    
    // 搜索功能
    initSearch();
    
    // 分类标签切换
    initCategoryTabs();
    
    // 加载更多按钮
    initLoadMore();
    
    // 用户登录状态检查
    checkLoginStatus();
    
    // 主题切换初始化
    initThemeSwitcher();
});

// 更新购物车数量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // 更新页面上的购物车数量
    const cartCountElements = document.querySelectorAll('#cart-count, #floating-cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// 轮播图功能
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        // 更新幻灯片位置
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        // 更新指示点
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // 更新当前幻灯片索引
        currentSlide = index;
    }
    
    // 自动播放
    let slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // 鼠标悬停时暂停自动播放
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    });
    
    // 上一张按钮
    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(currentSlide - 1);
    });
    
    // 下一张按钮
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(currentSlide + 1);
    });
    
    // 指示点点击
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
        });
    });
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        
        if (touchStartX - touchEndX > 50) {
            // 向左滑动，下一张
            showSlide(currentSlide + 1);
        } else if (touchEndX - touchStartX > 50) {
            // 向右滑动，上一张
            showSlide(currentSlide - 1);
        }
    });
}

// 商品数据加载
async function loadProducts(category = 'all', page = 1) {
    try {
        // 模拟API调用
        const products = await fetchProducts(category, page);
        const productsGrid = document.getElementById('products-grid');
        
        // 清空现有商品（如果是第一页）
        if (page === 1) {
            productsGrid.innerHTML = '';
        }
        
        // 生成商品卡片
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // 更新购物车按钮事件
        updateAddToCartButtons();
        
        // 更新收藏按钮事件
        updateFavoriteButtons();
        
    } catch (error) {
        console.error('加载商品失败:', error);
        showNotification('加载商品失败，请刷新重试', 'error');
    }
}

// 模拟API获取商品数据
async function fetchProducts(category, page) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟商品数据
    const allProducts = [
        {
            id: 1,
            name: '苹果iPhone 14 Pro Max 256GB',
            price: 8999,
            originalPrice: 9999,
            image: 'images/14promax.jpg',
            category: 'electronics',
            rating: 4.8,
            reviews: 1250,
            badge: '热卖'
        },
        {
            id: 2,
            name: '小米17 Pro 黑色 徕卡影像',
            price: 5999,
            originalPrice: 6499,
            image: 'images/小米17pro.jpg',
            category: 'electronics',
            rating: 4.7,
            reviews: 980,
            badge: '新品'
        },
        {
            id: 3,
            name: '联想拯救者Y9000P',
            price: 10999,
            originalPrice: 11999,
            image: 'images/拯救者.jpg',
            category: 'electronics',
            rating: 4.9,
            reviews: 760,
            badge: '推荐'
        },
        {
            id: 4,
            name: '男士商务休闲西装外套',
            price: 499,
            originalPrice: 699,
            image: 'images/西装.jpg',
            category: 'clothing',
            rating: 4.5,
            reviews: 320,
            badge: '促销'
        },
        {
            id: 5,
            name: '女士春季连衣裙',
            price: 299,
            originalPrice: 399,
            image: 'images/连衣裙.jpg',
            category: 'clothing',
            rating: 4.6,
            reviews: 450,
            badge: '热卖'
        },
        {
            id: 6,
            name: '北欧简约实木餐桌椅',
            price: 2499,
            originalPrice: 2999,
            image: 'images/北欧实木家具.jpg',
            category: 'home',
            rating: 4.8,
            reviews: 210,
            badge: '推荐'
        },
        {
            id: 7,
            name: '智能空气净化器',
            price: 1299,
            originalPrice: 1599,
            image: 'images/空气净化器.jpg',
            category: 'home',
            rating: 4.7,
            reviews: 380,
            badge: '新品'
        },
        {
            id: 8,
            name: '无线蓝牙降噪耳机',
            price: 199,
            originalPrice: 999,
            image: 'images/蓝牙耳机.jpg',
            category: 'electronics',
            rating: 4.6,
            reviews: 890,
            badge: '促销'
        }
    ];
    
    // 根据分类筛选
    let filteredProducts = allProducts;
    if (category !== 'all') {
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    
    // 模拟分页（每页8个商品）
    const startIndex = (page - 1) * 8;
    const endIndex = startIndex + 8;
    
    return filteredProducts.slice(startIndex, endIndex);
}

// 创建商品卡片
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    // 检查是否已收藏
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(product.id);
    
    card.innerHTML = `
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">¥${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span>${product.rating} (${product.reviews}评价)</span>
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> 加入购物车
                </button>
                <button class="btn-favorite ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
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

// 更新加入购物车按钮事件
function updateAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
            
            // 添加动画效果
            this.innerHTML = '<i class="fas fa-check"></i> 已添加';
            this.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> 加入购物车';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // 点击商品卡片跳转到详情页
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果不是点击按钮，则跳转到详情页
            if (!e.target.closest('.product-actions')) {
                const productId = this.dataset.id;
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });
}

// 添加到购物车
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 查找商品是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // 如果已存在，增加数量
        existingItem.quantity += 1;
    } else {
        // 如果不存在，添加新商品
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 显示通知
    showNotification('商品已成功加入购物车！', 'success');
}

// 更新收藏按钮事件
function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            toggleFavorite(productId, this);
        });
    });
}

// 切换收藏状态
function toggleFavorite(productId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(productId)) {
        // 如果已收藏，取消收藏
        favorites = favorites.filter(id => id !== productId);
        button.classList.remove('active');
        showNotification('已取消收藏', 'info');
    } else {
        // 如果未收藏，添加到收藏
        favorites.push(productId);
        button.classList.add('active');
        showNotification('已添加到收藏', 'success');
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    // 热门搜索词
    const hotKeywords = [
        'iPhone 14',
        '笔记本电脑',
        '运动鞋',
        '连衣裙',
        '电视机',
        '冰箱',
        '洗衣机',
        '空调'
    ];
    
    // 显示搜索建议
    function showSuggestions(keywords) {
        searchSuggestions.innerHTML = '';
        
        if (keywords.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }
        
        keywords.forEach(keyword => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.textContent = keyword;
            item.addEventListener('click', () => {
                searchInput.value = keyword;
                searchSuggestions.style.display = 'none';
                performSearch(keyword);
            });
            searchSuggestions.appendChild(item);
        });
        
        searchSuggestions.style.display = 'block';
    }
    
    // 执行搜索
    function performSearch(keyword) {
        if (keyword.trim() === '') return;
        
        // 保存搜索历史
        saveSearchHistory(keyword);
        
        // 在实际应用中，这里会跳转到搜索结果页或执行搜索
        showNotification(`搜索: ${keyword}`, 'info');
        
        // 模拟跳转到搜索结果页
        // window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
    }
    
    // 保存搜索历史
    function saveSearchHistory(keyword) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        
        // 移除重复项
        searchHistory = searchHistory.filter(item => item !== keyword);
        
        // 添加到开头
        searchHistory.unshift(keyword);
        
        // 限制历史记录数量
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(0, 10);
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    // 输入时显示建议
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        
        if (value === '') {
            showSuggestions(hotKeywords);
        } else {
            // 模拟搜索建议
            const suggestions = hotKeywords.filter(keyword => 
                keyword.toLowerCase().includes(value.toLowerCase())
            );
            showSuggestions(suggestions);
        }
    });
    
    // 点击搜索按钮
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // 按Enter键搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // 点击页面其他地方隐藏建议
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
    
    // 显示热门搜索词
    showSuggestions(hotKeywords);
}

// 分类标签切换
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    let currentCategory = 'all';
    let currentPage = 1;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 加载新分类的商品
            currentCategory = this.dataset.category;
            currentPage = 1;
            loadProducts(currentCategory, currentPage);
        });
    });
}

// 加载更多功能
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    let currentCategory = 'all';
    let currentPage = 1;
    let isLoading = false;
    
    loadMoreBtn.addEventListener('click', async function() {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        loadMoreBtn.disabled = true;
        
        try {
            currentPage++;
            await loadProducts(currentCategory, currentPage);
            
            // 模拟API限制，假设最多3页
            if (currentPage >= 3) {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('加载更多失败:', error);
            showNotification('加载失败，请重试', 'error');
            currentPage--; // 回退页码
        } finally {
            isLoading = false;
            loadMoreBtn.innerHTML = '加载更多商品';
            loadMoreBtn.disabled = false;
        }
    });
}

// 检查用户登录状态
function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
        loginLink.textContent = `欢迎，${userData.username}`;
        loginLink.href = 'user-center.html';
    }
}

// 初始化主题切换器
function initThemeSwitcher() {
    // 创建主题切换器
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
        <button class="theme-btn theme-red" data-theme="default"></button>
        <button class="theme-btn theme-blue" data-theme="blue"></button>
        <button class="theme-btn theme-green" data-theme="green"></button>
        <button class="theme-btn theme-dark" data-theme="dark"></button>
    `;
    
    document.body.appendChild(themeSwitcher);
    
    // 创建夜间模式切换按钮
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = '切换夜间模式';
    
    document.body.appendChild(darkModeToggle);
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);
    
    // 主题按钮点击事件
    themeSwitcher.querySelectorAll('.theme-btn').forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
            localStorage.setItem('theme', theme);
        });
    });
    
    // 夜间模式切换
    darkModeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            document.body.classList.remove('dark-theme');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'false');
        } else {
            document.body.classList.add('dark-theme');
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'true');
        }
    });
    
    // 加载夜间模式设置
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-theme');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// 设置主题
function setTheme(theme) {
    document.body.className = '';
    
    if (theme === 'blue') {
        document.body.classList.add('blue-theme');
    } else if (theme === 'green') {
        document.body.classList.add('green-theme');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    // default主题不需要添加类
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
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
    
    // 添加关键帧动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
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