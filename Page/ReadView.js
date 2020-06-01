import PageBase from "../UIFrame/PageBase";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr";

export default class ReadView extends PageBase {

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.isShowLoadingPage=false;
        this.showMore=true;
        this.showBanner=false;

    
    }
    
    pageInit(){
        super.pageInit();

        if(G_PlatHelper.isWXPlatform()||G_PlatHelper.isWINPlatform()){
            if(this.adObj){
                this.adObj.num=1;
            }
        }else if(G_PlatHelper.isOPPOPlatform()){
            if(qg&&qg.reportMonitor){
                qg.reportMonitor('game_scene', 0)
            }
        }else{
            this.adObj.num=2;
        }

    

        this.viewProp.m_btn_setting.on("click", null, function () {
            this.onSettingTouched(this.viewProp.m_btn_setting);
            G_XiYouMgr.rolePanelOP("主界面设置按钮");
        }.bind(this));

        this.viewProp.m_tips_start.on("click",this,function(){
           G_Tools.btnAction(this.viewProp.m_btn_start);
            G_XiYouMgr.rolePanelOP("开始按钮");
            if(this.isShowLoadingPage){//已经在加载
                return;
            }

            if(!G_MapMgr.isReady()){
                this.isShowLoadingPage=true;
                let obj=new Object();
                obj.loadingEndCallBack=function(){
                    this.gameStart();
                    this.isShowLoadingPage=false;
                }.bind(this);
                G_MainGui.openUI(G_UIName.LodingView,obj,null);
            }else{
                this.gameStart();
            }
          
        })

        this.viewProp.m_power_add_btn_icon.on(Laya.Event.CLICK,this,function(){
            G_MainGui.openUI(G_UIName.GetPowerView);
            G_Tools.btnAction(this.viewProp.m_power_add_btn_icon);
            G_XiYouMgr.rolePanelOP("主界面获得体力按钮");
        });

        this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK,this,function(){
            G_XiYouMgr.rolePanelOP("主界面添加金币按钮");
            G_Tools.btnAction(this.viewProp.m_gold_add_btn_icon);
            G_MainGui.openUI(G_UIName.GetGoldView,null,null);
        });

     
        // this.viewProp.m_skin_btn_icon.on(Laya.Event.CLICK,this,function(){
        //     G_Tools.btnAction(this.viewProp.m_skin_btn_icon);
        //     G_MainGui.openUI(G_UIName.SkinView,null,null);
        //    // G_Tools.showToast("UIWORD_ID_NOT_FINISHED_YET");
        //     G_XiYouMgr.rolePanelOP("皮肤界面按钮");
        // });

   
        // this.viewProp.m_sgin_btn_icon.on(Laya.Event.CLICK,this,function(){
        //     G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        //     G_UIHelper.playBtnTouchAction(this.viewProp.m_sgin);
        //    // G_Tools.showToast("UIWORD_ID_NOT_FINISHED_YET");
        //     G_MainGui.openUI(G_UIName.SginView,null,null);
        //     G_XiYouMgr.rolePanelOP("签到按钮");
        // });
    
        // this.viewProp.m_turntable.on(Laya.Event.CLICK,this,function(){
        //     G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        //     G_UIHelper.playBtnTouchAction(this.viewProp.m_sgin);
        //    // G_Tools.showToast("UIWORD_ID_NOT_FINISHED_YET");
        //     G_MainGui.openUI(G_UIName.TurntableView,null,null);
        //     G_XiYouMgr.rolePanelOP("转盘按钮");
        // })
    }


    closeAdAnim(){
        
        //G_Scheduler.unschedule("scale_ad_btn");
        G_Scheduler.unschedule("Delay_Auto_Scale_startTip");
    }

    addListerner(){
        super.addListerner();
    
        this.refershGold=function(){
            this.setGold();
        }.bind(this);

        this.refershPower=function(){
            this.setPower();
        }.bind(this);

        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.refershGold);
        G_Event.addEventListerner(G_EventName.EN_POWER_CHANGED,this.refershPower);
    }

    removeListerner(){
        super.removeListerner();
        G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.refershGold);
        G_Event.removeEventListerner(G_EventName.EN_POWER_CHANGED,this.refershPower);
    }


    gameStart(){
        // if(!G_Tools.canUseItem(2,5)){

        //     return;
        // }
        // G_PlayerInfo.usePower(2);
        G_MainGui.closeUI(G_UIName.ReadyView);
        
        let endFun=function(){
            G_GameMgr.gameStart(function(){
                G_MainGui.openUI(G_UIName.GameView);
             });
        }

        endFun();


    //     let useSkinFun=function(){
    //         let skinData=this.getRandomSkidId();
    //         let trySkinId=skinData.skinId;
    
    //         let canUse=true;
    //         if(G_PlatHelper.isVIVOPlatform()&&!G_MistakeHelp.getIsOpenId()){
    //             canUse=false;
    //         }

    //         if(trySkinId&&canUse){
    //             let obj=new Object();
    //             obj.closeFun=function(ch){
    
    //                 if(ch){
    //                     let skinId=null;
    //                     if(skinData.type==1){//1为人物试用
    //                         skinId=trySkinId;
    //                     }else if(skinData.type==2){//不是就用默认皮肤
    //                         skinId=G_PlayerInfo.getSkinId();
    //                         G_TempStaffId=skinData.skinId;
    //                     }else{
    //                         skinId=G_PlayerInfo.getSkinId();
    //                     }
    //                     G_MapMgr.changePlayer(function(){
    //                         endFun();
    //                     },skinId);
    //                 }else{
    //                     endFun();
    //                 }
    //             };
    //             obj.showSkinId=trySkinId;
    //             obj.showType=skinData.type;
    //             G_MainGui.openUI(G_UIName.TryUseSkinView,obj,null);
    //         }else{
    //             endFun();
    //         }
    //     }.bind(this)
    //    let obj=new Object();
    //    obj.checkEnd=function(){
    //        useSkinFun();
    //    }
    //    obj.checkEnd();
    }

    setLv(){
        //this.viewProp.m_lv.text= G_GameDB.getUIWordByID(UIWordIDs["UIWORD_LEVEL_INDEX_PATTAN"]).word.format(G_PlayerInfo.getShowLevelCount());
    }
   
     /**
     * 设置
     */
    onSettingTouched( btn ) {
        let vals={
            closeCb:null,
            viewType:1
        }
        G_MainGui.openUI(G_UIName.PopupView,vals,function(pageBase){
            
        });

        G_Tools.btnAction(btn);
    }

    pageOpen(val){
        super.pageOpen(val);
        this.setGold();
        this.setLv();
        this.animPlay();
        this.setPower();
        this.setAdBtn();
        //this._showGetNextPowerTime();
        //this.openTween(); 
    }
 

    setAdBtn(){
        // G_Tools.setAdBtnIcon(this.viewProp.m_bullet_hurt_ad);
        // G_Tools.setAdBtnIcon(this.viewProp.m_bullet_rate_ad);
    }

   
 
    animPlay(){
     let startTip=this.viewProp.m_tips_start;
     let doScale = function ( delay = 1000 ) {
         if(!startTip||startTip.destroyed){
             G_Scheduler.unschedule("Delay_Auto_Scale_startTip");
             return;
         }
         G_Scheduler.schedule("Delay_Auto_Scale_startTip", function () {
             G_UIHelper.playBtnTouchAction(startTip, doScale, 1, 1.1, 8)
         }, false, delay, 0)
     }
 
     doScale();
    }
 
   
    pageClose(){
        super.pageClose();
        this.closeAdAnim();
        if(G_PlatHelper.isOPPOPlatform()){
            if(!this.showBanner){
           
                this.adObj.num=2;
                this.showBanner=true;
            }
          }

    }
 
    setGold(){
        this.viewProp.m_gold_count.text=G_PlayerInfo.getCoin();
        this.viewProp.m_gold_count.value=G_PlayerInfo.getCoin();
    }

    setPower(){
        this.viewProp.m_power_count.text=G_PlayerInfo.getPower();

        let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num;

        if(G_PlayerInfo.getPower()>=maxPower){
            this._hideGetNextPowerTime();
        }

    }

    //体力
    restorePowerFromDeltaTime( deltaTime ) {
        if (deltaTime > 0) {
            let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num
            let maxCanRestorePower = maxPower - G_PlayerInfo.getPower()
            if (maxCanRestorePower > 0) {
                let needTime = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NEED_TIME_TO_RESTORE_POWER"]).num
            
                if (deltaTime >= needTime) {
                    let canRestorePower = Math.floor(deltaTime / needTime)

                    if (canRestorePower <= maxCanRestorePower) {
                        G_PlayerInfo.addPower(canRestorePower, true)
                        console.log("Restore {0} Power From {1} DeltaTime".format(canRestorePower.toString(), deltaTime.toString()))
                    }
                    else {
                        G_PlayerInfo.addPower(maxCanRestorePower, true)
                        console.log("Restore {0} Power From {1} DeltaTime".format(maxCanRestorePower.toString(), deltaTime.toString()))
                    }
                }
            }
        }
    }


    _updateGetNextPowerTime() {
        if (this.viewProp.m_power_recover_tips) {
            let lastGetPowerTime = G_PlayerInfo.getLastGetPowerTime()
            let needTime = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_NEED_TIME_TO_RESTORE_POWER"]).num

            // update ui
            let stillNeedTime = needTime - (Math.floor(G_ServerInfo.getServerTime() / 1000) - lastGetPowerTime)
            if (stillNeedTime === 0) {
                let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num
                if (maxPower - G_PlayerInfo.getPower() > 1) {
                    stillNeedTime = needTime
                }
            }
            this.viewProp.m_power_recover_tips.text = G_Utils.convertSecondToHourMinuteSecond(stillNeedTime, true)

            // check can restore or not
            let passedTime = Math.floor(G_ServerInfo.getServerTime() / 1000) - lastGetPowerTime
            if (passedTime >= needTime) {
                this.restorePowerFromDeltaTime(passedTime)
            }
        }
    }

    _showGetNextPowerTime() {
        if (this.viewProp.m_power_recover_bg) {
            this.viewProp.m_power_recover_bg.visible = true
        }

        if (!G_Scheduler.isScheduled("Auto_Update_Get_Next_Power_Time")) {
            // update first
            this._updateGetNextPowerTime()

            let power = G_PlayerInfo.getPower()
            let maxPower = G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_MAX_POWER_NUM"]).num
            if (power < maxPower) {
                G_Scheduler.schedule("Auto_Update_Get_Next_Power_Time", function () {
                    this._updateGetNextPowerTime()
                }.bind(this), false, 1000)
            }else{
                this._hideGetNextPowerTime();
            }
        }
    }

    _hideGetNextPowerTime() {
        if (this.viewProp.m_power_recover_bg) {
            this.viewProp.m_power_recover_bg.visible = false
        }

        G_Scheduler.unschedule("Auto_Update_Get_Next_Power_Time")
    }

    /**
     * 拿到随机的皮肤使用type 1.人物皮肤 2.推杆皮肤
     */
    getRandomSkidId(){
        let types=[1,2];
         //拿到随机id
        

         let trySkinId=G_GameMgr.getRandomSkinId();
         let tryStaffSkinId=null;//G_GameMgr.getRandomStaffSkinId();
        let obj=new Object();
         if(!trySkinId&&!tryStaffSkinId){//没有皮肤试用
             obj.type=null;
             obj.skinId=null;
             return obj;
         }else if(!trySkinId){//推杆试用
            obj.type=2;
            obj.skinId=tryStaffSkinId;
            return obj;
         }else if(!tryStaffSkinId){//人物皮肤试用
            obj.type=1;
            obj.skinId=trySkinId;
            return obj;
         }else{//随机试用
            let num=Math.floor(Math.random()*(types.length-0.1));
            let type=types[num];

            if(type==1){
                obj.type=1;
                obj.skinId=trySkinId;
                return obj;
            }else if(type==2){
                obj.type=2;
                obj.skinId=tryStaffSkinId;
                return obj;
            }
         }

         return obj;
    }
}