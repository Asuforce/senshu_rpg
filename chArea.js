//2階に行くメソッド
function to2F() {
    stage.removeAllChildren();
    backgroundMap.removeAllChildren();
    foregroundMap.removeAllChildren();
    thisfloor = 2;

    mapData = secondMapData;
    mapLowLayerData = secondMapLowLayerData;
    mapUpperLayerData = secondMapUpperLayerData;
    mapObstacleData = secondMapObstacleData;

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
    while (y < 38){
        while (x < 64){
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
    while (y < 38){
        while (x < 64){
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
    x = 0; y = 0;
    while (y < 38){
        while (x < 64){
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
}

//3階に行くメソッド
function to3F() {
    stage.removeAllChildren();
    backgroundMap.removeAllChildren();
    foregroundMap.removeAllChildren();
    thisfloor = 3;

    mapData = thirdMapData;
    mapLowLayerData = thirdMapLowLayerData;
    mapUpperLayerData = thirdMapUpperLayerData;
    mapObstacleData = thirdMapObstacleData;

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
    while (y < 22){
        while (x < 64){
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
    while (y < 22){
        while (x < 64){
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
    x = 0; y = 0;
    while (y < 22){
        while (x < 64){
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
}
