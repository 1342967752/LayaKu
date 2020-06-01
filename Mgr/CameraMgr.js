export default class CameraMgr extends Laya.Script {

    constructor() { 
        super(); 
        this.isFollow=false;
        this.player=null;
        this.camrera=null;


        this.dontMovePos;

        this.posOffect=new Laya.Vector3(0,0,0);
        this.posEndOffect=new Laya.Vector3(0,0,0);
        this.camreraEndRot=null;
    }
    
   init(){
        this.isFollow=false;
        this.camrera=G_UIHelper.seekNodeByName(this.owner,"Camera");
        this.camrera.farPlane=300;
        this.camrera.nearPlane=0.01;
        this.camrera.cullingMask =~(1 << G_HintMask)//
        this.closeCameraHDR(this.camrera);
        
   }

   /**
    * 设置摄像机视角
    */
   setCameraField(val){
        this.camrera.fieldOfView=val;
   }

   closeCameraHDR(ca){
    if(ca){
        ca.enableHDR=false;
    }
 }

   setPlayer(player){
       this.player=player;

     let min=50;

      this.setCameraField(min);
      
   }



   setCameraPosAndRot(playerMgr){
       
        this.owner.transform.localRotationEuler=playerMgr.cameraPos.transform.localRotationEuler.clone();
        let cameraPos=  playerMgr.cameraPos.transform.position.clone();
        
    
        this.owner.transform.position=cameraPos;

        Laya.Vector3.subtract(playerMgr.owner.transform.position,this.owner.transform.position,this.posOffect);
        this.posOffect=playerMgr.cameraPos.transform.localPosition.clone();
        this.posEndOffect=playerMgr.cameraEndPos.transform.localPosition.clone();
        this.camreraEndRot=playerMgr.cameraEndPos.transform.rotation.clone();
   }


   setCameraMoveOne(playerMgr,val=0.08){
    let playerPos=  playerMgr.owner.transform.position;
    let toPos=new Laya.Vector3(playerPos.x+this.posOffect.x,this.owner.transform.position.y,playerPos.z+this.posOffect.z);
    Laya.Vector3.lerp(this.owner.transform.position,toPos,val,toPos);
    this.owner.transform.position=toPos;
    
  }

  setCameraMoveEnd(playerMgr){
    let val=0.04;
    let playerPos=  playerMgr.owner.transform.position;
    let toPos=new Laya.Vector3(playerPos.x+this.posEndOffect.x,playerPos.y+this.posEndOffect.y,playerPos.z+this.posEndOffect.z);
    Laya.Vector3.lerp(this.owner.transform.position,toPos,val,toPos);
    let rot=new Laya.Quaternion(0,0,0,0);
    Laya.Quaternion.lerp(this.owner.transform.rotation,this.camreraEndRot,val*0.3,rot);
    this.owner.transform.position=toPos;
    this.owner.transform.rotation=rot;
  }
  
  

   setColor(color){   
        this.camrera.clearColor=color.clone();//new Laya.Vector4(0.78,0.62,0.95,0);
   }

}