Kakao.init('d0ea7794dd08d8c6a2cfdf323bb6d582');
Kakao.isInitialized();

console.log(Kakao.isInitialized());

document.getElementById('kakao-login-btn').addEventListener('click',()=>{
    Kakao.Auth.authorize({
        redirectUri:'https://sunovm.github.io/auth-demo/kakao-callback.html'
    })
})