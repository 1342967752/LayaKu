import PageBase from "../UIFrame/PageBase";
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";

export default class GameOverViewEnd extends PageBase {

    constructor() { 
        super(); 
        this.vals=null;
        this.adObj=new Object();
        this.adObj.num=2;
        this.showMore=false;
        this.moveEnd=true;
       // this.isNeedTween=true;
    }
    
   pageInit(){
       super.pageInit();

       if(G_PlatHelper.isOPPOPlatform()){
            this.adObj.num=3;
        }

       this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK,this,function(){
        G_Tools.btnAction(this.viewProp.m_gold_add_btn_icon);
            G_MainGui.openUI(G_UIName.GetGoldView,null,null);
        });
        
       this.viewProp.m_backHome_btn.on(Laya.Event.CLICK,this,function(){
        G_XiYouMgr.rolePanelOP("第2个结束界面回到主页按钮");
        G_Tools.btnAction(this.viewProp.m_backHome_btn);
       if(!this.moveEnd){
           return;
       }
     
        let obj=new Object();
        obj.closeFun=function(){
            this.toReadyView();
        }.bind(this);
        G_MainGui.openUI(G_UIName.AdFullView,obj,null);
        G_GameMgr.gameReady(G_PlayerInfo.getCurLevelId(),null);
           
       }.bind(this));
       this.viewProp.m_toNext.on(Laya.Event.CLICK,this,function(){
        G_Tools.btnAction(this.viewProp.m_toNext);
        G_XiYouMgr.rolePanelOP("下一关按钮");
            if(!this.moveEnd){
                return;
            }
         
           G_GameMgr.gameReady(G_PlayerInfo.getCurLevelId(),null);
           let obj=new Object();
           obj.closeFun=function(){
               this.toReadyView();
           }.bind(this);
           G_MainGui.openUI(G_UIName.AdFullView,obj,null);
            
       }.bind(this));
      
       this.viewProp.m_replay_btn.on(Laya.Event.CLICK,this,function(){
        G_Tools.btnAction(this.viewProp.m_replay_btn);
        G_XiYouMgr.rolePanelOP("再玩一次按钮");
        if(!this.moveEnd){
            return;
        }
       
        G_GameMgr.gameReady(G_PlayerInfo.getCurLevelId(),null);
        let obj=new Object();
        obj.closeFun=function(){
            this.toReadyView();
        }.bind(this);
        G_MainGui.openUI(G_UIName.AdFullView,obj,null);
       }.bind(this));
       this.viewProp.m_share_btn.on(Laya.Event.CLICK,this,function(){
        G_XiYouMgr.rolePanelOP("第2个结束界面分享按钮");
        if(!this.moveEnd){
            return;
        }
            G_Tools.onShareTouched(this.viewProp.m_share_btn,null,G_ShareScene.SS_SHARE_APP);
            G_SoundMgr.playSound(G_SoundName.SN_CLICK)
       }.bind(this));

    //    this.viewProp.m_turntableView.on(Laya.Event.CLICK,this,function(){
    //     G_MainGui.openUI(G_UIName.TurntableView);
    //     });
    Laya.timer.frameLoop(1,this,this.initList)
   }

   initList(){

    if(!this.viewProp.m_mid){
        Laya.timer.clear(this,this.initList);
        return;
    }

    let list=G_UIHelper.seekNodeByName(this.viewProp.m_mid,"list");
   if(list.scrollBar){
    list.scrollBar.mouseWheelEnable = false;
    list.scrollBar.touchScrollEnable = false;
    Laya.timer.clear(this,this.initList);
   }
   
}

   toReadyView(){
        G_MainGui.closeUI(G_UIName.GameOverViewEnd);
        G_MainGui.openUI(G_UIName.ReadyView,null,function(){
            // if(G_PlayerInfo.getSupTurntableTimes()>0){
            //     G_MainGui.openUI(G_UIName.TurntableView);
            // }
        });

        // if(G_PlatHelper.isQQPlatform()&&G_MistakeMgr.isClickMistakeEnabledAsync()){
        //     G_PlatAction.cretaeBoxAd();
        // }
   }

   pageOpen(vals){
       super.pageOpen(vals);
       this.vals=vals;
       this.showAd();
       this.setView(vals.isWin);
       //在这里判断 是否失败 清除连续通关次数
       if(!vals.isWin){
            G_PlayerInfo.resetContinueLevel();
          //  this.owner.bgColor="#000000";
       }else{
       // this.owner.bgColor="#701fe0";
       }
       this.btnToMove();
       this.refershGoldNum();
       this.refershAdv();
      this.showTurntableBtnScale();
   }

   showAd(){
    if(G_PlatHelper.isVIVOPlatform()){
        if(G_MistakeHelp.getIsOpenId()){
            G_Event.dispatchEvent(G_EventName.EN_SHOW_INSERT_AD);//停止检测
        }
    }else if(G_PlatHelper.isOPPOPlatform()){
        if(G_ShowInsertLvCount==1){
          
            if(G_MistakeHelp.getInsertAdShowIns()){
                G_Event.dispatchEvent(G_EventName.EN_SHOW_INSERT_AD);//停止检测
              }else{
                  let time=(Laya.timer.currTimer-G_LastShowInsertTime)/1000;
                  if(G_PlayerInfo.canShowInsertAd()&&time>60){
                     
                       G_LastShowInsertTime=Laya.timer.currTimer;
                        G_Event.dispatchEvent(G_EventName.EN_SHOW_INSERT_AD);//停止检测
                        G_PlayerInfo.showInsertAdAdd();
                  }else{
                      G_Tools.createBanner();
                  }
              }
          }else{
            G_ShowInsertLvCount=0;
          }
    }
    }

   btnToMove(){
       this.moveEnd=false;
        G_Tools.bottomDoMove(this.viewProp.m_b,360,90,function(){
            this.moveEnd=true;
        }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
   }

   addListerner(){
        super.addListerner();
        this.refershGold=function(){
            this.refershGoldNum();
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.refershGold);
    }

    removeListerner(){
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.refershGold);
    }
   

  

    refershAdv(){
        if(G_PlatHelper.isWXPlatform()){
            if(this.viewProp.m_mid){
                let adv=this.viewProp.m_mid.getComponent(AdvLoadMgr);
                adv.refreshAdv();
            }
           
        }else if(G_PlatHelper.isOPPOPlatform()){
            if(this.viewProp.m_mid_oppo){
                let adv=this.viewProp.m_mid_oppo.getComponent(AdvLoadMgr);
                adv.refreshAdv();
            }
           
        }else if(G_PlatHelper.isTTPlatform()){
            if(this.viewProp.m_mid_tt){
                let adv=this.viewProp.m_mid_tt.getComponent(AdvLoadMgr);
                adv.refreshAdv();
            }
        }
           
       }

   setView(isSucc){
        this.viewProp.m_f_top.visible=!isSucc;
        this.viewProp.m_s_top.visible=isSucc;
        this.viewProp.m_s_b.visible=isSucc;
        this.viewProp.m_f_b.visible=!isSucc;
        this.viewProp.m_lv_index.text=G_GameDB.getUIWordByID(UIWordIDs["UIWORD_LEVEL_INDEX_PATTAN"]).word.format(this.vals.slvId);
   }

    refershGoldNum(){
        this.viewProp.m_gold_count.text=G_PlayerInfo.getCoin();
        this.viewProp.m_gold_count.value=G_PlayerInfo.getCoin();
    }

    addListerner(){
        super.addListerner();
        this.setGoldFun=function(){
            this.refershGoldNum();
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);
        
    }

    removeListerner(){
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);
    }

    showTurntableBtnScale(){
          
        G_Scheduler.unschedule("scale_m_turntableView_btn");
        let btn=this.viewProp.m_figer;
        let doScale = function ( delay = 500 ) {
            if(!btn||btn.destroyed){
                G_Scheduler.unschedule("scale_m_turntableView_btn");
                return;
            }
            G_Scheduler.schedule("scale_m_turntableView_btn", function () {
                G_UIHelper.playBtnTouchAction(btn, doScale, 1,1.2
                    , 8)
            }, false, delay, 0)
        }

        doScale();
   }
}