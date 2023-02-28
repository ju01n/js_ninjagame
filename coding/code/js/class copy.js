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
  }
  keyMotion() {
    /*히어로 움직임 */
    if (key.keyDown['left']) {
      this.direction = 'left';
      this.el.classList.add('run');
      this.el.classList.add('flip');
      this.movex = this.movex - this.speed;
    } else if (key.keyDown['right']) {
      this.direction = 'right';
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      this.movex = this.movex + this.speed;
    }

    if (key.keyDown['attack']) {
      if (!bulletComProp.launch) {
        this.el.classList.add('attack');
        bulletComProp.arr.push(new Bullet());
        bulletComProp.launch = true;
        //공격키- 수리검 던짐, 이 때 런치값이 트루로 바뀌면 더이상 생성 ㄴㄴ
      }
      // console.log(bulletComProp.arr.length);
    }
    if (key.keyDown['jump']) {
      this.el.classList.add('jump');
      this.el.classList.remove('flip');
    } else if (!key.keyDown['jump']) {
      this.el.classList.remove('jump');
    }
    if (!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }
    if (!key.keyDown['attack']) {
      this.el.classList.remove('attack');
      bulletComProp.launch = false;
    }
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`;
  }

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
    };
  }

  size() {
    //size method ->
    return {
      //넓이와 높이값을 리턴시킴
      //getBoundingclient를 사용해 알아 내는 방법도 있음
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    };
  }
}

class Bullet {
  constructor() {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div'); //div엘리먼트 생성
    this.el.className = 'hero_bullet'; //클래스 네임은 hero_bullet으로 ..
    this.x = 0;
    this.y = 0; //초기화
    this.speed = 30;
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
      this.distance += this.speed;
    }
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    //수리검이 이동할때 호출
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
    //화면을 벗어났는지, 충돌했는지 체크
    if (
      this.position().left > gameProp.screenWidth ||
      this.position().right < 0
    ) {
      //화면 오른쪽/ 왼쪽 벗어났다면 ..
      this.el.remove(); //수리검 삭제
    }
  }
}
