import SkinItem from "../item/SkinItem";
import PageBase from "../UIFrame/PageBase";

export default class SkinView extends PageBase {

    constructor() { 
        super(); 
        this.adObj=new Object();
        this.adObj.num=2;
        this.curSelectId=null;
        this.smask=null;
        this.curTopId=-1;//顶部页面id
        this.showMore=false;
    }
    
   pageInit(){
       super.pageInit();
       this.viewProp.m_close.on(Laya.Event.CLICK,this,function(){
        G_UIHelper.playBtnTouchAction(this.viewProp.m_close);
            G_MainGui.closeUI(G_UIName.SkinView);
            G_SoundMgr.playSound(G_SoundName.SN_CLICK)
       });

       this.viewProp.m_unLock_btn.on(Laya.Event.CLICK,this,function(){

           this.buySkin();
           G_Tools.btnAction(this.viewProp.m_unLock_btn);
       });

       this.viewProp.m_gold_add_btn_icon.on(Laya.Event.CLICK,this,function(){
        G_MainGui.openUI(G_UIName.GetGoldView,null,null);
        G_Tools.btnAction(this.viewProp.m_gold_add_btn_icon);
        });

        this.viewProp.m_staff_btn.on(Laya.Event.CLICK,this,function(){
                this.topSelect(2);
                G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        });

        this.viewProp.m_player_btn.on(Laya.Event.CLICK,this,function(){
                this.topSelect(1);
                G_SoundMgr.playSound(G_SoundName.SN_CLICK)
        });

        this.viewProp.m_sgined.on(Laya.Event.CLICK,this,function(){
            //G_MainGui.openUI(G_UIName.SginView);
            G_Tools.btnAction(this.viewProp.m_sgined);
        });

        this.viewProp.m_skinList.renderHandler=new Laya.Handler(this, this.renderHandler);
   }

   renderHandler(cell,index){
    this.cellInit(cell);
    let data=this.viewProp.m_skinList.getItem(index);
    let type=data.type;
    let skinMgr=cell.getComponent(SkinItem);
    skinMgr.setType(type);
    let skinId=data.index;

    if(type==1){
        let skinData=G_GameDB.getSkinConfigByID(skinId);
       
        skinMgr.setData(skinData);
        skinMgr.setLock(!G_PlayerInfo.hasSkinById(skinMgr.skinData.id));
        skinMgr.setSelect(skinMgr.skinData.id==this.curSelectId);
        skinMgr.setDontOpen(skinMgr.skinData.isOpen!=1);
        skinMgr.setUsed(G_PlayerInfo.getSkinId()==skinMgr.skinData.id);
       
    }else if(type==2){
        let skinData=G_GameDB.getStaffSkinConfigByID(skinId);
        skinMgr.setData(skinData);
        skinMgr.setLock(!G_PlayerInfo.hasStaffSkinById(skinMgr.skinData.id));
        skinMgr.setSelect(skinMgr.skinData.id==this.curSelectId);
        skinMgr.setDontOpen(skinMgr.skinData.isOpen!=1);
        skinMgr.setUsed(G_PlayerInfo.getStaffSkinId()==skinMgr.skinData.id);
      
    }

    

   }

   pageOpen(vals){
       super.pageOpen(vals);
        this.setGold();
        //this.setDaim();
       // G_MainGui.hintAllUI(this.pageName);
        this.topSelect(1);
        
        
       G_XiYouMgr.enterRoleView();

   }


   scorllToItem(type){
       let index=1;
    if(type==1){

        index=G_PlayerInfo.getSkinId();
       
    }else if(type==2){
        index=G_PlayerInfo.getStaffSkinId();
       
    }

    this.viewProp.m_skinList.scrollTo(index-1);
   }

   insertList(type){
    let data=[];
    let skinDatas=0;
       if(type==1){
        skinDatas=G_GameDB.getAllSkinConfigs();
        
       }else if(type==2){
        skinDatas=G_GameDB.getAllStaffSkinConfigs();
       }
       
       for(var i=0;i<skinDatas.length;i++){
      
            data.push({index:skinDatas[i].id,type:type});
       }

       this.viewProp.m_skinList.array=data;
      // this.viewProp.m_skinList.vScrollBarSkin="";
   }

 


   /**
    * 顶部按钮选择
    * @param {*} type 
    */
   topSelect(type){
       this.insertList(type);
      
        this.curTopId=type;
        let skinMgr=new Object();
        skinMgr.type=type;
        if(type==1){
            this.viewProp.m_player_btn.skin="game/skin/onglet_on.png";
            this.viewProp.m_staff_btn.skin="game/skin/onglet_off.png";
            this.curSelectId=G_PlayerInfo.getSkinId();

              //模拟一份数据
          
            skinMgr.skinData=G_GameDB.getSkinConfigByID(this.curSelectId);
        }else if(type==2)
        {
            this.viewProp.m_staff_btn.skin="game/skin/onglet_on.png";
            this.viewProp.m_player_btn.skin="game/skin/onglet_off.png";
            this.curSelectId=G_PlayerInfo.getStaffSkinId();
            skinMgr.skinData=G_GameDB.getStaffSkinConfigByID(this.curSelectId);
        }

        this.skinClick(skinMgr,true)
        
   }

   pageClose(){
       super.pageClose();
      // G_MainGui.showAllUI();
      // G_MapMgr.hintModel();
       G_MapMgr.changePlayer(null,G_PlayerInfo.getSkinId());
   }


   addListerner(){
       super.addListerner();
       this.setGoldFun=function(){
        this.setGold();
        }.bind(this);

        // this.refershDiam=function(){
        //     this.setDaim();
        // }.bind(this);

        //G_Event.addEventListerner(G_EventName.EN_DIAM_CHANGE,this.refershDiam);
        G_Event.addEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);

   }

   removeListerner(){
       super.removeListerner();
      // G_Event.removeEventListerner(G_EventName.EN_COIN_CHANGED,this.setGoldFun);
       G_Event.removeEventListerner(G_EventName.EN_DIAM_CHANGE,this.refershDiam);
   }

   cellInit(cell){
    let skinMgr=cell.getComponent(SkinItem);
    if(!skinMgr){
        skinMgr=cell.addComponent(SkinItem);
        skinMgr.init();
        skinMgr.setSkinOnClick(function(sm){
            this.skinClick(skinMgr,false);
        }.bind(this))
    }

   }


   refershSkin(type){
        this.viewProp.m_skinList.refresh();
        
   }

   skinClick(skinMgr,scrollTo){

      
       if(skinMgr.type==1){
        let skinId=skinMgr.skinData.id;
        let has=G_PlayerInfo.hasSkinById(skinId);
        let isOpen=skinMgr.skinData.isOpen;
        if(isOpen==1){
            if(has){
                G_PlayerInfo.setCurSelectSkinId(skinId);
               // this.setBottom(true,0,0);
            }else{
                // let temp=skinMgr.skinData.unLockCount.split('&');
                // this.setBottom(true,temp[1],parseInt(temp[0]));
            }
    
        }else{
            //this.setBottom(false,0,1);
        }
       
        this.curSelectId=skinMgr.skinData.id;
        let skinPath=G_ResPath.skinPath.format(skinMgr.skinData.icon);
        this.viewProp.m_skin.skin=skinPath;
        if(!isOpen){
            
        }else{
            
            // let playerData=G_GameDB.getPlayerConfigByID(skinMgr.skinData.playerId);
            // let asset=[];
            // if(playerData){
            //     let playerName=G_ResPath.resPath.format(playerData.model);
            //     asset.push(playerName);
            //     G_NodePoolMgr.preload(asset,function(){
            //         if(!this||!this.owner||this.owner.destroyed||!this.isOpen){
            //             return;
            //         }
            //         let player=G_NodePoolMgr.getNode(playerName);
                    
            //     G_MapMgr.setShowModel(player,this.owner.zOrder,1,1);
            //     }.bind(this));
            // }
        }
       }else if(skinMgr.type==2){
        let skinId=skinMgr.skinData.id;
        let has=G_PlayerInfo.hasStaffSkinById(skinId);
        let isOpen=skinMgr.skinData.isOpen;
        if(isOpen==1){
            if(has){
                G_PlayerInfo.setCurSelectStaffSkinId(skinId);
               // this.setBottom(true,0,0);//已经获得
            }else{
                // let temp=skinMgr.skinData.unLockCount.split('&');
                // this.setBottom(true,temp[1],parseInt(temp[0]));
            }
    
        }else{
           // this.setBottom(false,0,1);//未开放
        }
      
        this.curSelectId=skinMgr.skinData.id;
        //let skinPath=G_ResPath.skinPath.format(skinMgr.skinData.icon);

        if(!isOpen){
            
        }else{
            let playerName=G_ResPath.resPath.format(skinMgr.skinData.name);
            let asset=[];
                asset.push(playerName);
                G_NodePoolMgr.preload(asset,function(){
                    if(!this||!this.owner||this.owner.destroyed||!this.isOpen){
                        return;
                    }
                    let player=G_NodePoolMgr.getNode(playerName);
                    G_MapMgr.setShowModel(player,this.owner.zOrder,1,2);
                }.bind(this));
        }
       }

       this.refershSkin(skinMgr.type);
      this.refershBottom(skinMgr.skinData.id,skinMgr.type);
      if(scrollTo){
        this.scorllToItem(skinMgr.type);
      }
   }

   /**
    * 买皮肤
    * @param {*} skinMgr 
    */
   buySkin(){

        let skinData=null;

        if(this.curTopId==1){
            skinData=G_GameDB.getSkinConfigByID(this.curSelectId);
        }else if(this.curTopId==2){
            skinData=G_GameDB.getStaffSkinConfigByID(this.curSelectId);
        }

        if(!skinData){
            G_Tools.error("没有该皮肤数据:",this.curSelectId);
            return;
        }


        let getFun=function(){
            if(this.curTopId==1){

                G_PlayerInfo.addSkin(this.curSelectId);
                G_PlayerInfo.setCurSelectSkinId(this.curSelectId);
    
           }else{
                G_PlayerInfo.addStaffSkin(this.curSelectId);
                G_PlayerInfo.setCurSelectStaffSkinId(this.curSelectId);
           }
            this.refershSkin(this.curTopId);
            this.refershBottom(this.curSelectId,this.curTopId)
        }.bind(this);

        let temp=skinData.unLockCount.split('&');
            let useGold=parseInt(temp[1]);;
            let type=parseInt(temp[0]);
            if(type==6){//视频

                G_Tools.shareOrAd(this.viewProp.m_unLock_btn,function(){
                    getFun();
                })
                return;
            }else if(type==7)//签到获取
            {
                G_WXHelper.showToast("签到解锁");
                return;
            } 
            else{

                if(!G_Tools.canUseItem(useGold,type)){
                    return;
                }
                G_Tools.useItem(useGold,type);
            }
        
        getFun();

      
   }

   setGold(){
       this.viewProp.m_gold_count.text=G_PlayerInfo.getCoin();
   }

//    setDaim(){
//     this.viewProp.m_diam_count.text=G_PlayerInfo.getDiamCount();
//     }

   setBtnIcon(type){
       let icon=G_UIHelper.seekNodeByName(this.viewProp.m_unLock_btn,"icon");
        if(type==1){//钻石
            icon.skin="game/item/diam.png";
        }else if(type==3){//金币
            icon.skin="game/item/gold_min.png";
        }else if(type==6){//广告
            G_Tools.setAdBtnIcon(this.viewProp.m_unLock_btn);
            icon.skin="comm/video_icon.png";
        }
   }

   setBottom(show,count,type){
        this.viewProp.m_bottom.visible=show;
        this.viewProp.m_unLock_btn.visible=false;
        this.viewProp.m_has_get.visible=false;
        this.viewProp.m_sgined.visible=false;
        if(type==6){
            this.viewProp.m_unLock_btn.visible=true;
            this.viewProp.m_unLock_tips.text="免费获得";
        }else if(type==7){//签到获得
           this.viewProp.m_sgined.visible=true;
        }else if(type==0){
            this.viewProp.m_has_get.visible=true;
        }
        else{
            this.viewProp.m_unLock_btn.visible=true;
            this.viewProp.m_unLock_tips.text="{0} 解锁".format(count);
        }
        
        this.setBtnIcon(type);
   }

   refershBottom(skinId,type){
    if(type==1){
        let has=G_PlayerInfo.hasSkinById(skinId);
        let skinData=G_GameDB.getSkinConfigByID(skinId);
        let isOpen=skinData.isOpen;
        
        if(isOpen==1){
            if(has){
                this.setBottom(true,0,0);
            }else{
                let temp=skinData.unLockCount.split('&');
                this.setBottom(true,temp[1],parseInt(temp[0]));
            }
    
        }else{
            this.setBottom(false,0,1);
        }

        let skinPath=G_ResPath.skinPath.format(skinData.icon);
        this.viewProp.m_skin.skin=skinPath;
        if(!isOpen){
            
        }else{
            // let playerData=G_GameDB.getPlayerConfigByID(skinData.playerId);
            // let asset=[];
            // if(playerData){
            //     let playerName=G_ResPath.resPath.format(playerData.model);
            //     asset.push(playerName);
            //     G_NodePoolMgr.preload(asset,function(){
            //         if(!this||!this.owner||this.owner.destroyed||!this.isOpen){
            //             return;
            //         }
            //         let player=G_NodePoolMgr.getNode(playerName);
 
            //         G_MapMgr.setShowModel(player,this.owner.zOrder,1,1);
            //     }.bind(this));
            // }
        }
       }else if(type==2){
        let has=G_PlayerInfo.hasStaffSkinById(skinId);
        let skinData=G_GameDB.getStaffSkinConfigByID(skinId);
        let isOpen=skinData.isOpen;
        
        if(isOpen==1){
            if(has){
                this.setBottom(true,0,0);
            }else{
                let temp=skinData.unLockCount.split('&');
                this.setBottom(true,temp[1],parseInt(temp[0]));
            }
    
        }else{
            this.setBottom(false,0,1);
        }


        if(!isOpen){
            
        }else{
            let playerName=G_ResPath.resPath.format(skinData.name);
            let asset=[];
                asset.push(playerName);
                G_NodePoolMgr.preload(asset,function(){
                    if(!this||!this.owner||this.owner.destroyed||!this.isOpen){
                        return;
                    }
                    let player=G_NodePoolMgr.getNode(playerName);
                    G_MapMgr.setShowModel(player,this.owner.zOrder,1,2);
                }.bind(this));
        }
       }

   }
}
