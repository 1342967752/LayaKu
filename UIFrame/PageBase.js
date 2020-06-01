import TweenType from "../UIFrame/TweenType";
export default  class PageBase extends Laya.Script {

    constructor() { 
        super(); 
        this.isOpen=false;
        this.pageName=null;
        this.viewProp={};
        this.isAddListerener=false;
        this.adObj=null;
        this.showMore=true;
        this.isPartPage=false;//是否是界面的一部分
        this.pageOpenCallBack=null;//界面开启的回调
        this.isAutoExeOpenCallBack=true;
        this.isAutoDestroy=true;
        this.isNeedTween = false;

        this.nodeTween=[];
    }
    

    insertVal(){
        //插入值
        let p=[];
        G_Tools.getChildBySgin(this.owner,G_UIName.nodeSgin,p);
        
        for(var i=0;i<p.length;i++){
            this.viewProp[p[i].name]=p[i];
            let tweenType=p[i].getComponent(TweenType);
            if(tweenType){
                this.nodeTween.push(tweenType);
            }
        }
    }

    /**
     * 界面初始化
     */
    pageInit(){
        this.insertVal();
    }

    addListerner(){//添加监听
        this.isAddListerener=true;
    }


    /**
     * 上层界面关闭(回调)
     */
    hightPageClose(pageName){
        
    }

    /**
     * 上层界面开启
     * @param {*} pageName 
     */
    hightPageOpen(pageName){

    }

    /**
     * 界面开启(界面从关闭到开启调用这个方法)
     */
    pageOpen(vals){
        this.owner.visible=true;
        if(!this.isAddListerener){
            this.addListerner();
        }
        this.isOpen=true;
        this.playNodeTween();
    }

    playNodeTween(){
        for(var i=0;i<this.nodeTween.length;i++){
            this.nodeTween[i].playTween();
        }
    }

    closeNodeTween(){
        for(var i=0;i<this.nodeTween.length;i++){
            this.nodeTween[i].endTween();
        }
    }

    /**
     * 界面重复开启调用这个方法
     */
    pageRefersh(){

    }

    

    /**
     * 界面关闭
     */
    pageClose(){

        if(this.isAddListerener){
            this.removeListerner();
        }
        this.isOpen=false;
        this.owner.visible=false;
        this.closeNodeTween();
    }

    removeListerner(){//移除监听
        this.isAddListerener=false;
    }

   
    pageDestroy(){
        if(!this.isOpen){//不能重复关闭
            return;
        }
        this.pageClose();
    }

    /**
     * 设置界面开启的回调
     * @param {*} callBack 
     */
    setPageOpenCallBack(callBack){
        this.pageOpenCallBack=callBack;
    }

    /**
     * 界面开启回调执行
     */
    exeOpenCallBack(){
        G_Tools.handlerFun(this.pageOpenCallBack,this);
    }
}