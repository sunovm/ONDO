$(function() {
    //메인 비쥬얼 슬라이드
    var swiper = new Swiper(".visual-slide", {
      spaceBetween: 30,
      effect: "fade",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    //inside-slide  
    //1. 슬라이드를 넣을 부모요소를 선택자로 저장
    const $swiperWrapper = $(".swiper-inside .swiper-wrapper");
    
    /* //2. 1부터 11까지의 반복하면서 슬라이드를 생성
    for (let i = 1; i <= 11; i++) {
      //toString() -> 숫자를 문자로 바꿔줘. 1 => '1'
      //이미지 번호를 2자리로 만든다. (01,02,...11)
      const imgNumber = i.toString().padStart(2, '0');

      //3.el를 생성(div, img)
      const $slide = $("<div class='swiper-slide'></div>");
      const $img = $(`<img src="img/inside_${imgNumber}.jpg" alt=''>`)

      //4. 슬라이드(div)안에 img넣기
      $slide.append($img);

      //5. swiper-wrapper안에 슬라이드 넣기
      $swiperWrapper.append($slide)
    } */

      $('.swiper-inside .swiper-slide').each(function(index) {
        const imgNumber = (index+1).toString().padStart(2, '0');
        const $img = $(this).find('img');

        $img.attr('src', `img/inside_${imgNumber}.jpg`)
      })
    var swiper = new Swiper(".swiper-inside", {
      spaceBetween: 40,
      slidesPerView: 5,
      loop: true
    })

    var swiper = new Swiper(".swiper-video", {
      spaceBetween: 40,
      slidesPerView: 3,
      loop: true
    })

    var swiper = new Swiper(".swiper-archive", {
      spaceBetween: 40,
      slidesPerView: 6,
      loop: true
    })

})