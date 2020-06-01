import PageBase from "../UIFrame/PageBase";

export default class GetGoldView extends PageBase {

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.adObj.num=2;
        this.getCount=G_GameDB.getBaseConfigByID(BaseConfigIDs["BC_SHOW_AD_GET_GOLD"]).num;
        this.isNeedTween=true;
    }
    
    pageInit(){
        super.pageInit();
        this.viewProp.m_get_btn.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_get_btn);
            this.freeGetGold();
        });

        this.viewProp.m_close.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_close);
            G_MainGui.closeUI(G_UIName.GetGoldView);
        })
    }


    pageOpen(vals){
        super.pageOpen(vals);
        G_Tools.setAdBtnIcon(this.viewProp.m_get_btn);
        this.setGold();
    }

    setGold(){
        this.viewProp.m_count.text=this.getCount;
    }


    freeGetGold(){
        G_Tools.shareOrAd(this.viewProp.m_get_btn,function(){
            G_PlayerInfo.plusCoin(this.getCount);
            G_MainGui.closeUI(G_UIName.GetGoldView);
            G_Tools.showToast("UIWORD_ID_GET_GOLD_WANTED",this.getCount);
        }.bind(this),null,G_ShareScene.SS_GET_COIN)
    }

}