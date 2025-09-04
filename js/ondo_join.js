document.addEventListener('DOMContentLoaded', () => {
    // 패스워드 일치 여부 확인
    const pwd = document.getElementById('password');
    const pwd2 = document.getElementById('confirm_password');
    const wrong = document.querySelector('.password_wrong');

    if (pwd && pwd2 && wrong) {
        const update = () => {
            if (!pwd.value || !pwd2.value) {
                wrong.classList.remove('false');
                return;
            }
            if (pwd.value !== pwd2.value) wrong.classList.add('false');
            else wrong.classList.remove('false');
        };

        pwd.addEventListener('input', update);
        pwd2.addEventListener('input', update);
        update();
    }

    // phone 숫자 이외 모두 제한
    const phoneInputs = document.querySelectorAll('.phone input');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // 숫자가 아닌 문자를 모두 제거
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // 붙여넣기 방지
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9]/g, '');
            e.target.value = numbersOnly;
        });

        // 드래그 앤 드롭 방지
        input.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    });

    // 전체동의 체크박스
    const allAgreeCheckbox = document.querySelector('.all_agree input[type="checkbox"]');
    const requiredCheckbox = document.querySelectorAll('.required input[type="checkbox"]');
    const optionalCheckbox = document.querySelectorAll('.optional input[type="checkbox"]');

    if (!allAgreeCheckbox) return;

    // 전체 동의 체크박스 클릭 시
    allAgreeCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;

        // required 체크박스들 모두 선택/해제
        requiredCheckbox.forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        // optional 체크박스들 모두 선택/해제
        optionalCheckbox.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    // 개별 체크박스 변경 시 전체 동의 상태 업데이트
    function updateAllAgreeState() {
        const allRequired = Array.from(requiredCheckbox).every(cb => cb.checked);
        const allOptional = Array.from(optionalCheckbox).every(cb => cb.checked);

        // 모든 체크박스가 선택되었을 때만 전체 동의도 선택
        allAgreeCheckbox.checked = allRequired && allOptional;
    }

    // required 체크박스들 변경 감지
    requiredCheckbox.forEach(checkbox => {
        checkbox.addEventListener('change', updateAllAgreeState);
    });

    // optional 체크박스들 변경 감지
    optionalCheckbox.forEach(checkbox => {
        checkbox.addEventListener('change', updateAllAgreeState);
    });

    // 이용약관 자세히: 모든 span.view 클릭 시 해당 섹션의 textbox 토글
    document.querySelectorAll('.sec_agree .view').forEach((viewEl) => {
        viewEl.style.cursor = 'pointer';
        viewEl.addEventListener('click', () => {
            const container = viewEl.closest('div');
            const box = container ? container.querySelector('.textbox') : null;
            if (box) {
                viewEl.classList.toggle('show');
                box.classList.toggle('show');
            }
        });
    });

    // submit button 클릭 시 검증 내용
    const form = document.getElementById('joinForm') || document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1) 모든 input 값 체크
        const fields = form.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], input[type="tel"]');
        let firstEmpty = null;
        fields.forEach((el) => {
            if (!firstEmpty && !el.value.trim()) firstEmpty = el;
        });
        if (firstEmpty) {
            alert('모든 항목을 입력해주세요.');
            firstEmpty.focus();
            return;
        }

        // 2) 비밀번호 8자 이상여부 확인
        const pwd = form.querySelector('input[name="password"]');
        if (pwd && pwd.value.length < 8) {
            alert('비밀번호는 영어 대/소문자+숫자 조합 8~16자로 설정해주세요.');
            pwd.focus();
            return;
        }

        // 3) 비밀번호 일치 확인
        const pwd2 = form.querySelector('input[name="confirm_password"]');
        if (pwd && pwd2 && pwd.value !== pwd2.value) {
            alert('비밀번호를 확인해주세요.');
            pwd2.focus();
            return;
        }

        // 4) 이메일 형식 (@와 . 포함)
        const emailInput = form.querySelector('input[name="email"]');
        if (emailInput) {
            const v = emailInput.value.trim();
            if (!v.includes('@') || !v.includes('.')) {
                alert('이메일을 확인해주세요.');
                emailInput.focus();
                return;
            }
        }

        // 5) 필수 약관 동의 체크
        const reqChecks = document.querySelectorAll('.sec_agree .required input[type="checkbox"]');
        const allRequiredChecked = Array.from(reqChecks).every(cb => cb.checked);
        if (!allRequiredChecked) {
            alert('필수 약관에 동의해주세요.');
            if (reqChecks[0]) reqChecks[0].focus();
            return;
        }

        // 모두 통과 시 제출
        form.submit();
    });

    // 뒤로가기 버튼: 로그인 화면으로 이동
    const backBtn = document.querySelector('.btn_back');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ondo_login.html';
        });
    }
});