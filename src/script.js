const langBtn = document.querySelector('.js-lang-switcher');
const langList = langBtn.querySelector('.js-lang-list');
const carret = langBtn.querySelector('.main-menu__carret-down');

langBtn.addEventListener('click', () => {
  langList.classList.toggle('main-menu__lang-list_opened');
  carret.classList.toggle('main-menu__carret-down_opened');
});

const menuBtn = document.querySelector('.js-mobile-btn');
const menu = document.querySelector('.js-menu-list');

menuBtn.addEventListener('click', (e) => {
  console.log(e.currentTarget)
  if (e.currentTarget.classList.contains('main-menu__mobile-btn_opened')) {
    menuBtn.classList.remove('main-menu__mobile-btn_opened');
    menu.classList.remove('main-menu__list_opened');
  } else {
    menuBtn.classList.add('main-menu__mobile-btn_opened');
    menu.classList.add('main-menu__list_opened');
  }
});

const faqItem = document.querySelector('.question');
const faqToggle = document.querySelector('.question__toggle');
const faqAnsw = faqItem.querySelector('.question__answer');

faqItem.addEventListener('click', (e) => {
  if (e.target.classList.contains('question__toggle')) {
    faqItem.classList.toggle('question_opened')
    faqAnsw.classList.toggle('question__answer_opened')
    faqToggle.classList.toggle('question__toggle_opened')
  }
})
