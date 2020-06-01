
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";
import PageBase from "../UIFrame/PageBase";
import NativeFlow from "../../game/ui/popup/NativeFlow";

export default class GameOverView extends PageBase {

    constructor() { 
        super(); 
        this.tGold=50;
        this.eGold=10;
        //this.tdiam=10;
        this.timerDownTimer=0;
        this.downTime=10;
        this.vals=null;
        this.adObj=new Object();
        this.adObj.num=2;
        this.showMore=false;
        this.isStopTimer=false;//是否暂停计时器
        this.moveEnd=true;
        //this.isNeedTween=true;

        this.nativeFlow=null;
    }
    
    pageInit(){
        super.pageInit();
    this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK,this,function(){
            G_XiYouMgr.rolePanelOP("第一个结束界面添加金币按钮");
            G_Tools.btnAction(this.viewProp.m_gold_add_btn_icon);
            G_MainGui.openUI(G_UIName.GetGoldView,null,null);
        }.bind(this));

        this.viewProp.m_three_time_btn.on(Laya.Event.CLICK,this,function(){
            G_XiYouMgr.rolePanelOP("三倍获取按钮");
            G_Tools.btnAction(this.viewProp.m_three_time_btn);
            this.getGold(true);
        }.bind(this));

        this.viewProp.m_now_get.on(Laya.Event.CLICK,this,function(){
            G_XiYouMgr.rolePanelOP("现在获取金币按钮");
            G_Tools.btnAction(this.viewProp.m_now_get);
            if(!this.moveEnd){
                return;
            }
          this.getGold(false);
           
            //G_PlayerInfo.changeDiam(this.tdiam);
            this.toNextView();
        }.bind(this));
        this.viewProp.m_reborn_btn.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_reborn_btn);
            this.stopTimer();
            G_Tools.shareOrAd(this.viewProp.m_reborn_btn,function(){
                this.reborn();
            }.bind(this),function(){
                this.continueTimer();
            }.bind(this),G_ShareScene.SS_REVIVE_BACK);
        }.bind(this));

        this.viewProp.m_to_skip.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_to_skip);
            if(!this.moveEnd){
                return;
            }
           
            this.toNextView();
        }.bind(this));

        this.nativeFlow=this.viewProp.m_flowAd.getComponent(NativeFlow);

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

    getGold(d){
        if(d){
            G_Tools.shareOrAd(this.viewProp.m_three_time_btn,function(){
                G_PlayerInfo.plusCoin((this.tGold+this.eGold)*3+G_GameMgr.gameGold*2);
                this.toNextView();
            }.bind(this),null,G_ShareScene.SS_DOUBLE_COIN);
        }else{
            G_PlayerInfo.plusCoin(this.tGold+this.eGold+G_GameMgr.gameGold);
        }
    }

    toNextView(){
        G_MainGui.closeUI(G_UIName.GameOverView);
        let data=new Object();
        data.closeFun=function(){
            G_MainGui.openUI(G_UIName.GameOverViewEnd,this.vals,null);
        }.bind(this);

        data.type=1;
        data.count=10;
        data.viewType=1;


        if(this.vals.isWin){
            if(G_MistakeHelp.getForeceSelect()&&G_AutoRecordVideo){
                G_CamreaRecordMgr.shareVideo();
            }
        }

        data.closeFun();
    }

    pageOpen(vals){
        super.pageOpen();
        this.vals=vals;
        this.showAd();
        let levelData=G_GameDB.getLevelConfigByID(vals.lvId);
        this.tGold=levelData.goldReward;//通关金币
        //this.tdiam=levelData.diamReward;//通关获得钻石
        this.eGold=G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_CONTINUE_OVER_LEVEL_GET_GOLD"]).num*G_PlayerInfo.getContinueLevelCount();
        this.continueTimer();
        this.setOver(vals.isWin);
        this.setAdBtnIcon();
        this.refershAdv();
        this.viewProp.m_succ_three_gold_count.text=(this.tGold+this.eGold)*3+G_GameMgr.gameGold*2;
    }



    showAd(){
        if(G_PlatHelper.isVIVOPlatform()){
            this.nativeFlow.showUI();
            this.nativeFlow.setAdShow();
        }else{
            this.nativeFlow.hideUI();
        }
    }

    addListerner(){
        super.addListerner();
        this.refershGold=function(){
            this.setGold();
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

    /**
     * 重生
     */
    reborn(){
        G_GameMgr.gameReborn();
        G_MainGui.closeUI(G_UIName.GameOverView);
    }

    /**
     * 暂停计时器
     */
    stopTimer(){
        this.isStopTimer=true;
    }

    /**
     * 继续计时器
     */
    continueTimer(){
        this.isStopTimer=false;
    }

    /**
     * 显示结束界面
     * @param {*} success 
     */
    setOver(success){
        this.viewProp.m_s_t_view.visible=success;
        this.viewProp.m_f_t_view.visible=!success;
        this.viewProp.m_s_b.visible=success;
        this.viewProp.m_f_b.visible=!success;
        this.viewProp.m_lv.text=G_GameDB.getUIWordByID(UIWordIDs["UIWORD_LEVEL_INDEX_PATTAN"]).word.format(this.vals.slvId);
        this.setBtnMove(success);
        if(success){
            this.viewProp.m_get_gold_label.text=(this.tGold+this.eGold+G_GameMgr.gameGold)//G_GameDB.getUIWordByID(UIWordIDs["UIWORD_GET_GOLD_TIPS"]).word.format(this.tGold);
            this.viewProp.m_tips.text=G_GameDB.getUIWordByID(UIWordIDs["UIWORD_CONTINE_THROUGHT_LEVEL_TIPS"]).word.format(this.eGold);
            //this.viewProp.m_get_diam_label.text="获得钻石+{0}".format(this.tdiam);
        }else{
            this.timerDownTimer=this.downTime;
            this.setTimerDownView(this.timerDownTimer);
            
            G_Scheduler.schedule("GameOver_Timer_Down",function(){
                if(this.isStopTimer){
                    return;
                }
                this.timerDownTimer--;
                this.setTimerDownView(this.timerDownTimer);
            }.bind(this),false,1000,11);

           
        }

        this.setGold();
    }

    /**
     * 设置按钮移动
     */
    setBtnMove(success){
        this.moveEnd=false;
        if(success){
            G_Tools.bottomDoMove(this.viewProp.m_now_get,400,245,function(move){
                if(!move){
                    G_Tools.playBtnShow(this.viewProp.m_now_get,null,G_BtnDoShowTime);
                }
                this.moveEnd=true;
            }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
        }else{
            G_Tools.bottomDoMove(this.viewProp.m_to_skip,400,245,function(move){
                if(!move){
                    G_Tools.playBtnShow(this.viewProp.m_to_skip,null,G_BtnDoShowTime);
                }
                this.moveEnd=true;
            }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
        }
       
    }

    setAdBtnIcon(){
        G_Tools.setAdBtnIcon(this.viewProp.m_reborn_btn);
        G_Tools.setAdBtnIcon(this.viewProp.m_three_time_btn);
    }

    setImgPercent(percent){//设置百分比
        let maskImg = this.viewProp.m_timerDown_icon;
         if (maskImg) {
             if (percent > 0) {
                 if (!maskImg.mask) {
                     maskImg.mask = new Laya.Sprite()
                 }
                 maskImg.mask.graphics.clear()
                 maskImg.mask.graphics.drawPie(maskImg.width / 2, maskImg.height / 2, maskImg.width / 2, 360 * percent - 90, 270, "#ffffff")
             }
             else {
                 maskImg.mask = null
             }
         }
    }

    setTimerDownView(time){
        let percent=(this.downTime-time)/this.downTime;
        this.viewProp.m_down_timer.text=time;
        this.setImgPercent(percent);

        if(time<=0){
            this.clearTimer();
            this.toNextView();
        }
    }

    clearTimer(){
        G_Scheduler.unschedule("GameOver_Timer_Down");
    }

    pageClose(){
        super.pageClose();
        this.clearTimer();
    }

    setGold(){
        this.viewProp.m_gold_count.text=G_PlayerInfo.getCoin();
        this.viewProp.m_gold_count.value=G_PlayerInfo.getCoin();
    }

    addListerner(){
        super.addListerner();
        this.setGoldFun=function(){
            this.setGold();
        }.bind(this);
        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);
        
    }

    removeListerner(){
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);
    }


}