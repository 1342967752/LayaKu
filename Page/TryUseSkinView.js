import PageBase from "../UIFrame/PageBase";

export default class TryUseSkinView extends PageBase{

    constructor() { 
      super();
      this.closeFun=null;
      this.showSkinId=null;
      this.model=null;
      this.modelCrl=null;
      this.adObj=new Object();
      this.adObj.num=2;
      this.canClick=true;
      this.showType=1;
      this.isNeedTween=true;
    }
    
    pageInit(){
        super.pageInit();


        this.viewProp.m_try_btn.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_try_btn);
            this.freeUseSkin();
            G_XiYouMgr.rolePanelOP("试用皮肤按钮");
        });

        this.viewProp.m_cancel.on(Laya.Event.CLICK,this,function(){
            if(!this.canClick){
                return;
            }
            G_Tools.btnAction(this.viewProp.m_cancel);
            this.cleseThis(false);
            G_XiYouMgr.rolePanelOP("取消试用皮肤按钮按钮");
        });

        this.viewProp.m_wanted.on(Laya.Event.CLICK,this,function(){
            G_ShowWantdUseSkin=!G_ShowWantdUseSkin;
            G_Tools.btnAction(this.viewProp.m_wanted);
            this.refershWantedView();
        });
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.canClick=false;
        this.closeFun=vals.closeFun;
        this.showSkinId=vals.showSkinId;
        this.showType=vals.showType;
        this.refsershView();
    }

    pageClose(){
        super.pageClose();
        //G_MapMgr.hintModel();
    }



    refsershView(){
        
        
        this.showModel();
        G_Tools.setAdBtnIcon(this.viewProp.m_try_btn);
        this.refershWantedView();
        
        G_Tools.bottomDoMove(this.viewProp.m_cancel,Laya.stage.height-100,Laya.stage.height/2+343,function(val){
            if(!val){
                G_Tools.playBtnShow(this.viewProp.m_cancel,null,G_BtnDoShowTime);
            }
            this.canClick=true;
            
        }.bind(this),G_BtnDelayTime,G_BrnMoveTimer);
    }

    showModel(){
        let skinData=null;
        if(this.showType==1){
            this.viewProp.m_tips.skin="game/skin/skin_tips02.png";
            this.viewProp.m_title.skin="game/skin/skin_title.png";
            //this.viewProp.m_tips01.skin="game/skin/skin_tips04.png";
           skinData= G_GameDB.getSkinConfigByID(this.showSkinId);
        }else if(this.showType==2){
            this.viewProp.m_tips.skin="game/skin/skin_tips01.png";
            this.viewProp.m_title.skin="game/skin/staff_title.png";
            //this.viewProp.m_tips01.skin="game/skin/skin_tips03.png";
            skinData=G_GameDB.getStaffSkinConfigByID(this.showSkinId);
        }
        
        this.showIcon(skinData.icon);
        // let playerData=G_GameDB.getPlayerConfigByID(skinData.playerId);
        // if(playerData.attrTips=="0"){
        //     this.viewProp.m_skin_tips.text="";
        // }else{
        //     this.viewProp.m_skin_tips.text=playerData.attrTips;
        // }
        
        // let asset=[];
        // if(playerData){
        //     let playerName=G_ResPath.resPath.format(playerData.model);
        //     asset.push(playerName);
        //     G_NodePoolMgr.preload(asset,function(){
        //         if(!this||!this.owner||this.owner.destroyed){
        //             return;
        //         }
        //         let player=G_NodePoolMgr.getNode(playerName);

        //         G_MapMgr.setShowModel(player,this.owner.zOrder,2,playerData);
        //         G_Tools.resetTransform(player);
        //     }.bind(this));
        // }
    }

    showIcon(name){
        this.viewProp.m_skin_icon.visible=false;
        this.viewProp.m_staff_skin.visible=false;
        if(this.showType==1){
            this.viewProp.m_skin_icon.skin="game/skin/icon/{0}.png".format(name);
            this.viewProp.m_skin_icon.visible=true;
        }else if(this.showType==2){
            this.viewProp.m_staff_skin.skin="game/skin/icon/{0}.png".format(name);
            this.viewProp.m_staff_skin.visible=true;
        }
        
    }

    cleseThis(succ){
        G_Tools.handlerFun(this.closeFun,succ);
        G_MainGui.closeUI(G_UIName.TryUseSkinView);
    }

    
    refershWantedView(){
        this.viewProp.m_show.visible=!G_ShowWantdUseSkin;
    }

    /**
   * 免费试用
   */
  freeUseSkin(){
    G_Tools.shareOrAd(this.viewProp.m_try_btn,function(){
        this.cleseThis(true);
    }.bind(this),function(){
        this.cleseThis(false);
    }.bind(this),G_ShareScene.SS_FREE_TRY);

    }
}