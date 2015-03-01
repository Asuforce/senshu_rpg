var stage;
var message;
var queue = new createjs.LoadQueue(true);
var character;

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
var mapData;
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
    message.x = 50; message.y = 100;

    stage.update();

    var manifest = [
        { src: "./pic/object.png", type:"image", id: "object" },
        { src: "./pic/floor.png", type:"image", id: "floor" },
        { src: "./pic/chara.png", type:"image", id: "character" }
    ];

    queue.addEventListener("progress", progressLoad);
    queue.loadManifest(manifest);                        //データを取得するときはquere.getResult()
    queue.addEventListener("complete", mapLoad);      //loadManifestが終わったら実行される
}

//画像ファイルロードの進捗をパーセンテージで表わす
function progressLoad(event){
    message.text = "Now Loading... " + Math.floor(event.progress * 100)+ "%";
    stage.update();
}

function mapLoad(event){
    if (firstload) {
        mapData = firstMapData;
        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;

        floorX = mapData[0].length;
        floorY = mapData.length;

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
        character.x = 224;
        character.y = 224;

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
           if (mapData[y][x] < 5) {
               var map = floor_SpriteSheetField.clone();
               map.setTransform(x*dot, y*dot);
               map.gotoAndStop(mapData[y][x]);
               backgroundMap.addChild(map);
               x += 1;
           }
        }
        x = 0;
        y += 1;
    }

    //背景マップの上にマップチップ配置
    x = 0; y = 0;
    while (y < floorY){
        while (x < floorX){
            if (mapLowLayerData[y][x] < 256) {
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
    stage.addChild(backgroundMap);

    //一番上にくる前景マップ作成
    //バックグラウンドマップとキャラクターの上に前景マップ作成
    x = 0; y = 0;
    while (y < floorY){
        while (x < floorX){
           if (mapUpperLayerData[y][x] < 256) {
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
    stage.addChild(foregroundMap);

    stage.addChild(character);
}

function changeFloor(cnt) {
    stage.removeAllChildren();
    backgroundMap.removeAllChildren();
    foregroundMap.removeAllChildren();
    thisfloor += cnt;

    switch(thisfloor) {
      case 1: //64*44
        mapData = firstMapData;
        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;
        break;

      case 2: //64*38
        mapData = secondMapData;
        mapLowLayerData = secondMapLowLayerData;
        mapUpperLayerData = secondMapUpperLayerData;
        mapObstacleData = secondMapObstacleData;
        break;

      case 3: //64*22
        mapData = thirdMapData;
        mapLowLayerData = thirdMapLowLayerData;
        mapUpperLayerData = thirdMapUpperLayerData;
        mapObstacleData = thirdMapObstacleData;
        break;

      case 4: //64*21
        mapData = fourthMapData;
        mapLowLayerData = fourthMapLowLayerData;
        mapUpperLayerData = fourthMapUpperLayerData;
        mapObstacleData = fourthMapObstacleData;
        break;

      case 5: //64*20
        mapData = fifthMapData;
        mapLowLayerData = fifthMapLowLayerData;
        mapUpperLayerData = fifthMapUpperLayerData;
        mapObstacleData = fifthMapObstacleData;
        break;

      case 6: //64*13
        mapData = sixthMapData;
        mapLowLayerData = sixthMapLowLayerData;
        mapUpperLayerData = sixthMapUpperLayerData;
        mapObstacleData = sixthMapObstacleData;
        break;

      case 7: //5*2
        mapData = RMapData;
        mapLowLayerData = RMapLowLayerData;
        mapUpperLayerData = RMapUpperLayerData;
        mapObstacleData = RMapObstacleData;
        break;
    }
    floorX = mapData[0].length;
    floorY = mapData.length;
    mapLoad();
}

function position(posX, posY) {
    console.log("thisfloor is " + thisfloor);
    charaX = posX;
    charaY = posY;
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
    if (charaX % 1 === 0 && ((charaY) % 1) === 0) { //+16は操作キャラの32ドット超の部分
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
    if (charaX == 19 && charaY == 36 && thisfloor == 1) {
        changeFloor(1);
        position(19, 28);
        character.gotoAndPlay("up");
    } else if (charaX == 18 && charaY == 29 && thisfloor == 2) {
        changeFloor(-1);
        position(18, 37);
        character.gotoAndPlay("down");
    } else if (charaX == 19 && charaY == 24 && thisfloor == 2) {
        changeFloor(1);
        position(18, 16);
        character.gotoAndPlay("up");
    } else if (charaX == 17 && charaY == 17 && thisfloor == 3) {
        changeFloor(-1);
        position(18, 25);
        character.gotoAndPlay("down");
    } else if (charaX == 18 && charaY == 14 && thisfloor == 3) {
        changeFloor(1);
        position(19, 12);
        character.gotoAndPlay("up");
    } else if (charaX == 18 && charaY == 13 && thisfloor == 4) {
        changeFloor(-1);
        position(17, 15);
        character.gotoAndPlay("down");
    } else if (charaX == 18 && charaY == 5 && thisfloor == 4) {
        changeFloor(1);
        position(19, 5);
        character.gotoAndPlay("up");
    } //５階破綻してる。一度言ったら戻れない

    stage.update();
}

//マップをスクロール
function moveMap() {
    backgroundMap.x = character.x-charaX*dot;
    backgroundMap.y = character.y-charaY*dot;
    foregroundMap.x = character.x-charaX*dot;
    foregroundMap.y = character.y-charaY*dot;
    if (charaX % 1 === 0 && ((charaY) % 1) === 0) {
        //console.log("backgroundMap x:",backgroundMap.x/dot,"backgroundMap y:", backgroundMap.y/dot);
        //console.log("foregroundMap x:",foregroundMap.x/dot,"foregroundMap.y:",foregroundMap.y/dot);
        console.log("charaX:", charaX, "charaY:", charaY);
    }
}