import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword, //회원가입
  signInWithEmailAndPassword, //로그인
  updateProfile, //프로필 표시 이름
  sendPasswordResetEmail, //비밀번호 재설정 이메일 발송
  GoogleAuthProvider,
  signInWithPopup, //팝업을 이용한 소셜로그인
  signOut, //log-out
  deleteUser, //Delete Account
  reauthenticateWithCredential, //email 비번으로 재인증
  reauthenticateWithPopup, // 소셜 로그인 계정으로 재인증
  EmailAuthProvider, //이메일 비번 인증
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// sign up 함수
export const signup = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(
    // 계정생성: email, pw, name 정보는 userCredential에 저장됨
    auth,
    email,
    password
  );

  // 방금 가입한 사용자의 이름(nickname)을 firebase 사용자 정보에 저장
  await updateProfile(userCredential.user, {
    // 방금 회원가입으로 생성된 사용자 객체
    displayName: displayName, //속성: 값
  });

};

//구글로그인
export const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("google 로그인 성공: ", user);
    return user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login window closed. Please try again.");
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your connection.");
    } else {
      console.error("google 로그인 실패: ", error);
      throw new Error("Failed to sign in with Google. Please try again.");
    }
  }
};

//github로그인
export const githubLogin = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("github 로그인 성공: ", user);
    return user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login window closed. Please try again.");
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your connection.");
    } else {
      console.error("github 로그인 실패: ", error);
      throw new Error("Failed to sign in with GitHub. Please try again.");
    }
  }
};

// sign in 함수
export const login = async (email, password) => {
  // 이메일과 비밀번호로 로그인 시도, 성공시 userCredential에 저장됨
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 이메일 인증을 하지 않았다면 에러 발생시켜 로그인 실패 처리
    if (!userCredential.user.emailVerified) {
      throw new Error("이메일 인증 필요");
    }

    // 로그인에 성공하면 콘솔에 사용자 정보 출력
    console.log("로그인 성공: ", userCredential);

    // 로그인된 사용자 객체를 결과로 반환
    return userCredential.user;
  } catch (error) {
    // 이메일 또는 비밀번호가 틀렸을 때
    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many login attempts. Please try again later.");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect Password");
    } else if (error.code === "auth/user-not-found") {
      throw new Error("This email is not registered.");
    } else {
      throw error;
    }
  }
};

// reset password
/* 
firebase에 요청을 보내고 응답을 기다려야 하므로 await를 선언해야함
email 전송이 끝날 때까지 기다려서 에러여부 판단
*/
export const resetPW = async (email) => {
  await sendPasswordResetEmail(auth, email); //해당 이메일 주소로 비밀번호 재설정 링크 발송
};

// log out
export const logout=async()=>{
  try {
    await signOut(auth);
    console.log('logout successful');
    alert('Successfully logged out.')
    window.location.href='login.html'
  } catch (error){
    console.log('logout failed: ',error)
  }
}

// deleteUser
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser; // 현재 로그인 중인 사용자 정보 가져오기

    if (!user) {
      // 로그인 상태가 아닐 경우
      alert("Login is required."); // 알림 띄우기
      return; // 함수 종료
    }

    if (
      user.providerData.some((provider) => provider.providerId == "google.com")
    ) {
      // 구글 계정으로 로그인한 경우
      const provider = new GoogleAuthProvider(); // 구글 Provider 생성
      await reauthenticateWithPopup(user, provider); // 팝업으로 사용자 재인증
      alert("Google re-authentication successful."); // 성공 메시지
    } else if (
      user.providerData.some((provider) => provider.providerId == "github.com")
    ) {
      // 깃허브 계정으로 로그인한 경우
      const provider = new GithubAuthProvider(); // 깃허브 Provider 생성
      await reauthenticateWithPopup(user, provider); // 팝업으로 사용자 재인증
      alert("GitHub re-authentication successful."); // 성공 메시지
    } else {
      // 이메일/비밀번호 로그인 사용자의 경우
      const email = user.email; // 현재 로그인된 사용자의 이메일 추출
      const password = prompt("Enter your password: "); // 사용자에게 비밀번호 입력 받기

      if (!password) {
        // 비밀번호를 입력하지 않았다면
        alert("Password is required."); // 경고창 띄우기
        return; // 함수 종료
      }

      const credential = EmailAuthProvider.credential(email, password); // 이메일과 비밀번호로 인증 정보 생성
      await reauthenticateWithCredential(user, credential); // 해당 정보로 재인증
      alert("Email re-authentication successful."); // 성공 메시지
    }

    await deleteUser(user); // 인증된 사용자 계정 삭제 실행
    alert("Your account has been successfully deleted."); // 계정 삭제 성공 메시지
    window.location.href = "login.html"; // 로그인 페이지로 이동
  } catch (error) {
    // 인증 정보가 오래돼서 오류가 발생한 경우 등 처리
    if (error.code === "auth/requires-recent-login") {
      alert("Recent authentication is required."); // 재로그인 요청
    } else {
      console.error("계정삭제실패: ", error.message); // 콘솔에 상세 오류 출력
      alert("Unable to delete account. Please try again."); // 사용자 알림
    }
  }
};
