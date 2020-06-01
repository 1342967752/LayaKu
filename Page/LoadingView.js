import PageBase from "../UIFrame/PageBase";

export default class LoadingView extends PageBase {

    constructor() { 
        super(); 
        this.isStart=false;
        this.loadingEndCallBack=null;

        this.addDiamCount=0;
        this.lastAddTime=0;
    }
    
    pageOpen(vals){
        window.sgin="范德萨发见撒旦开了房间开始打了飞机撒旦了房间卡死啦地方加快";
        super.pageOpen(vals);
        this.loadingEndCallBack=vals.loadingEndCallBack;
        this.showLoading();
        this.addDiamCount=0;
        this.lastAddTime=0;
    }

    pageClose(){
        super.pageClose();
        this.endAnim();
    }

    onUpdate(){
        if(this.isStart){
            if(G_MapMgr&&G_MapMgr.isReady()){
                this.isStart=false;
                G_Tools.handlerFun(this.loadingEndCallBack);
                G_MainGui.closeUI(G_UIName.LodingView);
            }

            if(Laya.timer.currTimer-this.lastAddTime>300){
                this.lastAddTime=Laya.timer.currTimer;
                this.addDiamCount++;

                if(this.addDiamCount>3){
                    this.addDiamCount=0;
                }
                this.viewProp.m_loading_tip.text="加载中";

                for(var i=0;i<this.addDiamCount;i++){
                    this.viewProp.m_loading_tip.text+=".";
                }
            }

           
            
        }
    }

    endAnim(){
        G_Scheduler.unschedule("ratation_ball_01");
    }

    showLoading(){
        this.isStart=true;
        G_Scheduler.schedule("ratation_ball_01",function(){
            this.viewProp.m_icon.rotation+=5;
        }.bind(this),true,1,G_Const.C_SCHEDULE_REPEAT_FOREVER);
    }
}