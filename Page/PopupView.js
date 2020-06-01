import PageBase from "../UIFrame/PageBase";

export default class PopupView extends PageBase {

    constructor() { 
        super(); 
        this._closeCb=null;
        this.viewType=0;//1为设置
        this.closeBtn=null;
    }

    pageInit(){
        super.pageInit();
        this.initAllPopups();
        window.sgin="fsdjhfsjadf54545idnid你的e";
    }
    
    showSetting(){
        this.hideAllPopups();
        G_UIManager.showUI("setting", () => {
            G_MainGui.closeUI(G_UIName.PopupView);
        })
    }

    showMoreGame(){
        this.hideAllPopups();
        G_UIManager.showUI("moreGameAd", () => {
            G_MainGui.closeUI(G_UIName.PopupView);
        })
    }

    pageOpen(vals){
        this.viewType=vals.viewType;
        if(this.viewType==2){
            this.adObj=null;
        }else{
            this.adObj=new Object();
            this.adObj.num=2;
        }
        super.pageOpen(vals);
        this.closeCb=vals.closeCb;
        
        this.refershView();
        window.sgin="fsfdsfds455235我的";
    }

    refershView(){
        window.sgin="中方年南京师大发了点上课了；fak";
        switch(this.viewType){
            case 1:
            this.showSetting();
            break;
            case 2:
            this.showMoreGame();
            break;
        }
    }
    pageClose(){
        super.pageClose();
        G_Tools.handlerFun(this.closeCb);
    }

    hideAllPopups(){
    }

    initAllPopups(){
    }
}