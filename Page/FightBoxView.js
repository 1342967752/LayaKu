import PageBase from "../UIFrame/PageBase";
import ContinuousTweenMgr from "../Mgr/ContinuousTweenMgr"
export default class FightBoxView extends PageBase{

    constructor() { 
        super(); 
       
        this.adObj=new Object();
        this.adObj.num=2;

        this.onckickCount=8;//点击三次
        this.isOpenBox=false;
        this.closeFun=null;
        this.lastOnclickTime=0;//上次点击的时间

        this.updateSpace=500;//更新间隔
        this.downValMin=0.008;//下降最小增值
        this.downValMax=0.008;//下降最大增值
        this.onclickAdd=0.06;//点击增值
        
        
        this.curOnclick=0;//当前点击的次数
        this.tarVar=0.65;//指定值
        this.enableVal=this.tarVar;//产生ad点
        this.minClickVal=7;
        this.maxClickVal=4;
        this.enableClick=this.minClickVal;

        this.isNeedTween=true;
        this.vals=null;

        this.fingerTween=new ContinuousTweenMgr();
        let tVals=[];
        tVals.push({time:300,prop:{scaleX:1.2,scaleY:1.2},ease:Laya.Ease.linearNone})
        tVals.push({time:300,prop:{scaleX:1,scaleY:1},ease:Laya.Ease.linearNone});

        this.fingerTween.setTweenVals(tVals);
    }
    

    pageInit(){
        super.pageInit();

        let mistakeData=G_MistakeHelp.getMistakeData();
        if(mistakeData!=null){
            let temp=mistakeData.split('||');
            this.updateSpace=parseInt(temp[0]);
            this.downValMin=parseFloat(temp[1]);
            this.downValMax=parseFloat(temp[2]);
            this.onclickAdd=parseFloat(temp[3]);
            this.tarVar=parseFloat(temp[4])/100;
            let temp01=temp[5].split('-');

            this.minClickVal=parseInt(temp01[0]);
            this.maxClickVal=parseInt(temp01[1]);
        }

        this.viewProp.m_box.on(Laya.Event.CLICK,this,function(){
            G_Tools.btnAction(this.viewProp.m_box);
            this.onClickBtn();
        });


        this.fingerTween.setTarget(this.viewProp.m_finger);
        this.fingerTween.setLoop(true);
    }


    setView(viewType){
        if(viewType==1){
            this.viewProp.m_title.skin="game/fightBox/diamtitle.png";
            
        }else{
            this.viewProp.m_title.skin="game/fightBox/title01.png";
        }
    }

    pageOpen(vals){
        super.pageOpen(vals);
        this.vals=vals;
        this.resetBar();
        this.getAdVal();
        this.setView(vals.viewType);
        if(vals){
            this.closeFun=vals.closeFun;
        }else{
            this.closeFun=null;
        }
 
        G_Scheduler.schedule("mistake_bar_update"+this.id,function(){
            this.barUpdate();
        }.bind(this),false,100,G_Const.C_SCHEDULE_REPEAT_FOREVER);

        this.fingerTween.play();
    }
    

    resetBar(){
        this.viewProp.m_mistake_bar.value=0;
        this.isOpenBox=false;
    }

    getAdVal(){
        this.enableVal=this.tarVar;
        this.enableVal+=0.05*Math.random();
 
        if(this.enableVal>0.9){//边值处理
            this.enableVal=0.9;
        }
 
        this.enableClick=this.minClickVal;
        this.enableClick+=(this.maxClickVal-this.minClickVal)*Math.random();
        this.curOnclick=0;
    }

    barUpdate(){
        if(this.viewProp.m_mistake_bar){
            let val=this.viewProp.m_mistake_bar.value;
            let down=this.downValMin;
            if(G_ServerInfo.getServerTime()-this.lastOnclickTime>this.updateSpace){
                 down=this.downValMax;
            }
            val-=down;
            this.setBarVal(val);
        }
    }

    setBarVal(val){
        val=Math.max(0,val);
        val=Math.min(val,0.95);
        this.viewProp.m_mistake_bar.value=val;
    }

    onClickBtn(){

        let val=this.viewProp.m_mistake_bar.value;
        val+=this.onclickAdd;
        if(val>=0.95){
            val=0.95;
        }
        this.setBarVal(val);
        this.lastOnclickTime=G_ServerInfo.getServerTime();
        this.curOnclick++;
        if(this.isOpenBox){
            return;
        }
    
            if(val>this.enableVal&&this.curOnclick>=this.enableClick){
    
                this.isOpenBox=true;
                let self=this;
                let openGetFun=function(){
                    Laya.timer.once(2000,this,function(){//延时显示goldview
                        
                        let vals=new Object();
                        vals.closeFun=function(){
                            G_MainGui.closeUI(G_UIName.FightBoxView);
                            
                        }.bind(this);
                        vals.count=self.vals.count;
                        vals.type=self.vals.type;
                        G_MainGui.openUI(G_UIName.GetItemView,vals,null);
                    })
                }

                //盒子误触
                if(G_PlatHelper.isQQPlatform()){
                    G_PlatAction.cretaeBoxAd();
                    openGetFun();
                }else{

                    G_MainGui.openUI(G_UIName.AdView,null,function(){
                        let adView=G_MainGui.getPageByName(G_UIName.AdView);
                        adView.setBottomType(2,0,null,0);
                        openGetFun();
                    }.bind(this));
                }

              
    
               
                return;//开启宝箱
            }else{
                if(val<=this.enableVal){
                    this.curOnclick=0;
                }
               
            }
       }


       pageClose(){
            super.pageClose();
            G_Tools.handlerFun(this.closeFun);
            this.closeFun=null;
            G_Scheduler.unschedule("mistake_bar_update"+this.id);
            this.fingerTween.end();
        }

}