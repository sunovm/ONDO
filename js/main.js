// 모든 초기화를 하나의 DOMContentLoaded에서 처리
document.addEventListener('DOMContentLoaded', () => {
    // sec_ondo: ul.active-0~3에 맞춰 해당 li의 data-video를 배경 비디오로 재생
    const aboutRoot = document.querySelector('.sec_ondo .about.single');
    const list = document.querySelector('.sec_ondo .about.single .ondo_list ul');
    const videoA = document.querySelector('.sec_ondo .about.single .video_area .videoA');
    const videoB = document.querySelector('.sec_ondo .about.single .video_area .videoB');
    if (aboutRoot && list && videoA && videoB) {
        let useA = true;
        let currentIndex = null;

        function getIndex(li) {
            const siblings = Array.from(li.parentElement?.children || []);
            return siblings.indexOf(li);
        }

        function ensureAttrs(v) {
            v.muted = true; v.loop = true; v.playsInline = true;
            if (!v.hasAttribute('muted')) v.setAttribute('muted', '');
            if (!v.hasAttribute('autoplay')) v.setAttribute('autoplay', '');
            if (!v.hasAttribute('loop')) v.setAttribute('loop', '');
            if (!v.hasAttribute('playsinline')) v.setAttribute('playsinline', '');
            if (!v.hasAttribute('webkit-playsinline')) v.setAttribute('webkit-playsinline', '');
        }

        function crossfadeTo(src) {
            const next = useA ? videoB : videoA;
            const curr = useA ? videoA : videoB;
            ensureAttrs(next);

            const activate = () => {
                curr.classList.remove('active');
                next.classList.add('active');
                const p = next.play();
                if (p && p.catch) p.catch(() => {});
                try { curr.pause(); } catch(_) {}
            };

            if (next.getAttribute('src') !== src) {
                next.addEventListener('loadeddata', activate, { once: true });
                next.src = src;
                next.load();
                if (next.readyState >= 2) activate();
          } else {
                if (next.readyState >= 2) activate();
                else next.addEventListener('loadeddata', activate, { once: true });
            }
            useA = !useA;
        }

        function clearActiveClasses() {
            list.classList.remove('active-0','active-1','active-2','active-3');
        }

        list.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li || !list.contains(li)) return;
            const idx = getIndex(li);
            const src = li.getAttribute('data-video');
            if (idx < 0 || !src) return;

            // 같은 항목 재클릭 → 기본 상태로 복귀
            if (currentIndex === idx) {
                clearActiveClasses();
                videoA.classList.remove('active');
                videoB.classList.remove('active');
                try { videoA.pause(); } catch(_) {}
                try { videoB.pause(); } catch(_) {}
                currentIndex = null;
                return;
            }

            clearActiveClasses();
            list.classList.add(`active-${idx}`);
            crossfadeTo(src);
            currentIndex = idx;
        });
    }

    // 패럴랙스 스크롤링 구현
    let isScrolling = false;
    let currentSection = 0;
    let currentAboutSlide = 0;
    let lastAboutSlide = 0; // 마지막으로 보고 있던 슬라이드 기억
    const sections = [
        '.sec_hero',
        '.sec_about_slide', 
        '.sec_ondo',
        '.ondo_news'
    ];
    
    function scrollToSection(index) {
        if (isScrolling || index < 0 || index >= sections.length) return;
        
        isScrolling = true;
        currentSection = index;
        
        const targetSection = document.querySelector(sections[index]);
        if (targetSection) {
            // 패럴랙스 스크롤링: 부드러운 push 효과
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // 스크롤 완료 후 플래그 리셋 (자연스러운 전환)
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }
    
    function changeAboutSlide(direction) {
        const aboutSection = document.querySelector('.sec_about_slide');
        if (!aboutSection) return;
        
        const slides = aboutSection.querySelectorAll('.slide_content');
        const totalSlides = slides.length;
        
        if (direction === 'next') {
            // 다음 슬라이드로 이동
            if (currentAboutSlide < totalSlides - 1) {
                // 현재 활성 슬라이드 비활성화
                slides.forEach(slide => slide.classList.remove('active'));
                currentAboutSlide++;
                
                // 새 슬라이드 활성화
                slides[currentAboutSlide].classList.add('active');
                
                // 마지막 슬라이드 위치 기억
                lastAboutSlide = currentAboutSlide;
                
                // 비디오 재생
                const activeSlide = slides[currentAboutSlide];
                const video = activeSlide.querySelector('.image_area video');
                if (video) {
                    video.currentTime = 0;
                    video.play();
                }
            } else {
                // 마지막 슬라이드에서 다음 섹션으로 이동
                scrollToSection(currentSection + 1);
            }
        } else {
            // 이전 슬라이드로 이동
            if (currentAboutSlide > 0) {
                // 현재 활성 슬라이드 비활성화
                slides.forEach(slide => slide.classList.remove('active'));
                currentAboutSlide--;
                
                // 새 슬라이드 활성화
                slides[currentAboutSlide].classList.add('active');
                
                // 마지막 슬라이드 위치 기억
                lastAboutSlide = currentAboutSlide;
                
                // 비디오 재생
                const activeSlide = slides[currentAboutSlide];
                const video = activeSlide.querySelector('.image_area video');
                if (video) {
                    video.currentTime = 0;
                    video.play();
                }
            } else {
                // 첫 번째 슬라이드에서 이전 섹션으로 이동
                scrollToSection(currentSection - 1);
            }
        }
    }
    
    function handleWheel(e) {
        if (isScrolling) return;
        
        // 최소 스크롤 임계값 설정 (더 부드러운 제어)
        const threshold = 100; // 100px 이상 스크롤해야 반응
        
        if (Math.abs(e.deltaY) < threshold) return;
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            // 휠 다운: 다음으로
            if (currentSection === 0) { // sec_hero 구간
                scrollToSection(currentSection + 1);
            } else if (currentSection === 2) { // sec_ondo 구간
                // sec_ondo에서 ondo_news로 이동
                scrollToSection(currentSection + 1);
            } else if (currentSection < sections.length - 1) {
                // 마지막 섹션이 아닌 경우에만 다음 섹션으로
                scrollToSection(currentSection + 1);
            }
        } else {
            // 휠 업: 이전으로 (패럴랙스 구간 내에서만)
            if (currentSection === 2) { // sec_ondo 구간
                scrollToSection(currentSection - 1);
            } else if (currentSection === 1) { // sec_about_slide 구간
                scrollToSection(currentSection - 1);
            }
        }
    }

    // sec_about_slide 전용 휠 이벤트 핸들러 (절대적으로 슬라이드 전환만 처리)
    function handleAboutSlideWheel(e) {
        if (isScrolling) return;
        
        // 최소 스크롤 임계값 설정
        const threshold = 50;
        if (Math.abs(e.deltaY) < threshold) return;
        
        e.preventDefault();
        e.stopPropagation(); // 이벤트 버블링 완전 차단
        
        if (e.deltaY > 0) {
            // 휠 다운: 다음 슬라이드로만
            changeAboutSlide('next');
        } else {
            // 휠 업: 이전 슬라이드로만
            changeAboutSlide('prev');
        }
    }
    
    // 각 섹션에서 휠 이벤트 감지 (패럴랙스 적용 구간만)
    sections.forEach((selector, index) => {
        const section = document.querySelector(selector);
        if (section) {
            if (index === 1) { // sec_about_slide: 전용 휠 이벤트 (슬라이드 전환만)
                section.addEventListener('wheel', handleAboutSlideWheel, { passive: false });
            } else if (index < 3) { // sec_hero, sec_ondo: 일반 패럴랙스 휠 이벤트
                section.addEventListener('wheel', handleWheel, { passive: false });
            }
            
            // Intersection Observer로 현재 섹션 감지
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        currentSection = index;
                        
                        // sec_about_slide 구간일 때 마지막으로 보고 있던 슬라이드로 복원
                        if (index === 1) {
                            currentAboutSlide = lastAboutSlide;
                            const slides = section.querySelectorAll('.slide_content');
                            slides.forEach((slide, idx) => {
                                if (idx === lastAboutSlide) {
                                    slide.classList.add('active');
                                    const video = slide.querySelector('.image_area video');
                                    if (video) {
                                        video.currentTime = 0;
                                        video.play();
                                    }
                                } else {
                                    slide.classList.remove('active');
                                }
                            });
                        }
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(section);
        }
    });
    
    // 키보드 방향키로도 제어 가능 (패럴랙스 구간에서만)
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection === 0) { // sec_hero 구간
                scrollToSection(currentSection + 1);
            } else if (currentSection === 1) { // sec_about_slide 구간
                changeAboutSlide('next');
            } else if (currentSection === 2) { // sec_ondo 구간
                // sec_ondo에서 ondo_news로 이동
                scrollToSection(currentSection + 1);
            } else if (currentSection < sections.length - 1) {
                // 마지막 섹션이 아닌 경우에만 다음 섹션으로
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection === 1) { // sec_about_slide 구간
                changeAboutSlide('prev');
            } else if (currentSection === 2) { // sec_ondo 구간
                scrollToSection(currentSection - 1);
            } else if (currentSection > 0) {
                // sec_about_slide 구간에서만 이전 섹션으로
                scrollToSection(currentSection - 1);
            }
        }
    });


    // 화면 벗어나면 자동재생 영상 일시정지, 들어오면 재생 (메인/배경/개별 li 배경) — 다큐 영상은 수동 재생이므로 제외
    function ensureMutedInline(v) {
        if (!v) return;
        v.muted = true; v.playsInline = true; v.loop = v.hasAttribute('loop') || false;
        if (!v.hasAttribute('muted')) v.setAttribute('muted', '');
        if (!v.hasAttribute('playsinline')) v.setAttribute('playsinline', '');
        if (!v.hasAttribute('webkit-playsinline')) v.setAttribute('webkit-playsinline', '');
    }

    function playSafe(v) {
        ensureMutedInline(v);
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
    }

    const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const v = entry.target;
                         if (entry.isIntersecting) {
                 // sec_ondo 배경의 경우 active만 재생
                 if (v.closest('.sec_ondo .video_area')) {
                     if (v.classList.contains('active')) playSafe(v);
                     else { try { v.pause(); } catch (e) {} }
                 } else {
                     playSafe(v);
                 }
             } else {
                 try { v.pause(); } catch (e) {}
             }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px 0px 0px' }) : null;

    if (io) {
        const observed = document.querySelectorAll(
            'section.main_video video, .sec_ondo .video_area video, .sec_ondo .ondo_list li video.li_video'
        );
        observed.forEach(v => io.observe(v));
    }

    // docu btn 클릭 시 페이지 이동
    const vid01=document.getElementById('video01');
    const vid02=document.getElementById('video02');

    vid01.addEventListener('click',()=>{
        window.open('https://youtu.be/fHJ-Nc2X758?si=P7DPq9R4vCG5GgUE','_blank')
    })
    vid02.addEventListener('click',()=>{
        window.open('https://youtu.be/H5jW1o_vWA4?si=4kO94E-7n7s2-coI','_blank')
    })

    // sec_banner 버튼 클릭 시 페이지 이동
    const zeroWasteBtn = document.querySelector('.sec_banner .banner.zero_waste .btn_click');
    if (zeroWasteBtn) {
        zeroWasteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ondo_zerowaste.html';
        });
    }

    const campaignBtn = document.querySelector('.sec_banner .banner.campaign .btn_click');
    if (campaignBtn) {
        campaignBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ondo_campaign.html';
        });
    }
});
