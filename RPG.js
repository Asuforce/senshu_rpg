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
var CHARA_SPEED = 16;
var i = 0;
var mapData;
var mapLowLayerData;
var mapUpperLayerData;
var mapObstacleData;

var thisfloor = 1;
var floorX = 64, floorY;
var firstload = true;

window.onload = init;

function init() {
    var myCanvas = document.getElementById('myCanvas');
    stage = new createjs.Stage(myCanvas);
    position(10, 10);
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
    queue.loadManifest(manifest);                              //データを取得するときはquere.getResult()
    queue.addEventListener("complete", mapLoad);      //loadManifestが終わったら実行される
}

//画像ファイルロードの進捗をパーセンテージで表わす
function progressLoad(event){
    message.text = "Now Loading... " + Math.floor(event.progress * 100)+ "%";
    stage.update();
}

function mapLoad(event){
    if (firstload) {
        floorY = 44;

        mapData = firstMapData;
        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;

        //一番下にくるマップ用スプライトシート作成
        var floor_SpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("floor")],
            frames: { width: 32, height: 32 }
        });
        floor_SpriteSheetField = new createjs.BitmapAnimation(floor_SpriteSheet);

        //マップ上に配置するチップ用スプライトシート作成
        var object_SpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("object")],
            frames: { width: 32, height: 32 }
        });
        object_SpriteSheetField = new createjs.BitmapAnimation(object_SpriteSheet);

        //操作キャラアニメーション用のスプライトシートを作成
        charaSpriteSheet = new createjs.SpriteSheet({
            images: [queue.getResult("character")],
            frames: { width:32, height:32 },
            animations: {
                down: { frames: [1, 0, 2], frequency: 10 },
                up: { frames: [4, 3, 5], frequency: 10 },
                right: { frames: [6, 7], frequency: 10 },
                left: { frames: [8, 9], frequency: 10 }
            }
        });
        character = new createjs.BitmapAnimation(charaSpriteSheet);

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
        firstload = false;
    }

    //一番下にくる背景マップ作成
    var x = 0, y = 0;
    while (y < floorY){
        while (x < floorX){
           if (mapData[y][x] < 5) {
               var map = floor_SpriteSheetField.clone();
               map.setTransform(x*32, y*32);
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
                map.setTransform(x*32, y*32);
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
               map.setTransform(x*32, y*32);
               map.gotoAndStop(mapUpperLayerData[y][x]);
               //foregroundMap.addChild(map);
               x += 1;
            }
        }
        x = 0;
        y += 1;
    }
    stage.addChild(foregroundMap);

    stage.addChild(character);
    character.gotoAndPlay("down");
}

function changeFloor(cnt) {
    stage.removeAllChildren();
    backgroundMap.removeAllChildren();
    foregroundMap.removeAllChildren();
    thisfloor += cnt;

    switch(thisfloor) {
      case 1:
        floorY = 44;
        mapData = firstMapData;
        mapLowLayerData = firstMapLowLayerData;
        mapUpperLayerData = firstMapUpperLayerData;
        mapObstacleData = firstMapObstacleData;
        break;

      case 2:
        floorY = 38;
        mapData = secondMapData;
        mapLowLayerData = secondMapLowLayerData;
        mapUpperLayerData = secondMapUpperLayerData;
        mapObstacleData = secondMapObstacleData;
        break;

      case 3:
        floorY = 22;
        mapData = thirdMapData;
        mapLowLayerData = thirdMapLowLayerData;
        mapUpperLayerData = thirdMapUpperLayerData;
        mapObstacleData = thirdMapObstacleData;
        break;

      case 4:
        floorY = 21;
        mapData = fourthMapData;
        mapLowLayerData = fourthMapLowLayerData;
        mapUpperLayerData = fourthMapUpperLayerData;
        mapObstacleData = fourthMapObstacleData;
        break;

      case 5:
        floorY = 20;
        mapData = fifthMapData;
        mapLowLayerData = fifthMapLowLayerData;
        mapUpperLayerData = fifthMapUpperLayerData;
        mapObstacleData = fifthMapObstacleData;
        break;

      case 6:
        floorY = 13;
        mapData = sixthMapData;
        mapLowLayerData = sixthMapLowLayerData;
        mapUpperLayerData = sixthMapUpperLayerData;
        mapObstacleData = sixthMapObstacleData;
        break;

      case 7:
        floorY = 2;
        mapData = RMapData;
        mapLowLayerData = RMapLowLayerData;
        mapUpperLayerData = RMapUpperLayerData;
        mapObstacleData = RMapObstacleData;
        break;
    }
    mapLoad();
}

function position(posX, posY) {
    posX *= 32; posY *= 32;
    charaX = 224+posX;
    charaY = 224+posY;
    backgroundMap.x = -posX;
    backgroundMap.y = -posY;
    foregroundMap.x = -posX;
    foregroundMap.y = -posY;
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
    if (charaX % 32 === 0 && ((charaY) % 32) === 0) { //+16は操作キャラの32ドット超の部分
        direction = 4; //止まる

        //とりあえずこの方法で勇者座標から配列インデックスを設定
        var x = Math.floor(charaX/32);
        var y = Math.floor(charaY/32); //+16は操作キャラの32ドット超の分
        //↑Math.floorで小数点以下切り捨て

        if(keyFlags[0]) { //↓ s ボタン
            if (prevDirection !== 0) {
                character.gotoAndPlay("down");
                prevDirection = 0;
            }
            if (charaY < (1408-32) && mapObstacleData[y+1][x] === 0){
                //↑縦35マス×32ドットの1120から移動スピード8を差し引いた1112
                //そこからさらにキャラクタの高さ分の48を差し引いた　1112-48
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
            if (charaX >= 4 && mapObstacleData[y][x-1] === 0) {
                direction = 2;
            }
        } else if (keyFlags[3]) { //→ d ボタン
            if (prevDirection != 3) {
                character.gotoAndPlay("right");
                prevDirection = 3;
            }
            if (charaX <= 2048-32 && mapObstacleData[y][x+1] === 0) { //32はキャラクタ幅
                //↑横34マス×32ドットの1088から移動スピード8を差し引いた1080
                //そこからさらにキャラクタの幅の32を差し引いた　1080-32
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
    if (charaX == 480 && charaY == 736 && thisfloor == 1) {
        changeFloor(1);
        position(10, 4);
    } else if (charaX == 480 && charaY == 736 && thisfloor == 2) {
        changeFloor(1);
        position(10, 4);
    }

    stage.update();
}

//マップをスクロール
function moveMap() {
    backgroundMap.x = (480-32)/2-charaX;
    backgroundMap.y = (480-32)/2-charaY;
    foregroundMap.x = (480-32)/2-charaX;
    foregroundMap.y = (480-32)/2-charaY;
    /*
    i++;
    if (i == 2) {
   	//console.log("backgroundMap x:",backgroundMap.x,"backgroundMap y:", backgroundMap.y);
	//console.log("foregroundMap x:",foregroundMap.x,"foregroundMap.y:",foregroundMap.y);
	//console.log("character x:", charaX, "character y:", charaY);
	//console.log(queue);
	i = 0;
    }
    */
}