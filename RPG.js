var stage;
var message;
var message_f;
var message_audio;
var graphics;
var triangle1; var triangle2;
var queue = new createjs.LoadQueue(true);
var character;
var audio;
var flg = 'on';

var floor_SpriteSheetField;
var object_SpriteSheetField;
var charaSpriteSheet;

var backgroundMap = new createjs.Container();
var foregroundMap = new createjs.Container();

var prevDirection = 4;
var direction = 4; //歩いていく方向 （0～3：下上左右  4:止）
var keyFlags = [false, false, false, false];
var charaX = 0, charaY = 0;
var CHARA_SPEED = 1/4;
var mapLowLayerData;
var mapUpperLayerData;
var mapObstacleData;

var thisfloor = 1;
var floorX, floorY;
var firstload = true;
var dot = 32;

window.onload = init;

function init() {
    var myCanvas = document.getElementById('myCanvas');
    stage = new createjs.Stage(myCanvas);
    message = new createjs.Text("Now Loading... ", "24px Arial", "#ffffff");
    stage.addChild(message);
    message.x = myCanvas.width/3; message.y = myCanvas.height/2;

    stage.update();

    var manifest = [
        { src: "./pic/object.png", type:"image", id: "object" },
        { src: "./pic/floor.png", type:"image", id: "floor" },
        { src: "./pic/chara.png", type:"image", id: "character" }
    ];

    queue.addEventListener("progress", progressLoad);
    queue.loadManifest(manifest);                        //データを取得するときはquere.getResult()
    queue.addEventListener("complete", mapLoad);

    //三角形表示
    graphics = new createjs.Graphics();
    graphics.beginStroke("#cccccc"); // 色の指定（線と塗りつぶしとそれぞれ色を指定する）
    graphics.beginFill("#7aeac8");
    graphics
        .moveTo(-30,0)
        .lineTo(50,60)
        .lineTo(100,-20)
        .closePath();

    triangle1 = new createjs.Shape(graphics);
    button1  = new createjs.Shape(graphics);

    graphics = new createjs.Graphics();
    graphics.beginStroke("#aaaaaa"); // 色の指定（線と塗りつぶしとそれぞれ色を指定する）
    graphics.beginFill("#ca7a98");
    graphics
        .moveTo(0,25)
        .lineTo(85,35)
        .lineTo(25,-70)
        .closePath();

    triangle2 = new createjs.Shape(graphics);
    button2  = new createjs.Shape(graphics);

    audio = new Audio();
    audio.src = 'music.mp3';
    audio.loop = true;
    audio.play();
    //console.log(myPlayer.currentTime);
}

//画像ファイルロードの進捗をパーセンテージで表わす
function progressLoad(event){
    message.text = "Now Loading... " + Math.floor(event.progress * 100)+ "%";
    stage.update();
}

function mapLoad(event){
    if (firstload) {
        floorX = 64;
        floorY = 44;

        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;

        //一番下にくるマップ用スプライトシート作成
        var floor_SpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("floor")],
            frames: { width: dot, height: dot }
        });
        floor_SpriteSheetField = new createjs.BitmapAnimation(floor_SpriteSheet);

        //マップ上に配置するチップ用スプライトシート作成
        var object_SpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("object")],
            frames: { width: dot, height: dot }
        });
        object_SpriteSheetField = new createjs.BitmapAnimation(object_SpriteSheet);

        //操作キャラアニメーション用のスプライトシートを作成
        charaSpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("character")],
            frames: { width: dot, height: dot },
            animations: {
                down: { frames: [1, 0, 2], frequency: 10 },
                up: { frames: [4, 3, 5], frequency: 10 },
                right: { frames: [6, 7], frequency: 10 },
                left: { frames: [8, 9], frequency: 10 }
            }
        });
        character = new createjs.BitmapAnimation(charaSpriteSheet);
        character.gotoAndPlay("up");

        //アニメーションさせるキャラの最初の座標を設定
        character.x = myCanvas.width/2;
        character.y = myCanvas.height/2;

        //30FPSでスタート
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addListener(this);

        //キーが押された時のイベントリスナーの登録
        document.addEventListener('keydown', handleKeyDown, false);
        //キーが離された時のイベントリスナーの登録
        document.addEventListener('keyup', handleKeyUp, false);

        stage.removeChild(message);
        position(9, 43);
        firstload = false;
    }

    //一番下にくる背景マップ作成
    var x = 0, y = 0;
    while (y < floorY){
        while (x < floorX){
           if (mapLowLayerData[y][x] < 13) {
               var map = floor_SpriteSheetField.clone();
               map.setTransform(x*dot, y*dot);
               map.gotoAndStop(mapLowLayerData[y][x]);
               backgroundMap.addChild(map);
               x += 1;
           }
        }
        x = 0;
        y += 1;
    }

    //一番上にくる前景マップ作成
    //バックグラウンドマップとキャラクターの上に前景マップ作成
    x = 0; y = 0;
    while (y < floorY){
        while (x < floorX){
           if (mapUpperLayerData[y][x] < 40) {
               var map = object_SpriteSheetField.clone();
               map.setTransform(x*dot, y*dot);
               map.gotoAndStop(mapUpperLayerData[y][x]);
               foregroundMap.addChild(map);
               x += 1;
            }
        }
        x = 0;
        y += 1;
    }
    stage.addChild(backgroundMap);
    stage.addChild(foregroundMap);
    stage.addChild(character);

    triangle1.x = myCanvas.width-100; triangle1.y = myCanvas.height-40;
    triangle2.x = myCanvas.width-110; triangle2.y = myCanvas.height-40;

    message_f = new createjs.Text(thisfloor+"階", "30px serif", "#ffffff");
    message_f.x = myCanvas.width-100; message_f.y = myCanvas.height-50;

    stage.addChild(triangle1);
    stage.addChild(triangle2);
    stage.addChild(message_f);

    button1.x = myCanvas.width-220; button1.y = myCanvas.height-40;
    button2.x = myCanvas.width-230; button2.y = myCanvas.height-40;

    message_audio = new createjs.Text("BGM:"+flg, "20px serif", "#ffffff");
    message_audio.x = myCanvas.width-230; message_audio.y = myCanvas.height-45;

    stage.addChild(button1);
    stage.addChild(button2);
    stage.addChild(message_audio);

    button1.addEventListener('click', handleEvent);
    button2.addEventListener('click', handleEvent);
    message_audio.addEventListener('click', handleEvent);
    flg = 'off';
}

function handleEvent(e) {
    stage.removeChild(message_audio);
    if(flg == 'on') {
        audio.loop = true;
        audio.play();
        message_audio = new createjs.Text("BGM:"+flg, "20px serif", "#ffffff");
        message_audio.x = myCanvas.width-230; message_audio.y = myCanvas.height-45;
        flg = 'off';
    } else {
        audio.pause();
        message_audio = new createjs.Text("BGM:"+flg, "20px serif", "#ffffff");
        message_audio.x = myCanvas.width-230; message_audio.y = myCanvas.height-45;
        flg = 'on';
    }
    stage.addChild(message_audio);
}

function changeFloor(cnt) {
    stage.removeAllChildren();
    backgroundMap.removeAllChildren();
    foregroundMap.removeAllChildren();
    thisfloor += cnt;

    switch(thisfloor) {
      case 1: //64*44
        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;
        break;

      case 2: //64*38
        mapLowLayerData = secondMapLowLayerData;
        mapUpperLayerData = secondMapUpperLayerData;
        mapObstacleData = secondMapObstacleData;
        break;

      case 3: //64*22
        mapLowLayerData = thirdMapLowLayerData;
        mapUpperLayerData = thirdMapUpperLayerData;
        mapObstacleData = thirdMapObstacleData;
        break;

      case 4: //64*21
        mapLowLayerData = fourthMapLowLayerData;
        mapUpperLayerData = fourthMapUpperLayerData;
        mapObstacleData = fourthMapObstacleData;
        break;

      case 5: //64*20
        mapLowLayerData = fifthMapLowLayerData;
        mapUpperLayerData = fifthMapUpperLayerData;
        mapObstacleData = fifthMapObstacleData;
        break;

      case 6: //64*13
        mapLowLayerData = sixthMapLowLayerData;
        mapUpperLayerData = sixthMapUpperLayerData;
        mapObstacleData = sixthMapObstacleData;
        break;

      case 7: //5*2
        mapLowLayerData = RMapLowLayerData;
        mapUpperLayerData = RMapUpperLayerData;
        mapObstacleData = RMapObstacleData;
        break;
    }
    floorX = mapLowLayerData[0].length;
    floorY = mapLowLayerData.length;

    mapLoad();
}

function position(posX, posY) {
    console.log("thisfloor is " + thisfloor);
    charaX = posX;
    charaY = posY;
    prevDirection = 4; //エリア移動した直後の向き矯正
    moveMap();
}

//キーボードのキーが押された時の処理
function handleKeyDown(event) {
    if (event.keyCode==40 || event.keyCode==83) {//↓ s ボタン
        keyFlags[0] = true;
    } else if (event.keyCode==38 || event.keyCode==87) {//↑ w ボタン
        keyFlags[1] = true;
    } else if (event.keyCode==37 || event.keyCode==65) {//← a ボタン
        keyFlags[2] = true;
    } else if (event.keyCode==39 || event.keyCode==68) {//→ d ボタン
        keyFlags[3] = true;
    }
    // スピード調整 歩いてない時のみ
    if (charaX % 1 === 0 && charaY % 1 === 0) {
        if (event.keyCode==49) {//1
            CHARA_SPEED = 1/16;
        } else if (event.keyCode==50) {//2
            CHARA_SPEED = 1/8;
        } else if (event.keyCode==51) {//3
            CHARA_SPEED = 1/4;
        } else if (event.keyCode==52) {//4
            CHARA_SPEED = 1/2;
        }
    }
}

//キーボードのキーが離された時の処理
function handleKeyUp(event) {
    if (event.keyCode==40 || event.keyCode==83) {//↓ s ボタン
        keyFlags[0] = false;
    } else if (event.keyCode==38 || event.keyCode==87) {//↑ w ボタン
        keyFlags[1] = false;
    } else if (event.keyCode==37 || event.keyCode==65) {//← a ボタン
        keyFlags[2] = false;
    } else if (event.keyCode==39 || event.keyCode==68) {//→ d ボタン
        keyFlags[3] = false;
    }
}

function tick(){
    if (charaX % 1 === 0 && ( charaY % 1) === 0) { //+16は操作キャラの32ドット超の部分
        direction = 4; //止まる

        //とりあえずこの方法で勇者座標から配列インデックスを設定
        var x = Math.floor(charaX);
        var y = Math.floor(charaY); //+16は操作キャラの32ドット超の分
        //↑Math.floorで小数点以下切り捨て

        if(keyFlags[0]) { //↓ s ボタン
            if (prevDirection !== 0) {
                character.gotoAndPlay("down");
                prevDirection = 0;
            }
            if (charaY < floorY-1 && mapObstacleData[y+1][x] === 0){
                direction = 0;
            }
        } else if (keyFlags[1]) { //↑ w ボタン
            if (prevDirection != 1) {
                character.gotoAndPlay("up");
                prevDirection = 1;
            }
            if (charaY > 0 && mapObstacleData[y-1][x] === 0) {
                direction = 1;
            }
        } else if (keyFlags[2]) { //← a ボタン
            if (prevDirection != 2) {
                character.gotoAndPlay("left");
                prevDirection = 2;
            }
            if (charaX > 0 && mapObstacleData[y][x-1] === 0) {
                direction = 2;
            }
        } else if (keyFlags[3]) { //→ d ボタン
            if (prevDirection != 3) {
                character.gotoAndPlay("right");
                prevDirection = 3;
            }
            if (charaX < floorX-1 && mapObstacleData[y][x+1] === 0) {
                direction = 3;
            }
        }
    }

    //次のマスまで操作キャラを自動的に歩かせる(と仮定して座標計算)
    if(direction === 0) {
        charaY += CHARA_SPEED;
    } else if (direction == 1) {
        charaY -= CHARA_SPEED;
    } else if (direction == 2) {
        charaX -= CHARA_SPEED;
    } else if (direction == 3) {
        charaX += CHARA_SPEED;
    }
    if (direction < 4) moveMap(); //マップをスクロール

    // 階数条件分岐
    if (thisfloor == 1) {
        if (charaX == 19 && charaY == 36) {
            changeFloor(1);
            position(19, 28);
            character.gotoAndPlay("up");
        } else if (charaX == 18 && charaY == 15) {
            changeFloor(1);
            position(18, 10);
            character.gotoAndPlay("up");
        } else if (charaX == 27 && charaY == 4) {
            changeFloor(1);
            position(27, 5);
            character.gotoAndPlay("down");
        } else if (charaX == 62 && charaY == 7) {
            changeFloor(1);
            position(61, 6);
            character.gotoAndPlay("left");
        } else if (charaX === 0 && charaY == 6) {
            changeFloor(1);
            position(1, 5);
            character.gotoAndPlay("left");
        }
    } else if (thisfloor == 2) {
        if (charaX == 18 && charaY == 29) {
            changeFloor(-1);
            position(18, 37);
            character.gotoAndPlay("down");
        } else if (charaX == 19 && charaY == 25) {
            changeFloor(1);
            position(18, 16);
            character.gotoAndPlay("up");
        } else if (charaX == 18 && charaY == 11) {
            changeFloor(-1);
            position(18, 16);
            character.gotoAndPlay("down");
        } else if (charaX == 21 && charaY == 11) {
            changeFloor(1);
            position(22, 9);
            character.gotoAndPlay("up");
        } else if (charaX == 27 && charaY == 4) {
            changeFloor(-1);
            position(27, 5);
            character.gotoAndPlay("up");
        } else if (charaX == 26 && charaY == 4) {
            changeFloor(1);
            position(27, 3);
            character.gotoAndPlay("down");
        } else if (charaX == 62 && charaY == 7) {
            changeFloor(1);
            position(61, 6);
            character.gotoAndPlay("left");
        } else if (charaX === 0 && charaY == 5) {
            changeFloor(1);
            position(1, 6);
            character.gotoAndPlay("left");
        }
    } else if (thisfloor == 3) {
        if (charaX == 17 && charaY == 17) {
            changeFloor(-1);
            position(18, 25);
            character.gotoAndPlay("down");
        } else if (charaX == 18 && charaY == 14) {
            changeFloor(1);
            position(19, 12);
            character.gotoAndPlay("up");
        } else if (charaX == 21 && charaY == 14) {
            changeFloor(1);
            position(21, 13);
            character.gotoAndPlay("up");
        } else if (charaX == 27 && charaY == 2) {
            changeFloor(-1);
            position(26, 5);
            character.gotoAndPlay("down");
        } else if (charaX == 26 && charaY == 2) {
            changeFloor(1);
            position(29, 6);
            character.gotoAndPlay("down");
        } else if (charaX == 22 && charaY == 10) {
            changeFloor(-1);
            position(21, 10);
            character.gotoAndPlay("up");
        } else if (charaX == 62 && charaY == 7) {
            changeFloor(1);
            position(61, 6);
            character.gotoAndPlay("left");
        }
    } else if (thisfloor == 4) {
        if (charaX == 25 && charaY == 5) {
            mapObstacleData = fourthMapObstacleData2;
        } else if (charaX == 25 && charaY == 6 || charaX == 24 && charaY == 5) {
            mapObstacleData = fourthMapObstacleData;
        } else if (charaX == 18 && charaY == 13) {
            changeFloor(-1);
            position(17, 15);
            character.gotoAndPlay("down");
        } else if (charaX == 19 && charaY == 5) {
            changeFloor(1);
            position(19, 5);
            character.gotoAndPlay("up");
        } else if ((charaX == 22 || charaX == 23 || charaX == 24) && charaY == 1) {
            changeFloor(1);
            position(23, 7);
            character.gotoAndPlay("up");
        } else if (charaX == 29 && charaY == 5) {
            changeFloor(-1);
            position(26, 3);
            character.gotoAndPlay("down");
        } else if (charaX == 28 && charaY == 5) {
            changeFloor(1);
            position(29, 13);
            character.gotoAndPlay("down");
        } else if (charaX == 21 && charaY == 14) {
            changeFloor(-1);
            position(21, 15);
            character.gotoAndPlay("down");
        } else if (charaX == 62 && charaY == 7) {
            changeFloor(1);
            position(61, 6);
            character.gotoAndPlay("left");
        }
    } else if (thisfloor == 5) {
        if ((charaX == 22 || charaX == 23 || charaX == 24) && (charaY == 3 || charaY == 7)) {
            mapObstacleData = fifthMapObstacleData2;
        } else if ((charaX == 19 || charaX == 20 || charaX == 21) && charaY == 3) {
            mapObstacleData = fifthMapObstacleData;
        } else if ((charaX == 22 || charaX == 23 || charaX == 24) && charaY == 8) {
            changeFloor(-1);
            position(23, 2);
            character.gotoAndPlay("down");
        } else if (charaX == 29 && charaY == 12) {
            changeFloor(-1);
            position(28, 6);
            character.gotoAndPlay("down");
        } else if (charaX == 28 && charaY == 12) {
            changeFloor(1);
            position(29, 6);
            character.gotoAndPlay("down");
        } else if (charaX == 62 && charaY == 7) {
            changeFloor(1);
            position(61, 6);
            character.gotoAndPlay("left");
        }
    } else if (thisfloor == 6) {
        if (charaX == 29 && charaY == 5) {
            changeFloor(-1);
            position(28, 13);
            character.gotoAndPlay("down");
        } else if (charaX == 28 && charaY == 5) {
            changeFloor(1);
            position(1, 1);
        }
    }

    stage.update();
}

//マップをスクロール
function moveMap() {
    backgroundMap.x = character.x-charaX*dot;
    backgroundMap.y = character.y-charaY*dot;
    foregroundMap.x = character.x-charaX*dot;
    foregroundMap.y = character.y-charaY*dot;
    if (charaX % 1 === 0 && (charaY % 1) === 0) {
        //console.log("backgroundMap x:",backgroundMap.x/dot,"backgroundMap y:", backgroundMap.y/dot);
        //console.log("foregroundMap x:",foregroundMap.x/dot,"foregroundMap.y:",foregroundMap.y/dot);
        console.log("charaX:", charaX, "charaY:", charaY);
    }
}