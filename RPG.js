var stage;
var message;
var debugMessage;
var queue;
var character;

var floor_SpriteSheetField;
var object_SpriteSheetField;

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

window.onload = init;

function init() {
    var myCanvas = document.getElementById('myCanvas');
    stage = new createjs.Stage(myCanvas);

    position(10, 10);

    message = new createjs.Text("Now Loading... ", "24px Arial", "#ffffff");
    stage.addChild(message);
    message.x = 50;
    message.y = 100;

    stage.update();

    var manifest = [
        { src: "./pic/object.png", type:"image", id: "object" },
        { src: "./pic/floor.png", type:"image", id: "floor" },
        { src: "./pic/chara.png", type:"image", id: "character" }
    ];

    queue = new createjs.LoadQueue(true);
    queue.addEventListener("progress",handleProgress);
    queue.addEventListener("fileload",handleFileLoad);
    queue.addEventListener("complete",handleComplete);
    queue.loadManifest(manifest);
}

//画像ファイルロードの進捗をパーセンテージで表わす
function handleProgress(event){
    message.text = "Now Loading... " + Math.floor(event.progress * 100)+ "%";
    stage.update();
}

function handleFileLoad(event){}

function handleComplete(event){
    mapData = firstMapData;
    mapLowLayerData = firstMapLowLayerData;
    mapUpperLayerData = firstMapUpperLayerData;

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

    //一番下にくる背景マップ作成
    var x = 0, y = 0;
    while (y < 44){
        while (x < 64){
            if (mapData[y][x] < 11) {
                var map = floor_SpriteSheetField.clone();
                map.setTransform(x*32, y*32);
                map.gotoAndStop(mapData[y][x]);
                backgroundMap.addChild(map);
                x += 1;
            } /*else if (192 <= mapData[y][x] && mapData[y][x]  < 320) {
                var map = floor_SpriteSheetField.clone();
                map.setTransform(x*32, y*32);
                map.gotoAndStop(mapData[y][x] - 192);
                backgroundMap.addChild(map);
                x += 1;
            }*/
        }
        x = 0;
        y += 1;
    }

    //背景マップの上にマップチップ配置
    x = 0, y = 0;
    while (y < 44){
        while (x < 64){
            if (mapLowLayerData[y][x] < 11) {
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

    //操作キャラアニメーション用のスプライトシートを作成
    var charaSpriteSheet = new createjs.SpriteSheet({
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
    stage.addChild(character);
    character.gotoAndPlay("down");

    //アニメーションさせるキャラの最初の座標を設定
    character.x = 224;
    character.y = 224;

    //一番上にくる前景マップ作成
    //バックグラウンドマップとキャラクターの上に前景マップ作成
    x = 0, y = 0;
    while (y < 44){
        while (x < 64){
         if (mapUpperLayerData[y][x] < 11) {
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

    //30FPSでスタート
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addListener(this);

    //キーが押された時のイベントリスナーの登録
    document.addEventListener('keydown', handleKeyDown, false);
    //キーが離された時のイベントリスナーの登録
    document.addEventListener('keyup', handleKeyUp, false);

    stage.removeChild(message);
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
            if (charaY < (1408-32) && firstMapObstacleData[y+1][x] === 0){
                //↑縦35マス×32ドットの1120から移動スピード8を差し引いた1112
                //そこからさらにキャラクタの高さ分の48を差し引いた　1112-48
                direction = 0;
            }
        } else if (keyFlags[1]) { //↑ w ボタン
         if (prevDirection != 1) {
            character.gotoAndPlay("up");
            prevDirection = 1;
        }
        if (charaY > 0 && firstMapObstacleData[y-1][x] === 0) {
            direction = 1;
        }
        } else if (keyFlags[2]) { //← a ボタン
         if (prevDirection != 2) {
            character.gotoAndPlay("left");
            prevDirection = 2;
        }
        if (charaX >= 4 && firstMapObstacleData[y][x-1] === 0) {
            direction = 2;
        }
        } else if (keyFlags[3]) { //→ d ボタン
         if (prevDirection != 3) {
            character.gotoAndPlay("right");
            prevDirection = 3;
        } if (charaX <= 2048-32 && firstMapObstacleData[y][x+1] === 0) { //32はキャラクタ幅
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

    if (charaX == 480 && charaY == 720) {
        charaX+=320;
        backgroundMap.x = (480-32)/2-charaX;
        backgroundMap.y = (480-32)/2-charaY;
        foregroundMap.x = (480-32)/2-charaX;
        foregroundMap.y = (480-32)/2-charaY;
    }

    stage.update();
}

//マップをスクロール
function moveMap() {
    backgroundMap.x = (480-32)/2-charaX;
    backgroundMap.y = (480-32)/2-charaY;
    foregroundMap.x = (480-32)/2-charaX;
    foregroundMap.y = (480-32)/2-charaY;


    i++;
    if (i == 2) {
       console.log("backgroundMap x:",backgroundMap.x,"backgroundMap y:", backgroundMap.y);
       console.log("foregroundMap x:",foregroundMap.x,"foregroundMap.y:",foregroundMap.y);
       console.log("character x:", charaX, "character y:", charaY);
       i = 0;
   }
}
