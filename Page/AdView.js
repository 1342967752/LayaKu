import PageBase from "../UIFrame/PageBase";
import AdvLoadMgr from "../../game/ctrl/AdvLoadMgr";

export default class AdView extends PageBase {

    constructor() { 
        super(); 
        this.showAdType=0;
        this.isPartPage=true;
        this.isAutoDestroy=false;
    }
    

    pageInit(){
        window.sgin="dsfjsalkdfjsadlfadjfsa35656asdfjksadjfk";
        super.pageInit();
        this.viewProp.m_moreGameBtn.on(Laya.Event.CLICK,this,function(){
            if(G_PlatHelper.isQQPlatform()){
                G_PlatAction.cretaeBoxAd();
            }else{
                  let obj=new Object();
                obj.viewType=2;
                G_MainGui.openUI(G_UIName.PopupView,obj,null);
            }
          

        });

        
    }

   
   pageOpen(vals){
       super.pageOpen(vals);
        //动画
        let moreGameBtn=this.viewProp.m_moreGameBtn;
        let doScale = function ( delay = 2000 ) {
            if(!moreGameBtn||moreGameBtn.destroyed){
                G_Scheduler.unschedule("Delay_Auto_Scale_moreGameBtn");
                return;
            }
            G_Scheduler.schedule("Delay_Auto_Scale_moreGameBtn", function () {
                G_UIHelper.playBtnTouchAction(moreGameBtn, doScale, 1, 1.1, 8)
            }, false, delay, 0)
        }

        doScale();
   }

   showMoreBtn(show){

    if(!G_MistakeHelp.getIsExportAdvEnabled()){
        this.viewProp.m_moreGameBtn.visible=false;
        return;
    }

    if(G_PlatHelper.isVIVOPlatform()){
        this.viewProp.m_moreGameBtn.visible=false;
    }else{
        this.viewProp.m_moreGameBtn.visible=show;
    }

   }

   pageClose(){
       super.pageClose();
       this.setBottomType(3,0,null);
       G_Scheduler.unschedule("Delay_Auto_Scale_moreGameBtn");
   }

   setBottomType(num,delay,endFun,offectBottom){//底部的显示类型
    window.sgin="飞洒的机会撒打开房间卡拉斯的";
    this.showAdType=num;
    let bottomIcon=this.viewProp.m_bottomAdIcon;
    let bottomList=this.viewProp.m_bottomList;
    
    if(!delay){
        delay=0;
    }

    if(!offectBottom){
        offectBottom=0;
    }

    //摧毁之前的广告
    bottomIcon.visible=false;
    bottomList.visible=false;
    G_Tools.hintBanner();
    G_Event.dispatchEvent(G_EventName.EN_HIDE_BANNER_AD);
    if(this.showAdType==1){//刷新广告
        bottomList.visible=true;
        let advLoadMgr = bottomList.getComponent(AdvLoadMgr)
            if (advLoadMgr) {
                advLoadMgr.refreshAdv()
            }
        G_Tools.handlerFun(endFun);
    }else if(this.showAdType==2){//创建banner



        G_Tools.createBanner(function(){//创建失败判断显示banner
            if(this.showAdType==2){

                let advLoadMgr = bottomIcon.getComponent(AdvLoadMgr);//先刷新广告
                if (advLoadMgr) {
                    advLoadMgr.refreshAdv()
                }

                bottomIcon.visible=true;
            }else{
                bottomIcon.visible=false;
            }
            G_Tools.handlerFun(endFun);
        }.bind(this),function(){
            let fullView=G_MainGui.getPageByName(G_UIName.AdFullView);
            if(this.showAdType==2&&(!this.fullView||!this.fullView.isOpen)){//创建成功判断显示banner
                G_Adv.showBannerAdv();
            }else{
                G_Adv.hideBannerAdv();
            }
            G_Tools.handlerFun(endFun);
        }.bind(this),offectBottom);
        window.sgin="发生大家可发的撒开了就发来撒";

    }
}

}