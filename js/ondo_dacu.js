    // 1. Swiper 초기화
    const imageSwiper = new Swiper('.image-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 30,
        loop: false,
        centeredSlides: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: function () {
                const index = this.activeIndex;
                const texts = document.querySelectorAll('.text-item');
                
                // 텍스트 활성화 토글
                texts.forEach((el, i) => {
                    el.classList.toggle('active', i === index);
                });

                // 자동재생 영상 제어 (활성 슬라이드만 play)
                const videos = document.querySelectorAll('.image-swiper video');
                videos.forEach((vid, i) => {
                    vid.loop=true;
                    if(i === index) {
                        vid.play().catch(() => {
                            vid.muted = true;
                            vid.play();
                        });
                    } else {
                        vid.pause();
                    }
                });
            }
        }
    });

    // 2. 페이지 로드 시 모든 영상 자동재생 시도
    document.querySelectorAll('.image-swiper video').forEach(vid => {
        vid.loop=true;
        vid.play().catch(() => {
            vid.muted = true;
            vid.play();
        });
    });

    // 3. 다큐영상 버튼 클릭 이벤트 (각 영상 링크 연결)
    document.querySelectorAll('.text-item a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = a.closest('.text-item');
            const index = Array.from(document.querySelectorAll('.text-item')).indexOf(parent);

            // 클릭한 버튼에 맞는 유튜브 영상 URL 열기
            const urls = [
                'https://www.youtube.com/watch?v=gw5PdqOiodU',
                'https://www.youtube.com/watch?v=FcLwJLOFVDQ',
                'https://www.youtube.com/watch?v=10S742PQwHU',
                'https://www.youtube.com/watch?v=aLIozYMEpXE'
            ];
            window.open(urls[index], '_blank');
        });

        // 호버 시 버튼 스타일만 변경, 영상과는 완전히 분리
        a.addEventListener('mouseenter', () => {
            a.style.opacity = 0.8; // 예시: 호버 효과
        });
        a.addEventListener('mouseleave', () => {
            a.style.opacity = 1;
        });
    });