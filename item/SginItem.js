export default class SginItem extends Laya.Script {

    constructor() { 
        super(); 
        this.viewProp=new Object();
        this.itemOnClick=null;
        this.day=0;
    }
    
    init(){
        let p=[];
        G_Tools.getChildBySgin(this.owner,G_UIName.nodeSgin,p);
        for(var i=0;i<p.length;i++){
            this.viewProp[p[i].name]=p[i];
        }

        this.viewProp.m_notsgin_bg.on(Laya.Event.CLICK,this,function(){
            G_Tools.handlerFun(this.itemOnClick,this);
        });
    }

    setDay(day){
        this.day=day;
        this.viewProp.m_day.text="第{0}天".format(day);
    }

    setCount(count){
        if(this.viewProp.m_count){
            this.viewProp.m_count.text=count;
        }
       
    }

    setIcon(sginData){

        if(!this.viewProp.m_skin_icon||!this.viewProp.m_staff_icon){
            return;
        }

        this.viewProp.m_icon.visible=false;
        this.viewProp.m_skin_icon.visible=false;
        this.viewProp.m_staff_icon.visible=false;
        this.viewProp.m_count.visible=false;
        this.viewProp.m_new.visible=false;
        let type=sginData.type;
        if(type==1){//钻石
            this.viewProp.m_icon.visible=true;
            this.viewProp.m_icon.skin="game/item/diam.png";
            this.viewProp.m_count.visible=true;
        }else if(type==2){//推棒
            this.viewProp.m_staff_icon.visible=true;
            let staffId=parseInt(sginData.param1);
            let skinData=G_GameDB.getStaffSkinConfigByID(staffId);
            this.viewProp.m_staff_icon.skin=G_ResPath.staffPath.format(skinData.name);
            this.viewProp.m_new.visible=!G_PlayerInfo.hasStaffSkinById(staffId);
        }else if(type==3){//金币
            this.viewProp.m_icon.visible=true;
            this.viewProp.m_icon.skin="game/item/gold_min.png";
            this.viewProp.m_count.visible=true;
        }
        else if(type==4){//人物皮肤
            this.viewProp.m_skin_icon.visible=true;
            let skinId=parseInt(sginData.param1);
            let skinData=G_GameDB.getSkinConfigByID(skinId);
            this.viewProp.m_skin_icon.skin=G_ResPath.skinPath.format(skinData.name);
            this.viewProp.m_new.visible=!G_PlayerInfo.hasSkinById(skinId)
        }else if(type==5){//体力
            this.viewProp.m_icon.visible=true;
            this.viewProp.m_icon.skin="game/item/power_icon.png";
            this.viewProp.m_count.visible=true;
        }
        
    }

    setSgin(sgin){
       this.viewProp.m_sgined_arr.visible=sgin;
       this.viewProp.m_sgin_bg.visible=sgin;
       this.viewProp.m_notsgin_bg.visible=!sgin;
       this.setAlpha(this.viewProp.m_icon,sgin);
       this.setAlpha(this.viewProp.m_skin_icon,sgin);
       this.setAlpha(this.viewProp.m_staff_icon,sgin);
    }

    setAlpha(go,sgin){
        if(go){
            if(sgin){
                go.alpha=0.8;
            }else{
                go.alpha=1;
            }
        }
    }

    setOnClickFun(fun){
        this.itemOnClick=fun;
    }
}