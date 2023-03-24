/*게임에 필요한 클래스 구현*/
class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.speed = 11; //캐릭터속도와 수리검 속도가 같으면 안됨
    this.direction = 'right'; //최초 히어로가 오른쪽을 보고있기 때문에
    // console.log(window.innerHeight);
    // console.log(this.el.getBoundingClientRect().top);
    // console.log(window.innerHeight = this.el.getBoundingClientRect().top); //히어로의 탑 값
    // console.log(window.innerHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height);
    this.attackDamage = 1000;
    this.hpProgress = 0;
    this.hpValue = 10000;
    this.defaultHpValue = this.hpValue;
  }

  keyMotion() {
    /*히어로 움직임 */
    if (key.keyDown['left']) {
      this.direction = 'left';
      this.el.classList.add('run');
      this.el.classList.add('flip');
      this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;
    } else if (key.keyDown['right']) {
      this.direction = 'right';
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      this.movex = this.movex + this.speed;
    }
    if (key.keyDown['attack']) {
      if (!bulletComProp.launch) {
        //launch값이 false일때만 instance생성
        this.el.classList.add('attack');
        bulletComProp.arr.push(new Bullet()); //공격키를 누를때마다 push인스턴스 추가
        bulletComProp.launch = true;
        //공격키- 수리검 던짐, 이 때 런치값이 트루로 바뀌면 더이상 생성 ㄴㄴ
      }
      // console.log(bulletComProp.arr.length);
    }
    if (!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }
    if (!key.keyDown['attack']) {
      this.el.classList.remove('attack');
      bulletComProp.launch = false; //공격키를 떼면 false로 바꿔줌
    }
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`;
  }
  //   if(key.keyDown['jump']){
  //     if(!jumpProp.launch){ 
  //       this.el.classList.add('jump');
  //       jumpProp.arr.push(new Jump());
  //       jumpProp.launch = true;
  //     }else if(!key.keyDown['jump']){
  //       this.el.classList.remove('jump');
  //       this.el.classList.remove('flip')
  //     }
  // }

  // 위치값 알아내기
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      //top의 기준은 bottom으로 한다
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    }
  }

  size() {
    //size method ->
    return {
      //넓이와 높이값을 리턴시킴
      //getBoundingclient를 사용해 알아 내는 방법도 있음
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    }
  }

  updateHp(monsterDamage){
    this.hpValue = Math.max(0, this.hpValue - monsterDamage);
    this.hpProgress = this.hpValue / this.defaultHpValue * 100
    // console.log(this.hpProgress);
    const heroHpBox = document.querySelector('.state_box .hp span');
    heroHpBox.style.width = this.hpProgress + '%';
    this.crash();
    if(this.hpValue === 0){
      this.dead();
    }
  }
  crash(){
    this.el.classList.add('crash');
    setTimeout(() => this.el.classList.remove('crash'), 400)
  }
  dead(){
    hero.el.classList.add('dead');
  }
}

class Bullet {
  constructor() {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div'); //div엘리먼트 생성
    this.el.className = 'hero_bullet'; //클래스 네임은 hero_bullet으로 ..
    this.x = 0;
    this.y = 0; //초기화
    this.speed = 30; //수리검의 스피드, 수리검이 이동할 거리
    this.distance = 0;
    this.bulletDirection = 'right';
    this.init();
  }
  init() {
    //히어로의 위치값 가져옴
    this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
    this.x =
      this.bulletDirection === 'right'
        ? hero.movex + hero.size().width / 2
        : hero.movex - hero.size().width / 2;
    //left가 아닌 hero가 이동한 값으로 ..
    this.y = hero.position().bottom - hero.size().height / 2;
    //수리검이 transform으로 이동 되기 때문에 y좌표는 bottom기준으로 뺴줘야함
    this.distance = this.x;
    //수리검이 나간 후, 위치를 재설정해줘야함 (캐릭터 기준으로..)
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.parentNode.appendChild(this.el); //자식요소에 수리검 추가
  }
  moveBullet() {
    let setRotate = '';
    if (this.bulletDirection === 'left') {
      //수리검을 생성할때의 방향으로
      this.distance -= this.speed; //왼쪽을 보고있다면 distance값에 수리검에 스피드를 뺌
      setRotate = 'rotate(180deg)';
    } else {
      this.distance += this.speed; //distance는 30씩 증가 -> 수리검 이동
    }
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    //수리검이 이동할때 호출
    //수리검이 이동할 때 y좌표값넣음 (안넣으면 수리검이 발 밑에서 나감)
    this.crashBullet();
  }
  position() {
    //수리검 엘리먼트를 담은 변수가 this.el이기 때문에 따로 코드 수정하지 않아도됨
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
      //화면의 크기가 다를 때 위치값이 맞지 않을 수 있기때문에 top값을 빼는 방식으로 위치값을 정해줌...
    };
  }
  crashBullet() {
    for(let j = 0; j < allMonsterComProp.arr.length; j++){
    //수리검,몬스터 충돌할때
    if(this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right){
    for(let i = 0; i < bulletComProp.arr.length; i++){
      if(bulletComProp.arr[i] === this){//현재충돌한 수리검을 찾고 배열을 삭제 
      bulletComProp.arr.splice(i, 1); //충돌한 수리검 한개 삭제
      this.el.remove();
      // console.log(bulletComProp);
      allMonsterComProp.arr[j].updateHp(j); //수리검과 몬스터가 닿으면 호출되게 
    }}}}
    //화면을 벗어났는지, 충돌했는지 체크
    if (
      this.position().left > gameProp.screenWidth ||
      this.position().right < 0
    ) {
      //화면 오른쪽 || 왼쪽 벗어났다면 ..
      for(let i = 0; i < bulletComProp.arr.length; i++){
        if(bulletComProp.arr[i] === this){
        bulletComProp.arr.splice(i, 1); 
        this.el.remove(); //수리검삭제
        // console.log(bulletComProp);
      }}
    }
  }
}

class Monster {
	constructor(positionX, hp){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'monster_box';
		this.elChildren = document.createElement('div');
		this.elChildren.className = 'monster';
		this.hpNode = document.createElement('div');
		this.hpNode.className = 'hp';
		this.hpValue = hp;
		this.defaultHpValue = hp;
    //this.hpTextNode = document.createTextNode(this.hpValue)
		this.hpInner = document.createElement('span');
		this.progress = 0;
    this.positionX = positionX;
    this.moveX = 0;
    this.speed = 1;
    this.crashDamage = 100;

		this.init();
	} 
	init(){
		this.hpNode.appendChild(this.hpInner);
		this.el.appendChild(this.hpNode);
		this.el.appendChild(this.elChildren);
		this.parentNode.appendChild(this.el);
		this.el.style.left = this.positionX + 'px';
	}
	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}
  updateHp(index){//몬스터와 수리검이 충돌할때 호출/ j값을 index로 받음
    this.hpValue = Math.max(0, this.hpValue - hero.attackDamage);
		this.progress = this.hpValue / this.defaultHpValue * 100;
     //몬스터가 공격받았을 때 체력 깎임 
    // this.el.children[0].innerText = this.hpValue;
    this.el.children[0].children[0].style.width = this.progress + '%'; // 수정
    if(this.hpValue === 0){
      this.dead(index);
    }
    }
    dead(index){
      this.el.classList.add('remove');
      setTimeout(() => this.el.remove(), 200);
      allMonsterComProp.arr.splice(index, 1);
    }
    moveMonster(){
    	if(this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.movex <= 0){
        this.moveX = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left;
      }else{
        this.moveX -= this.speed;
      }
  
      this.el.style.transform = `translateX(${this.moveX}px)`;
      this.crash();
    }
    crash(){
      let rightDiff = 30; //히어로와 몬스터 사이 여백 빼줌
      let leftDiff = 90;
      if(hero.position().right-rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right){
      // console.log('충돌');
      hero.updateHp(this.crashDamage);
    }
  }
}
//몬스터 체력 닳게하기 
//1. 히어로의 공격력 2.몬스터 체력 관리 메소드 
