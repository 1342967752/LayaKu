import PlayerMgr from "../gameMgr/PlayerMgr";
import CameraMgr from "./CameraMgr";
import LevelConfigMgr from "../gameMgr/LevelConfigMgr";
import RecycleMgr from "../gameMgr/RecycleMgr";

export default class MapMgr extends Laya.Script3D {

    constructor() { 
        super(); 
        this.playerMgr=null;
        this.isLoadPlayer=false;
        this.configGo=null;
        this.configMgr=null;
        this.cameraMgr=null;
        this.light=null;

        this.roadDis=0;
        this.isOtherLoadOver=false;

        this.gameType=1;//1.跑关卡 2.打boss

        this.recycleMgr=new RecycleMgr();

        this.roadLen=8.5;

        this.rollsName="Rolls01";
    }

    /**
     * 初实话地图
     * @param {*} callBack 
     */
    init(){
        this.initCamera();
        this.light=G_UIHelper.seekNodeByName(this.owner,"light");
       // this.light.intensity=0.8;
    }

    initCamera(){
        let gameCamera=G_UIHelper.seekNodeByName(this.owner,"gameCamera");
        let cameraMgr=gameCamera.addComponent(CameraMgr);
        cameraMgr.init();
        this.cameraMgr=cameraMgr;
    }


    isReady(){
        return this.isLoadPlayer&&this.isOtherLoadOver;
    }


  

    /**
     * 初始化地图
     * @param {*} callBack 
     */
    loadMap(levelData,callBack){
      
        this.cleanScenes();

        let self=this;
        //设置摄像机的位置
        this.cameraMgr.owner.transform.position=G_Tools.getVector3(levelData.cameraStartPos);
        this.cameraMgr.owner.transform.rotation=G_Tools.getRot(levelData.cameraStartRot);
        this.loadConfig(levelData,function(){
       
           let p1=new Promise(function(resove,reject){
                self.loadRolls(function(){
                    resove();
                })
           })

            let p2=new Promise(function(resove,reject){
                self.changePlayer(function(){
                    resove();
                    
                },G_PlayerInfo.getSkinId());
            })

            Promise.all([p1,p2]).then(function(){

                let p1=new Promise(function(resove,reject){
                    self.configMgr.toNextRoad(function(){
                        resove();
                    })
    
                })

                let p2=new Promise(function(resove,reject){
                    self.configMgr.toNextRoad(function(){
                        resove();
                    })
    
                })



               Promise.all([p1,p2]).then(function(){
                self.configMgr.loadPrefabs(function(){
                    self.isOtherLoadOver=true;
                    G_Tools.handlerFun(callBack);
                    
                })
               })
               
               
               
            })
           
        }.bind(this));
    }

  

    loadRolls(callBack){
        let rollsName=G_ResPath.resPath.format(this.rollsName);

        G_NodePoolMgr.preload([rollsName],function(){
            G_Tools.handlerFun(callBack);
        })
    }

    cleanScenes(){
        if(this.configGo){
            let config=this.configGo.getComponent(LevelConfigMgr);
            this.configGo.destroy();
            this.configGo=null;
        }
        this.recycleMgr.clearGo();
        this.isLoadPlayer=false;
        this.isOtherLoadOver=false;
    }



    getGameType(){
        return this.gameType;
    }

        /**
     * 加载配置
     * @param {*} levelData 
     * @param {*} callBack 
     */
    loadConfig(levelData,callBack){
        let configName= G_ResPath.resPath.format(levelData.config);
        let assets=[];
        assets.push(configName);
        G_NodePoolMgr.preload(assets,function(){
            let configGo=G_NodePoolMgr.getNode(configName);
            this.configMgr=configGo.addComponent(LevelConfigMgr);
            this.configMgr.init();
            this.owner.addChild(configGo);
            this.configGo=configGo;
            G_Tools.resetTransform(configGo);
            G_Tools.handlerFun(callBack,configGo);
        }.bind(this));
        
    }

    /**
     * 改变玩家
     * @param {*} callBack 
     * @param {*} skinId 
     */
    changePlayer(callBack,skinId){
        
        if(this.playerMgr&&this.playerMgr.owner){
            this.playerMgr.owner.destroy();
            this.playerMgr=null;
        }
        let self=this;
        this.isLoadPlayer=false;
        let playerId=G_GameDB.getSkinConfigByID(skinId).playerId;
        let playerData=G_GameDB.getPlayerConfigByID(playerId);
        let assets=[];
        let playerName=G_ResPath.resPath.format(playerData.model);
        assets.push(playerName);
        G_NodePoolMgr.preload(assets,function(){
            if(!this||!this.owner||!this.configMgr||!this.configMgr.owner){
                return;
            }
            this.isLoadPlayer=true;
            let go=G_NodePoolMgr.getNode(playerName);
            this.configMgr.owner.addChild(go);
            G_Tools.resetTransform(go);
            this.playerMgr=go.addComponent(PlayerMgr);
            this.playerMgr.init(playerName);
            self.playerMgr.setStartPos(self.configMgr.getStartPos());
            self.cameraMgr.setPlayer(self.playerMgr.owner);
            self.cameraMgr.setCameraPosAndRot(self.playerMgr);
            G_Tools.handlerFun(callBack);
            
        }.bind(this));

    }


    getDis(){
        if(this.configMgr){
            return this.configMgr.getRoadDis();
        }

        return 0;
    }

    getPlayerDis(){
        if(this.playerMgr&&this.configMgr){
            return this.configMgr.culDis(this.playerMgr.owner.transform.position);
        }

        return 0;
    }

    setCamera(playerMgr,isEnd,val=0.08){
        if(this.cameraMgr){
            if(!isEnd){
                this.cameraMgr.setCameraMoveOne(playerMgr,val);
            }else{
                this.cameraMgr.setCameraMoveEnd(playerMgr);
            }
            
        }
        
    }
}