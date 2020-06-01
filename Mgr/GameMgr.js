import MapMgr from "./MapMgr";
import { List } from "../UIFrame/List";

export default class GameMgr extends Laya.Script3D {

    constructor() { 
        super(); 
        this.gameScene=null;
        this.levelData=null;
        this.isGameOver=false;
        this.isGameStart=false;
        this.teachStart=false;
        this.isStopGame=false;

        this.lastIsFail=false;

        this.gameGold=0;
    }

    init(scene){
        this.gameScene=scene;
        if(scene){
            let map=G_UIHelper.seekNodeByName(scene,"map");
            window.G_MapMgr=map.addComponent(MapMgr);
            G_MapMgr.init();
        }
      
        this.setSceneFog();
    }

    setSceneFog(color){
        this.gameScene.enableFog=true;
        //this.gameScene.fogColor=color.clone();
        this.gameScene.fogStart=3;
        this.gameScene.fogRange=20;
    }

    
    setStop(stop){
        this.isStopGame=stop;
        if(stop){
            Laya.timer.scale=0;
        }else{
            Laya.timer.scale=1;
        }
    }

    getIsStop(){
        return this.isStopGame;
    }

    getGameOver(){
        return this.isGameOver;
    }

    /**
     * 初始化场景
     * @param {*} callBack 
     */
    gameReady(lid,callBack){
        let levelData=G_GameDB.getLevelConfigByID(lid);
        this.levelData=levelData;
        this.gameGold=0;
        this.isGameOver=false;
        this.isGameStart=false;
        this.teachStart=false;
        G_MapMgr.loadMap(levelData,callBack);
    }

    /**
     * 游戏开始
     * @param {*} callBack 
     */
    gameStart(callBack){
        this.isGameStart=true;
        G_SoundMgr.playMusic(G_SoundName.SN_BG);
        
        G_Tools.handlerFun(callBack);
    }

    getGameStart(){
        return this.isGameStart&&!this.isGameOver&&this.teachStart;
    }


    setTeachStart(start){
        this.teachStart=start;
        G_Event.dispatchEvent(G_EventName.GAMESTART);
    }

    /**
     * 游戏成功
     * @param {*} callBack 
     */
    gameSuccess(){
        if(this.isGameOver){
            return;
        }
       
        G_CamreaRecordMgr.stop();
        let self=this;
        this.lastIsFail=false;
        G_SoundMgr.stopMusic();
        G_SoundMgr.playSound(G_SoundName.SN_SUCC);
        let gameView=G_MainGui.getPageByName(G_UIName.GameView);
        if(gameView){
            gameView.showGameOverTips(true);
        }
        
        G_Event.dispatchEvent(G_EventName.END_CHECK_OVER,true);//停止检测
        this.isGameOver=true;
        this.isGameStart=false;
        G_ShowInsertTLv++;
        G_ShowInsertLvCount++;
        G_PlayerInfo.addContinueLevel(1);//连续通关
        G_PlayerInfo.setToNextLevelID();
        let obj=new Object();
        obj.isWin=true;
        obj.lvId=this.levelData.id;
        obj.slvId=G_PlayerInfo.getShowLevelCount()-1;

        let endFun=function(){
            G_MainGui.closeUI(G_UIName.GameView)
            self.showExitView(function(){
                G_MainGui.openUI(G_UIName.GameOverView,obj,null);
            })
            
        }

        Laya.timer.once(2000,this,function(){
           
           endFun();

           
        }.bind(this))
    }

    /**
     * 游戏失败
     */
    gameFail(){
        if(this.isGameOver){
            return;
        }
        G_CamreaRecordMgr.stop();
        let self=this;
        this.lastIsFail=true;
        G_SoundMgr.stopMusic();
        G_SoundMgr.playSound(G_SoundName.SN_FAIL);
        G_Event.dispatchEvent(G_EventName.END_CHECK_OVER,false);//停止检测

        let gameView=G_MainGui.getPageByName(G_UIName.GameView);
        if(gameView){
            gameView.showGameOverTips(false);
        }

        this.isGameOver=true;
        this.isGameStart=false;
        G_ShowInsertTLv++;
        G_ShowInsertLvCount++;
        let obj=new Object();
        obj.isWin=false;
        obj.lvId=this.levelData.id;
        obj.slvId=G_PlayerInfo.getShowLevelCount();



        let failFun=function(){
            G_MainGui.closeUI(G_UIName.GameView);
            self.showExitView(function(){
                G_MainGui.openUI(G_UIName.GameOverView,obj,null);
            })
           
        }
       

        Laya.timer.once(1000,this,function(){
           failFun();
           
        });
    }

    
    showExitView(callBack){
        if((G_PlatHelper.isWXPlatform()&&G_MistakeMgr.isExitMistakeEnabledAsync())||G_PlatHelper.isWINPlatform()){
            G_UIManager.showUI("exitAd",null,callBack);
            G_Tools.hintBanner();
        }else{
            G_Tools.handlerFun(callBack);
        }
   }

    gameReborn(){
        this.isGameStart=true;
        this.isGameOver=false;
        this.teachStart=true;
        G_MainGui.openUI(G_UIName.GameView);
        G_MapMgr.playerMgr.rebom();
        G_SoundMgr.playMusic(G_SoundName.SN_BG);
        G_Event.dispatchEvent(G_EventName.EN_GAME_REBORN);
    }


    mobileShake(){
        if(!G_PlayerInfo.isMuteEnable()){
            return;
        }
        this.shakeIndex++;
       for(var i=0;i<3;i++){
        G_Scheduler.schedule("mobileshake_"+this.shakeIndex+"_"+i, function () {
            G_WXHelper.vibratePhone(false);
        }.bind(this),false,20*i,0);
       }
    }

    mobileShakeSgin(){
        if(!G_PlayerInfo.isMuteEnable()){
            return;
        }
        G_WXHelper.vibratePhone(false);
       
    }



      /**
     * 拿到随机皮肤id
     */
    getRandomSkinId(){
        let notSkinIds=this.getNotSkinId();
        if(notSkinIds.length==0){
            return null;
        }    

        if(!G_ShowWantdUseSkin){
            return null;
        }
    
        let itemData=new List();
        let skinData=null;
        for(var i=0;i<notSkinIds.length;i++){
            skinData=G_GameDB.getSkinConfigByID(notSkinIds[i]);
            itemData.add({id:notSkinIds[i],rate:skinData.recomedRate});
        }

        itemData.sort(function(v1,v2){
            if(v1.rate<v2.rate){
                return -1;
            }else if(v1.rate>v2.rate){
                return 1;
            }
    
            return 0;
        });
        let rateSummary=0;


        for(var i=0;i<itemData.getCount();i++){
            rateSummary+=itemData.getValue(i).rate;
        }

        let seed=Math.floor(Math.random()*rateSummary);//获得rateSummary以内的随机数
        let count=itemData.getCount();
        for(var i=0;i<count;i++){
            seed-=itemData.getValue(i).rate;
            if(seed<=0){
                return itemData.getValue(i).id;
            }
        }


        return notSkinIds[0];
    }

    getNotSkinId(){
        let skinDatas=G_GameDB.getAllSkinConfigs();
        let not=[];
        let skinId=0;
        for(var i=0;i<skinDatas.length;i++){
            let skinData=skinDatas[i];
            skinId=skinData.id;
            if(skinData.isOpen!=1){//排除未开放的
                continue;
            }

            if(!G_PlayerInfo.hasSkinById(skinId)){
                not.push(skinId);
            }
        }

        return not;
    } 
    
    /**
     * 拿到子弹升级需要的金币
     */
    getBulletHurtUpUseGold(){
        let bulletHurtLv=G_PlayerInfo.getBulletHurtLv();

        let gold=200*Math.pow(1.5,bulletHurtLv-1);

        return Math.floor(gold);
    }

    getBulletRateUpUseGold(){
        let bulletRateLv=G_PlayerInfo.getBulletRateLv();

        let gold=40*Math.pow(1.5,bulletRateLv-1);

        return Math.floor(gold);
    }

    getBulletHurt(){
        let bulletHurtLv=G_PlayerInfo.getBulletHurtLv();

        return 1+(bulletHurtLv-1)*0.5;
    }

    getBulletRate(){
        let baseRate=3;//1s五发

        let bulletRateLv=G_PlayerInfo.getBulletRateLv();

        return 1*1000/((1+0.1*(bulletRateLv-1))*baseRate);
    }
}