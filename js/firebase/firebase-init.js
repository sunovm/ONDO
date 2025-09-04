import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// firebase/docs에서 프로젝트 설정에서 가져오기
const firebaseConfig = {
  apiKey: "AIzaSyCBHbJutBsRhJ1-tWh0XSoC1NufYQHMQG8",
  authDomain: "ondo-3f27a.firebaseapp.com",
  projectId: "ondo-3f27a",
  storageBucket: "ondo-3f27a.firebasestorage.app",
  messagingSenderId: "258274941460",
  appId: "1:258274941460:web:7f9997c078c86a26836501"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

export {app, auth}