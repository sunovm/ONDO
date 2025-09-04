//플라스틱 페트병
window.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#plastic_pet');
  const items = section.querySelectorAll('ul.plastic_petGuide li');
  let current = 0;
  let intervalId = null;
  let delayTimeout = null;

  function activateItem(index) {
    items.forEach((li, i) => {
      if (i === index) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }

  function activateAll() {
    items.forEach(li => li.classList.add('active'));
  }

  function resetAll() {
    items.forEach(li => li.classList.remove('active'));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        delayTimeout = setTimeout(() => {
          current = 0;
          activateItem(current);

          intervalId = setInterval(() => {
            current++;
            if (current >= items.length) {
              clearInterval(intervalId);
              activateAll();
              return;
            }
            activateItem(current);
          }, 1500);
        }, 1000);
      } else {
        clearTimeout(delayTimeout);
        clearInterval(intervalId);
        resetAll();
      }
    });
  }, { threshold: 0.8 });

  observer.observe(section);
});

// 분리배출 불가 애니메이션
const ul = document.querySelector('ul.impos_imposGuide');
const items = ul.querySelectorAll('li');

items.forEach(li => {
  li.style.opacity = 0;
  li.style.transform = 'translateY(20px)';
  li.style.transition = 'all 1s ease';
});

let isAnimating = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !isAnimating) {
      isAnimating = true;

      items.forEach((li, index) => {
        setTimeout(() => {
          li.style.opacity = 1;
          li.style.transform = 'translateY(0)';

          if(index === items.length - 1){
            setTimeout(() => {
              isAnimating = false;
            }, 600);
          }
        }, index * 400);
      });

    } else if(!entry.isIntersecting && !isAnimating) {
      items.forEach(li => {
        li.style.opacity = 0;
        li.style.transform = 'translateY(20px)';
      });
    }
  });
}, { threshold: 0.2 });

observer.observe(ul);

// 자주묻는 질문 아코디언
window.addEventListener('DOMContentLoaded', () => {
    const faqQs = document.querySelectorAll('.plastic_faqQ');

    faqQs.forEach(faqQ => {
        const menu = faqQ.querySelector('.plastic_faqPlus');
        const faqA = faqQ.nextElementSibling;

        faqA.style.display = 'none';
        faqA.style.height = '0';

        const toggleFAQ = () => {
            faqQs.forEach(otherQ => {
                const otherA = otherQ.nextElementSibling;
                const otherMenu = otherQ.querySelector('.plastic_faqPlus');

                if (otherA !== faqA && otherA.style.display === 'block') {
                    otherA.style.height = otherA.scrollHeight + 'px';
                    setTimeout(() => otherA.style.height = '0', 10);
                    otherMenu.querySelector('span.item:nth-child(1)').classList.remove('rotated');

                    otherA.addEventListener('transitionend', function hide() {
                        otherA.style.display = 'none';
                        otherA.removeEventListener('transitionend', hide);
                    });
                }
            });

            if (faqA.style.display === 'block') {
                menu.querySelector('span.item:nth-child(1)').classList.remove('rotated');

                faqA.style.height = faqA.scrollHeight + 'px';
                setTimeout(() => faqA.style.height = '0', 10);
                faqA.addEventListener('transitionend', function hide() {
                    faqA.style.display = 'none';
                    faqA.removeEventListener('transitionend', hide);
                });
            } else {
                menu.querySelector('span.item:nth-child(1)').classList.add('rotated');

                faqA.style.display = 'block';
                faqA.style.height = '0';
                setTimeout(() => faqA.style.height = faqA.scrollHeight + 'px', 10);
            }
        };

        menu.addEventListener('click', toggleFAQ);
        faqQ.addEventListener('click', (e) => {
            if (!e.target.closest('.plastic_faqPlus')) {
                toggleFAQ();
            }
        });
    });
});