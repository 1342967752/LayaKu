export default class PlatAction {

    constructor() { 

        this.isinLoadAppBox=false;//是否在加载盒子广告
        this.boxad=null;
    }
    
   init(){
        
   }

   cretaeBoxAd(callBack){
        if(G_PlatHelper.isQQPlatform()){
            if(qq&&qq.createAppBox){

               
              
                let self=this;
                if(self.boxad){
                    self.boxad.destroy();
                    self.boxad=null;
                }

                self.boxad=qq.createAppBox({adUnitId:"62c5f415cc8f633da11ce403f97dc022"});

                if(self.boxad){
                    let boxadOnLoad= self.boxad.load();
                    if(boxadOnLoad.then){
                        boxadOnLoad.then(function(){
                            self.boxad.show();
                        })
                    }

                    if(self.boxad.onClose){
                        self.boxad.onClose(function(){
                            
                            if(self.boxad){
                                self.boxad.destroy();
                                self.boxad=null;
                            }
                        })
                    }

                   
                }
                
            }
        }
   }

}