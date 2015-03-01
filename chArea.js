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
    mapReload();
}

// mapを描画するメソッド
function mapReload() {
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

    //操作キャラアニメーション用のスプライトシートを作成
    stage.addChild(character);
    character.gotoAndPlay("up"); // 方向決めるのに使える！
}
