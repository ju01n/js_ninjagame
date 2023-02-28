/* 코드를 작성하세요 */
const key = {
	keyDown : {},
	keyValue : {
		37: 'left',
		38: 'jump',
		39: 'right',
    88: 'attack'
	}
}
const jumpProp = {
	launch : false,
	arr : []
}
const bulletComProp = { //수리검배열 - attack키를 누를때 생성되는 모든 인스턴스를 담아서 관리
  launch : false,  //lauch변수 추가 : 수리검이 단 한번씩만 나가도록 만들기
  arr : []
}


const gameProp = { //자주사용하는 값들 글로벌화시킴
    screenWidth : window.innerWidth,
    screenHeight : window.innerHeight
}

const gameBackground = {
	gameBox : document.querySelector('.game')
	//페럴럭스 효과는 game에 적용 
}

const renderGame = () => {
  hero.keyMotion(); //초딩 60 fps로 호출- 키 눌림에 딜레이 없게 호출
	setGameBackground();


  bulletComProp.arr.forEach((arr, i) => { //수리검 이동- 반복문으로 관리 
    arr.moveBullet(); //수리검의 이동을 담당하는 movebullet메소드 호출
  });
  window.requestAnimationFrame(renderGame); //재귀 호출
}

const setGameBackground = () => { //rendergame함수에서 계속 호출하며 페럴럭스처리 :  계속 이동해야하는 요소이니때문에
	let parallaxValue = Math.min(0, (hero.movex - gameProp.screenWidth / 3) * -1);
	//히어로가 이동한 만큼 배경도 이동?  -> 반대방향으로 움직여야 할 것 . . -1곱하기
	gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;

}
const windowEvent = () => {
	window.addEventListener('keydown', e => {
		key.keyDown[key.keyValue[e.which]] = true;
    // 키를 누를 때 키 모션 메소드를 호출하고 움직임에 필요한 기능 구현
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
	});

	window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
	})
}


const loadImg = () =>{
	const preLoadImgSrc = ['../../lib/images/ninja_attack.png', '../../lib/images/ninja_run.png'];
	preLoadImgSrc.forEach( arr =>{ //이미지를 반복문로 로드시킴 
		const img = new Image(); //이미지태그를 만들어주는 코드
		img.src = arr; //브라우저에서 이미지를 내려받게 됨 이미지 캐싱처리 
		//돔에서 스크립트로 넣어주면서 서버로 요청함 - 캐싱 
	})
}
//로드이미지 함수는 프로그램 시작 시 호출되기 때문에 이닛함수에서 호출


let hero;
const init = () => {
  hero = new Hero('.hero');
  loadImg();
	windowEvent();
  renderGame();
  // console.log(hero.position());
}

window.onload = () => {
	init();
}
