export default class SkinItem extends Laya.Script {

    constructor() { 
        super(); 
        this.skinData=null;
        this.lockIcon=null;
        this.selectIcon=null;
        this.icon=null;
        this.bg=null;
        this.onClick=null;
        this.used=null;
        this.type=1;//1 人物  2 推杆
        this.staffIcon=null;
        this.lock=null;
    }
    
   init(){
        this.lockIcon=G_UIHelper.seekNodeByName(this.owner,"lockIcon");
        this.lock=G_UIHelper.seekNodeByName(this.owner,"lock");
        this.selectIcon=G_UIHelper.seekNodeByName(this.owner,"select");
        this.icon=G_UIHelper.seekNodeByName(this.owner,"icon");
        this.bg=G_UIHelper.seekNodeByName(this.owner,"bg");
        this.used=G_UIHelper.seekNodeByName(this.owner,"used");
        this.staffIcon=G_UIHelper.seekNodeByName(this.owner,"staff_icon");
        this.bg.on(Laya.Event.CLICK,this,function(){
            G_Tools.handlerFun(this.onClick,this);
            if(this.skinData.isOpen==1){
                
            }else{
                G_Tools.showToast("UIWORD_SKIN_NOT_OPEN");
            }
        })
   }

   setType(type){
       this.type=type;
   }

   setData(skinData){
       
        this.skinData=skinData;
        this.icon.visible=false;
        this.staffIcon.visible=false;
        if(this.type==1){
            this.icon.visible=true;
            this.icon.skin=G_ResPath.skinPath.format(skinData.icon);
        }else{
            this.staffIcon.visible=true;
            this.staffIcon.skin=G_ResPath.skinPath.format(skinData.icon);
        }
        
   }

   setLock(show){
        this.lockIcon.visible=show;
        this.lock.visible=show;
   }

   setSelect(show){
       this.selectIcon.visible=show;
       
   }

   setSkinOnClick(onClick){
       this.onClick=onClick;
   }

   setDontOpen(show){

       if(show){
           this.lockIcon.visible=false;
       }
   }

   setUsed(show){
       this.used.visible=show;
   }
}