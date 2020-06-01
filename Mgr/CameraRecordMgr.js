export default class CameraRecordMgr {

    constructor() { 
        
       this.isStart=false;
       this.videoPath=null;
    }

    init(){
        if(window.tt){
            let recorder=tt.getGameRecorderManager();
            recorder.onError(function(errMsg){
                console.log(errMsg);
            })
        }
    }
    
    start(){
        if(window.tt){
            let recorder = tt.getGameRecorderManager();
            let self=this;
            recorder.onStart(res => {
            console.log("录屏开始");
            
            });
            self.isStart=true;
            recorder.start({
                duration: 300
            });
        }
    }

    stop(){
        if(window.tt){
            let recorder = tt.getGameRecorderManager();
            let self=this;
            recorder.onStop(res => {
            console.log("录屏暂停:",res.videoPath);
            self.videoPath=res.videoPath;
            });
            self.isStart=false;
            recorder.stop();
        }
    }

    /**
     * 拿到记录状态
     */
    getIsStart(){
        return this.isStart;
    }

    shareVideo(){
        if(window.tt){
            if(this.videoPath==null){
                G_WXHelper.showToast("视屏分享失败");
                return;
            }

            let self=this;
            tt.shareAppMessage(
                {
                    channel: "video",
                    title: "敢挑战吗",
                    desc: "来挑战我吧",
                    imageUrl: "",
                    templateId: "", // 替换成通过审核的分享ID
                    query: "",
                    extra: {
                      videoPath: self.videoPath, // 可替换成录屏得到的视频地址
                      videoTopics: []
                    },
                    success() {
                      console.log("分享视频成功");
                      //self.videoPath=null;
                    },
                    fail(e) {
                      console.log("分享视频失败");
                      //self.videoPath=null;
                    }
                  }
            );
        }
    }
}