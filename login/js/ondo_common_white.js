// Profile hover 기능 (선택적)
const profile = document.querySelector('.util .profile');
const profile_hover = document.querySelector('.profile_hover');
if (profile && profile_hover) {
    profile.addEventListener('mouseover', () => {
        profile_hover.classList.add('on')
    })
    profile.addEventListener('mouseleave', () => {
        profile_hover.classList.remove('on')
    })
}

// 모든 초기화를 하나의 DOMContentLoaded에서 처리
document.addEventListener('DOMContentLoaded', () => {
    // header: 스크롤 방향에 따라 숨김/표시
    const header = document.querySelector('header');
    if (header) {
        let lastY = window.scrollY;
        let ticking = false;

        function applyHeaderBackground(y) {
            if (y === 0) {
                header.style.backgroundColor = '#fff';
            } else {
                header.style.backgroundColor = 'rgba(255,255,255,0.8)';
            }
        }

        function onScroll() {
            const y = window.scrollY;
            const goingDown = y > lastY;
            
            // scrollTop이 0일 때는 header 숨김/표시 동작 비활성화
            if (y === 0) {
                header.classList.remove('header--hidden');
            } else {
                // 충분히 움직였을 때만 토글(스레싱 방지)
                if (Math.abs(y - lastY) > 4) {
                    if (goingDown) header.classList.add('header--hidden');
                    else header.classList.remove('header--hidden');
                    lastY = y;
                }
            }
            
            applyHeaderBackground(y);
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        // 초기 상태 반영
        applyHeaderBackground(window.scrollY);
    }

    // 개인정보처리방침 모달 동작
    const privacyLink = document.querySelector('footer .gnb .privacy');
    const privacyModal = document.getElementById('privacyModal');
    const privacyCloseBtn = privacyModal?.querySelector('.modal-close');
    if (privacyLink && privacyModal && privacyCloseBtn) {
        function openPrivacyModal() {
            document.querySelectorAll('section.main_video video, .sec_ondo .video_area video').forEach(x=>{ try{x.pause()}catch{}});
            privacyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            privacyCloseBtn.focus?.();
        }

        function closePrivacyModal() {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }

        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPrivacyModal();
        });
        privacyCloseBtn.addEventListener('click', closePrivacyModal);
        privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) closePrivacyModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && privacyModal.style.display === 'block') closePrivacyModal(); });
    }
});
