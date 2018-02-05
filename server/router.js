/**
 * Created by JC on 2016/8/6.
 */
var fs=require('fs');


var router={
    controller:[],
    publicStr:'public',
    controllerStr:'server',
    route:function(req,res){
        var url=req.url;
        var method=req.method;
        var pathArr=url.split('/');
        if(''==pathArr[1]){
            getFile('/index.html',res);
        }else if(this.publicStr==pathArr[1]){
            getFile(url,res);
        }else if(this.controllerStr==pathArr[1]){
            var thisUrl=url.substring(this.controllerStr.length+1,url.length);
            for(var i=0;i<this.controller.length;i++){
                var thisCon=this.controller[i];
                if(thisCon.url==thisUrl&&thisCon.method==method){
                    return thisCon.func;
                }
            }
        }else{

        }
    },

    add:function(url,method,func){
        var thisCon={
            url:url,
            method:method,
            func:func
        };
        controller.push(thisCon);
    }


}

function getFile(path,res){
    var result={};
    path='..'+path;
    fs.exists(path,function(exists){
        if(exists){
            fs.readFile(path,function(err,data){
                if(err){
                    res.writeHead(500,{"content-type":"text/html"});
                    res.end(err);
                }else{
                    res.writeHead(200,{"content-type":"text/html"});
                    res.end(data);
                }
            });

        }else{
            res.writeHead(500,{"content-type":"text/html"});
            res.end('文件不存在!');
        }

    });

}
module.exports=router;