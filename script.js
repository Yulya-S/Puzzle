const ELEMENTSSIZE = 50 //размер одного элемента
const KOLVOIMAGES = 8 //количество изображений в папке с пазлами
let WIN = false //закончилась ли игра
let IMAGE = 'url("puzzles/picture'+( Math.floor(Math.random() * (KOLVOIMAGES)) )+'.jpg")' //стартовая картинка
let ACTIVELEMENT = -1 //Какая деталька выбрана (-1 - никакая)
let SCHETCHIK = 0 //счётчик игры


function endGame(){
  document.body.getElementsByTagName('p')[0].removeAttribute('style')
  WIN = true
  IMAGE = 'url("puzzles/picture'+( Math.floor(Math.random() * (KOLVOIMAGES)) )+'.jpg")' //Следующая картинка берётся рандомно
}

function takeElement(){ //берём пазалинку
  if (this.getAttribute('style')!=null && !WIN) {
    if ( ACTIVELEMENT != -1 ) event.target.parentElement.getElementsByClassName('activ')[0].classList.remove('activ')
    this.classList.add('activ')
    ACTIVELEMENT = this.getAttribute('data-idx')
}}

function acvt(elem){ //смена картинки в ячейке (функция нужна просто чтобы укоротить код)
  elem.setAttribute('data-brotherIdx', ACTIVELEMENT )
  if (elem.getAttribute('data-idx') == ACTIVELEMENT) SCHETCHIK++
  document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+ACTIVELEMENT+'"]').removeAttribute('style')
  document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+ACTIVELEMENT+'"]').classList.remove('activ')
  ACTIVELEMENT = -1
}

function postElem(){ //кладём пазалинку
  if (this.getAttribute('data-brotherIdx')==-1 && ACTIVELEMENT != -1 && !WIN) { //ставим пазалинку на выбранное место
    this.style = document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+ACTIVELEMENT+'"]').getAttribute('style')
    acvt(this)
  } else{
    if (this.getAttribute('style')!=-1 && ACTIVELEMENT != -1 && !WIN) { //если ячейка не пустая, но мы хотим туда что-то положить, замена одной пазалинки на другую
      document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+( this.getAttribute('data-brotherIdx') )+'"]').style = this.getAttribute('style')
      if (this.getAttribute('data-idx') == this.getAttribute('data-brotherIdx')) SCHETCHIK-=1
      this.style = document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+ACTIVELEMENT+'"]').getAttribute('style')
      acvt(this)
    } else{
      if (this.getAttribute('style')!=-1 && ACTIVELEMENT == -1 && !WIN){ //если мы ткнули на ячейку, но ничего туда не ложим, то она очищяется
        document.getElementsByClassName('elements')[0].querySelector('[data-idx="'+( this.getAttribute('data-brotherIdx') )+'"]').style = this.getAttribute('style')
        this.removeAttribute('style')
        if (this.getAttribute('data-idx') == this.getAttribute('data-brotherIdx')) SCHETCHIK-=1
        this.setAttribute('data-brotherIdx', -1 )
      }
    }
  }
  if (SCHETCHIK == 54) endGame()
}

function newImage() { IMAGE = this.style.backgroundImage; startGame()} //Смена изображения
function hide(what) { //сворачивания окна (hide or pictures) смотря что мы получаем за what
  if ( document.querySelector('.'+what).style.transform != 'scaleY(1)') document.querySelector('.'+what).style.transform = 'scaleY(1)'
  else document.querySelector('.'+what).style.transform = 'scaleY(0.000001)'
}

function createP(idx, className) { //создаём ячейки (для разных типов элементов у нас одна функция)
  const p = document.createElement('p')
  if ( className!='pictures' ) {
    p.setAttribute('data-idx', idx )
    if ( className!='pole' ){
      x = (idx % 9)
      y = (idx-x)/9
      p.style.backgroundPosition= (50 * -x) + 'px ' + (50 * - y) + 'px';
    } else { //создаём ячейку на поле
      p.addEventListener('click', postElem)
      p.setAttribute('data-brotherIdx', -1 )
    }
  } else { //создаём картинки в меню выбора картинки
    p.style.backgroundImage = "url( 'puzzles/picture"+idx+".jpg' )";
    p.addEventListener('click', newImage)
  }
  if ( className=='elements' ) { // создаём ячейку в окне выбора детальки
    p.style.backgroundImage = IMAGE;
    p.addEventListener('click', takeElement)
  }
  document.querySelector('.'+ className).appendChild(p)
}

function createElements() { //функция для создания перемешанных пазалинок
  document.querySelector('.elements').replaceChildren()
  let spisok = []
  for (let i = 0; i < 6 * 9;) {
    rnd = Math.floor(Math.random() * (9 * 6))
    if ( spisok.indexOf( rnd ) == -1 ){
      spisok.push( rnd )
      createP(rnd, 'elements')
      i++
}}}

function createElementsPole( poleName, max) { //poleName - поле в которое создаётся элемент, max - сколько элементов нужно создать
  document.querySelector('.'+poleName).replaceChildren()
  for (let i = 0; i < max; i++)
    createP(i, poleName)
}

function startGame(){
  document.querySelector('.hint').style.transform = 'scaleY(0.000001)' //скрываем поле с подсказкой
  WIN = false
  SCHETCHIK = 0
  document.body.getElementsByTagName('p')[0].style.display='none'
  //создаём поле
  createElements()
  createElementsPole( 'pole', 9 * 6 )
  createElementsPole( 'pictures', KOLVOIMAGES )
  document.querySelector('.pictures').style.transform = 'scaleY(0.000001)' //скрываем поле с выбором картинки
  document.querySelector('.hint').children[0].style.backgroundImage = IMAGE //заменяем изображение в подсказкесч
}

startGame()
