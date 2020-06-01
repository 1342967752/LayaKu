import PageBase from "../UIFrame/PageBase";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";
import NativeFlow from "../../game/ui/popup/NativeFlow";
export default class GameView extends PageBase {

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.adObj.num=2;

        this.lastZ=0;
        this.showMore=false;
        this.teachTween=new ContinuousTweenMgr();
        let tVals=[];
        let time=1500;
        tVals.push({time:time,prop:{centerX:-162},ease:Laya.Ease.linearNone})
        tVals.push({time:time,prop:{centerX:0},ease:Laya.Ease.linearNone});
        tVals.push({time:time,prop:{centerX:206},ease:Laya.Ease.linearNone});
        tVals.push({time:time,prop:{centerX:0},ease:Laya.Ease.linearNone});
        this.teachTween.setTweenVals(tVals);

        this.jumpTeachTween=new ContinuousTweenMgr();

        let tVals01=[];
        tVals01.push({time:time,prop:{scaleX:1.2,scaleY:1.2},ease:Laya.Ease.linearNone})
        tVals01.push({time:time,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearNone})
        this.jumpTeachTween.setTweenVals(tVals01);
        this.nativeFlow=null;
    }



    addListerner(){
        super.addListerner();

        this.p1=function(){
           this.setGold();
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.p1);

        this.p2=function(){
            this.showJumpTeach(true);
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_SHOW_TEACH,this.p2);

        this.p3=function(){
            this.showTop(true);
            this.endTeach();
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_GAME_REBORN,this.p3);
    }
    
    removeListerner(){
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.p1);
        G_Event.removeEventListerner(G_EventName.EN_SHOW_TEACH,this.p2);
        G_Event.removeEventListerner(G_EventName.EN_GAME_REBORN,this.p3);
     }

    pageInit(){
        super.pageInit();
       
        if(G_PlatHelper.isWXPlatform()||G_PlatHelper.isWINPlatform()){
            if(this.adObj){
                this.adObj.num=1;
            }
        }else if(G_PlatHelper.isTTPlatform()){
            if(this.adObj){
                this.adObj.num=3;
            }
        }

        this.viewProp.m_teachView.on(Laya.Event.MOUSE_DOWN,this,function(){
            this.endTeach();
        })

        // this.viewProp.m_lv.on(Laya.Event.MOUSE_DOWN,this,function(){
        //     G_MapMgr.playerMgr.toSpeedUp();
        // })

        this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK,this,function(){
            G_XiYouMgr.rolePanelOP("主界面添加金币按钮");
            G_Tools.btnAction(this.viewProp.m_gold_add_btn_icon);
            G_MainGui.openUI(G_UIName.GetGoldView,null,null);
        });

        this.viewProp.m_JumpTeach.on(Laya.Event.MOUSE_UP,this,function(){
            G_GameMgr.setStop(false);
            this.showJumpTeach(false);
            G_Event.dispatchEvent(G_EventName.EN_TO_JUMP);
        })

        this.teachTween.setTarget(this.viewProp.m_finger);
        this.teachTween.setLoop(true);

        this.jumpTeachTween.setTarget(this.viewProp.m_jump_finger);
        this.jumpTeachTween.setLoop(true);

        this.nativeFlow=this.viewProp.m_flowAd.getComponent(NativeFlow);
    }

    showTop(show){
        this.viewProp.m_top.visible=show;
    }

    showJumpTeach(show){
        this.viewProp.m_JumpTeach.visible=show;
    }

  
   startTeach(){
        this.viewProp.m_teachView.visible=true;
        this.viewProp.m_finger.centerX=190;
        this.teachTween.play();
        this.jumpTeachTween.play();
   }

   endTeach(){
        this.viewProp.m_teachView.visible=false;
        this.teachTween.end();
        this.jumpTeachTween.end();
        G_GameMgr.setTeachStart(true);
   }
  

   
   
    pageOpen(){
        super.pageOpen();
        this.setGold();
        this.viewProp.m_lv.text=G_GameDB.getUIWordByID(UIWordIDs["UIWORD_LEVEL_INDEX_PATTAN"]).word.format(G_PlayerInfo.getShowLevelCount());;//
        this.setRoadBar(0);
        this.startTeach();
        this.refershNative();
        this.showJumpTeach(false);
        this.setGameOverTipsShow(false);
        this.showTop(true);
        G_CamreaRecordMgr.start();
    }

    refershNative(){
        if(G_PlatHelper.isVIVOPlatform()){
            this.nativeFlow.showUI();
            this.nativeFlow.setAdShow();
        }else{
            this.nativeFlow.hideUI();
        }
        
        if(G_PlatHelper.isOPPOPlatform()){
            let ad=this.viewProp.m_ad_btn.getComponent(AdvLoadMgr);
            ad.refreshAdv();
        }else{
            this.viewProp.m_ad_btn.visible=false;
        }
            
   }
   
    setGold(){
        this.viewProp.m_gold_count.text=G_PlayerInfo.getCoin();
        this.viewProp.m_gold_count.value=G_PlayerInfo.getCoin();
    }


    onUpdate(){
        if(G_GameMgr.getGameStart()){

            let val=G_MapMgr.getPlayerDis()/G_MapMgr.getDis();
            if(val>1){
                val=1;
            }
            this.setRoadBar(val);
        }
    }
  
    setRoadBar(val){
        this.viewProp.m_road_bar.value=val;
        let min=-271;
        let max=250;
        this.viewProp.m_fly.centerX=min+(max-min)*val;
    }

    showGameOverTips(isWin){
        this.showTop(false);
        this.setGameOverTipsShow(true);
        if(isWin){
            this.viewProp.m_succ_tips.skin="game/gameOver/succ_face.png";
        }else{
            this.viewProp.m_succ_tips.skin="game/gameOver/fail_face.png";
        }
    }

    setGameOverTipsShow(show){
        this.viewProp.m_gameover.visible=show;
        this.viewProp.m_succ_tips.visible=show;
    }
}