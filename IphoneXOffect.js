import WidgetMgr from "../game/ctrl/WidgetMgr";

export default class IphoneXOffect extends Laya.Script {

    constructor() { 
        super(); 

         /** @prop {name:offectCount, tips:"", type:Number, default:50}*/
        this.offectCount=50;

        
    }
    
    onAwake(){
        let h=Laya.stage.height;
        if(h>1450){
            let win=this.owner.getComponent(WidgetMgr);
            if(win){
                win.bottom+=this.offectCount;
            }
           
        }

        
        
    }
   
}