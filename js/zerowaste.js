document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    function checkCards() {
        const triggerBottom = window.innerHeight * 0.85;

        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;

            if (cardTop < triggerBottom) {
                card.classList.add('show');
            } else {
                card.classList.remove('show');
            }
        });
    }

    window.addEventListener('scroll', checkCards);
    checkCards();
});


document.addEventListener("DOMContentLoaded", () => {
    const videos = [
        {
            id: "https://www.youtube.com/embed/X0Ccv1X5PzA",
            title: "처음이라도 괜찮아요, 영상으로 차근차근 배우는 제로웨이스트",
            subtitle: "더이상 사지 않는 10가지 <br> 제로웨이스트 왕초보를 위한 살림템",
            description: "환경부 인플루언서 어느덧오늘이 추천하는 <br> 제로웨이스트 왕초보를 위한 살림템, 영상으로 확인해 주세요 😊"
        },
        {
            id: "https://www.youtube.com/embed/Q2ygZzXt6Tw",
            title: "처음이라도 괜찮아요, 영상으로 차근차근 배우는 제로웨이스트",
            subtitle: "제로웨이스트의 왓츠인마이백 <br> What’s in my zero waste bag? | 한로 편",
            description: "안녕하세요. 지구를 사랑하는 임세미입니다. <br> 완벽하지는 않지만 제법 만족스러운 제로웨이스트의 백팩 속을 공개합니다🎒"
        },
        {
            id: "https://www.youtube.com/embed/cTCiFn0Ib4E",
            title: "처음이라도 괜찮아요, 영상으로 차근차근 배우는 제로웨이스트",
            subtitle: "플라스틱 없는 욕실 만들기🛁 <br> 욕실용품 추천템✨",
            description: "아직 완벽하지는 않지만 제로웨이스트를 조금씩 실천하면서 <br> 욕실의 달라진 모습들을 볼 수 있었어요☺️"
        },
        {
            id: "https://www.youtube.com/embed/-W7p1L83Jcs",
            title: "처음이라도 괜찮아요, 영상으로 차근차근 배우는 제로웨이스트",
            subtitle: "제로웨이스트샵 투어 | 쓰레기 없는 삶 <br> 지구를 위해 현명하게 소비하기",
            description: "제로웨이스트에 관심을 갖고 나서 버려지는 플라스틱을 줄일 수 있는 방법을 찾기 위해 <br> 쿠알라룸푸르에 있는 제로웨이스트샵에 다녀왔습니다."
        },
        {
            id: "https://www.youtube.com/embed/ZMClZWkmD0w",
            title: "처음이라도 괜찮아요, 영상으로 차근차근 배우는 제로웨이스트",
            subtitle: "3,000원 이하 다이소 추천템 리뷰✨ <br> 다이소에서 제로웨이스트 실천 시작하기🌏",
            description: "다이소에 은근 친환경 제품들이 곳곳에 있어서 좋은 소비로 <br> 더더 대중화되었으면 좋겠다하는 마음으로 영상을 만들어보았어요!!"
        }
    ];

    let currentIndex = 0;

    // 선택자
    const iframe = document.querySelector(".zero-video .video-area iframe");
    const mainTitle = document.querySelector(".zero-video h2");
    const subTitle = document.querySelector(".zero-video .title");
    const description = document.querySelector(".zero-video  .text");
    const prevBtn = document.querySelector(".zero-video .prevBtn");
    const nextBtn = document.querySelector(".zero-video .nextBtn");
    const counter = document.querySelector(".zero-video .video-counter");

    // 영상 표시 함수
    function showVideo(index) {
        iframe.src = videos[index].id + "?rel=0";
        setTimeout(() => {
            mainTitle.innerHTML = videos[index].title;
            subTitle.innerHTML = videos[index].subtitle;
            description.innerHTML = videos[index].description;
            updateCounter();
        }, 150);
    }

    // 숫자 갱신 함수
    function updateCounter() {
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${videos.length}`;
        }
    }

    // 버튼 이벤트
    prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        showVideo(currentIndex);
    });

    nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % videos.length;
        showVideo(currentIndex);
    });

    // 초기 표시
    showVideo(currentIndex);

});