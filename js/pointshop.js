const swiper = new Swiper('.pointshop', {
    loop: true, // 무한 반복
    autoplay: {
      delay: 4000, // 4초마다 자동 전환
      disableOnInteraction: false, // 버튼 눌러도 자동재생 유지
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    effect: 'slide', // 'fade'로 바꾸면 페이드 효과
    speed: 600, // 전환 속도
  });

document.addEventListener('DOMContentLoaded', () => {

    //  베스트 상품 fetch + 메뉴
    const bestMenuItems = document.querySelectorAll('.best .menu li');
    const bestProductContainer = document.querySelector('.product');

    async function loadBestProducts(category) {
        try {
            const res = await fetch("data/best.json");
            const data = await res.json();
            renderBestProducts(data[category]);
        } catch (err) {
            console.error("상품 데이터를 불러오지 못했습니다:", err);
        }
    }

    function renderBestProducts(products) {
        bestProductContainer.innerHTML = '';

        if (!products || products.length === 0) {
            bestProductContainer.innerHTML = `<li>상품이 준비 중입니다.</li>`;
            return;
        }

        products.forEach(p => {
            bestProductContainer.innerHTML += `
                <li class="pro-info">
                    <a href="#">
                        <div class="info">
                            <div class="img-wrap">
                                <img src="${p.img}" alt="${p.brand}" class="main-img">
                                <img src="${p.hoverImg}" alt="${p.brand}" class="hover-img">
                            </div>
                            <p class="co-name">${p.brand}</p>
                            <p class="pro-name">${p.name}</p>
                        </div>
                        <div class="price-area">
                            <img src="img/Light Bulb.png" alt="">
                            <p class="price">${p.price}p</p>
                        </div>
                    </a>
                </li>
            `;
        });
    }

    bestMenuItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();

            // active 클래스 처리
            bestMenuItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            // JSON 데이터 로드
            const category = item.dataset.category;
            loadBestProducts(category);
        });
    });

    // 첫 화면 기본 카테고리 로드
    loadBestProducts("bath");



    // 슬라이더 JS
    class ProductSlider {
        constructor() {
            this.slider = document.getElementById('productSlider');
            this.progressFill = document.getElementById('progressFill');
            this.progressBar = document.querySelector('.progress-bar');
            
            if (!this.slider || !this.progressFill || !this.progressBar) {
                console.error('슬라이더 요소를 찾을 수 없습니다.');
                return;
            }
            
            this.currentSlide = 0;
            this.totalSlides = 2;
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.dragOffset = 0;
            this.sliderWidth = 0;
            
            this.init();
            this.updateView();
            this.handleResize();
        }
        
        init() {
            this.calculateSliderWidth();
            
            this.progressBar.addEventListener('click', (e) => {
                const rect = this.progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const targetSlide = Math.round(percentage * (this.totalSlides - 1));
                this.goToSlide(targetSlide);
            });
            
            this.slider.addEventListener('mousedown', (e) => {
                this.startDrag(e.clientX);
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) this.drag(e.clientX);
            });
            
            document.addEventListener('mouseup', (e) => {
                if (this.isDragging) this.endDrag(e.clientX);
            });
            
            this.slider.addEventListener('touchstart', (e) => {
                this.startDrag(e.touches[0].clientX);
            }, { passive: true });
            
            document.addEventListener('touchmove', (e) => {
                if (this.isDragging) {
                    this.drag(e.touches[0].clientX);
                    e.preventDefault();
                }
            }, { passive: false });
            
            document.addEventListener('touchend', (e) => {
                if (this.isDragging) this.endDrag(e.changedTouches[0].clientX);
            });
            
            window.addEventListener('resize', () => this.handleResize());
            this.slider.style.cursor = 'grab';
        }
        
        calculateSliderWidth() {
            this.sliderWidth = this.slider.parentElement.offsetWidth;
        }
        
        handleResize() {
            this.calculateSliderWidth();
            this.updateView();
        }
        
        startDrag(clientX) {
            this.isDragging = true;
            this.startX = clientX;
            this.currentX = clientX;
            this.dragOffset = 0;
            
            this.slider.classList.add('dragging');
            this.slider.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
        
        drag(clientX) {
            if (!this.isDragging) return;
            
            this.currentX = clientX;
            this.dragOffset = this.currentX - this.startX;
            
            const currentTranslate = -this.currentSlide * 100;
            const dragPercent = (this.dragOffset / this.sliderWidth) * 100;
            const newTranslate = currentTranslate + dragPercent;
            
            const maxTranslate = 0;
            const minTranslate = -(this.totalSlides - 1) * 100;
            
            let finalTranslate = newTranslate;
            if (newTranslate > maxTranslate) {
                finalTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
            } else if (newTranslate < minTranslate) {
                finalTranslate = minTranslate + (newTranslate - minTranslate) * 0.3;
            }
            
            this.slider.style.transform = `translateX(${finalTranslate}%)`;
        }
        
        endDrag(clientX) {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.slider.classList.remove('dragging');
            this.slider.style.cursor = 'grab';
            document.body.style.userSelect = '';
            
            const finalOffset = clientX - this.startX;
            const threshold = this.sliderWidth * 0.15;
            
            if (Math.abs(finalOffset) > threshold) {
                if (finalOffset > 0) this.prevSlide();
                else this.nextSlide();
            } else {
                this.updateView();
            }
        }
        
        updateView() {
            const translateX = -this.currentSlide * 100;
            this.slider.style.transform = `translateX(${translateX}%)`;
            
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
        
        nextSlide() {
            if (this.currentSlide < this.totalSlides - 1) {
                this.currentSlide++;
                this.updateView();
            }
        }
        
        prevSlide() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateView();
            }
        }
        
        goToSlide(index) {
            if (index >= 0 && index < this.totalSlides) {
                this.currentSlide = index;
                this.updateView();
            }
        }
    }

    new ProductSlider();
});