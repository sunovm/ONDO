import { login, googleLogin} from "./firebase/firebase-auth.js";

//아이디/비번 인풋 클릭 시 색 변경
const inputs = [document.getElementById("email"), document.getElementById("password")];
console.log(inputs)

inputs.forEach(input => {
  input.addEventListener("focus", () => {
    input.style.backgroundColor = "#fff";
    input.style.border = "1.8px solid #FF7029";
  });

  input.addEventListener("blur", () => {
    input.style.backgroundColor = "";
    input.style.border = "";
  });
});



// firebase
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errMsg = document.getElementById("error-message");
const submitBtn = document.getElementById("loginBtn");

// 1. 에러메시지 보여주는 함수
// 에러텍스트를 보여주고 .hidden 클래스 숨기기 > 에러영역 표시
const showError = (message) => {
  errMsg.textContent = message;
  errMsg.classList.remove("hidden");
};

// 에러메시지 숨기기
const hideError = () => {
  errMsg.textContent = "";
  errMsg.classList.add("hidden");
};

// 구글로그인
document
  .getElementById("google-login-btn")
  .addEventListener("click", async () => {
    try {
      const user = await googleLogin();
      console.log(user, '님 환영합니다')
      window.location.href = "index.html";
    } catch (error) {
      console.error(error.message);
    }
  });

// 로그인 버튼이 클릭시 실행될 함수
submitBtn.addEventListener("click", async () => {
  // 에러메시지 숨기기
  hideError();

  // 이메일, 비밀번호 변수에 저장 / trim 기능 사용
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // input 값이 비어있을 때 에러메시지
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }

  // 입력값이 있으면 login()함수를 실행해 firebase 로그인 시도 > 결과는 user에 저장
  try {
    const user = await login(email, password);

    // 로그인 성공시, 사용자 정보를 콘솔에 출력
    console.log("로그인된 사용자: ", user);

    // 로그인 성공 후 메인보드로 이동
    window.location.href = "index.html";
  } catch (error) {
    console.error("Failed: ", error.message);
  }
});
