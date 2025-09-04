// 모든 초기화를 하나의 DOMContentLoaded에서 처리
document.addEventListener('DOMContentLoaded', () => {
	// header: 스크롤 방향에 따라 숨김/표시
	const header = document.querySelector('header');
	const profileImg = document.querySelector('header .util .profile img');
	const cartImg = document.querySelector('header .util .cart img');

	// 아이콘 경로
	const ICONS = {
		profileBlack: 'img/ico_profile_b.png',
		profileWhite: 'img/ico_profile_w.png',
		cartBlack: 'img/ico_cart_b.png',
		cartWhite: 'img/ico_cart_w.png',
	};

	function setHeaderIcons(useBlack) {
		if (profileImg) profileImg.src = useBlack ? ICONS.profileBlack : ICONS.profileWhite;
		if (cartImg) cartImg.src = useBlack ? ICONS.cartBlack : ICONS.cartWhite;
	}

	// 헤더 호버 시 아이콘 블랙으로, 호버 해제 시 스크롤 상태에 맞춰 복원
	if (header) {
		header.addEventListener('mouseenter', () => setHeaderIcons(true));
		header.addEventListener('mouseleave', () => {
			const atTop = window.scrollY === 0;
			setHeaderIcons(!atTop);
		});
	}

	if (header) {
		let lastY = window.scrollY;
		let ticking = false;

		function applyHeaderBackground(y) {
			if (y === 0) {
				header.classList.remove('header--scrolled');
				header.style.backgroundColor = 'transparent';
				setHeaderIcons(false);
			} else {
				header.classList.add('header--scrolled');
				header.style.backgroundColor = 'rgba(255,255,255,0.8)';
				setHeaderIcons(true);
			}
		}

		function onScroll() {
			const y = window.scrollY;
			const goingDown = y > lastY;

			// 최상단에서는 숨김/표시 토글 비활성화하고 항상 표시 상태 유지
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
