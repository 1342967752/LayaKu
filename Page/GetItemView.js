import PageBase from "../UIFrame/PageBase"
export default class GetItemView extends PageBase {

    constructor() { 
        super(); 
        this.getGold=100;
        this.adObj=new Object();
        this.adObj.num=2;
        this.canClick=true;
        this.closeFun=null;
        this.isNeedTween=true;
        this.type=1;
    }
    
   pageInit(){
       super.pageInit();
       this.viewProp.m_n_get.on(Laya.Event.CLICK,this,function(){
        G_Tools.btnAction(this.viewProp.m_n_get);
           if(!this.canClick){
               return;
           }
           this.toGetGold(false);
       });


       this.viewProp.m_d_get.on(Laya.Event.CLICK,this,function(){
        G_Tools.btnAction(this.viewProp.m_d_get);
        G_Tools.shareOrAd(this.viewProp.m_d_get,function(){
            this.toGetGold(true);
        }.bind(this),function(){

        }.bind(this),G_ShareScene.SS_DOUBLE_COIN);
       });

   }

   toGetGold(d){
    let gold=this.getGold;
    if(d){
        
         gold*=2;
         
    }
        G_PlayerInfo.plusCoin(gold);
        G_WXHelper.showToast("获得钻石X"+gold);
        G_MainGui.closeUI(G_UIName.GetItemView);
    }

    pageOpen(vals){
        super.pageOpen(vals);
        G_Tools.setAdBtnIcon(this.viewProp.m_d_get);
        if(vals){
            this.closeFun=vals.closeFun;
        }else{
            this.closeFun=null;
        }
        this.type=vals.type;
        this.getGold=vals.count;

        this.canClick=false;
        G_Tools.bottomDoMove(this.viewProp.m_n_get,Laya.stage.height-100,Laya.stage.height/2+320,function(val){
         if(!val){
             G_Tools.playBtnShow(this.viewProp.m_n_get,null,G_BtnDoShowTime);
         }
         this.canClick=true;
     }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
    }

    pageClose(){
        super.pageClose();
        G_Tools.handlerFun(this.closeFun);
        this.closeFun=null;

    }
}