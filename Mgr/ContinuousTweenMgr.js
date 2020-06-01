export default class ContinuousTweenMgr  {

    constructor() { 

     this.tweenVals=[];
     this.tweenIndex=0;//动画播放的位置
     this.endBackFun=null;
     this.targets=[];
     this.isLoop=false;//是否循环
     this.isPlayTween=false;
     this.cTween=[];
    }
    
    setLoop(loop){
        this.isLoop=loop;
    }

    setTarget(target){
        if(this.targets.indexOf(target)){
            this.targets.push(target);
        }
       
    }

    setTweenVals(vals){
        this.tweenVals=vals;
    }
   
    setEndCallBack(callBack){
        this.endBackFun=callBack;
    }


    reset(){

    }

    play(){

        if(this.isPlayTween){
            return;
        }

        this.reset();

        this.tweenIndex=0;
        this.isPlayTween=true;
        this.doNext();
    }

    doNext(){
        if(this.tweenIndex>=this.tweenVals.length){
            if(this.isLoop){
                this.tweenIndex=0;
            }else{
                this.end();
                return;
            }
            
        }

        let time=this.tweenVals[this.tweenIndex].time;
        let prop=this.tweenVals[this.tweenIndex].prop;
        let ease=this.tweenVals[this.tweenIndex].ease;

        this.clearTween();
        
        for(let i=0;i<this.targets.length;i++){
            this.cTween.push(Laya.Tween.to(this.targets[i],prop,time,ease));
        }

        
        Laya.timer.once(time,this,function(){
           if(this.isPlayTween){
                this.tweenIndex++;
                this.doNext();
           }
           
        })
       
        
    }

    end(){
        this.isPlayTween=false;
        this.clearTween();
        G_Tools.handlerFun(this.endBackFun);
    }

    clearTween(){
        for(let i=this.cTween.length-1;i>=0;i--){
            if(this.cTween[i]){
                this.cTween[i].clear();
                this.cTween.splice(i,1);
            }
        }
        
       

        Laya.timer.clearAll(this);
    }
}