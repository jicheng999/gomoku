/**
 * Created by JC on 2016/8/6.
 */
var thisServer=require('http').createServer(serverFunc).listen(80);
var sio=require('socket.io').listen(thisServer);
var router=require('./router');

router.controller=[{url:'/test',method:'GET',func:test}];
    function serverFunc(req,res){
    router.route(req,res);
}

function test(param1,param2){
    console.log(param1);
    console.log(param2);
}



