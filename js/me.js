$(function () {
    init();

    function init() {
        //先判断有没有登录
        if (!$.checkLogin()) {
            // 重新跳转到登录页面
            $.setPage();
            location.href = "/pages/login.html"
            return;
        } else {
            $("body").fadeIn();
        }
        getUserInfo();
        eventList();
    }


    function eventList(){
        $('#loginOutBtn').on('tap',function(){
             /* 
                0 弹出确认框 
                1 手动删除本地存储中数据 userinfo 
                2 跳转页面=> 登录页面
                */
            mui.confirm('确认退出','提示',['确认','取消'],function(res){
                if(res.index==0){
                    //确认
                    $.removeUser();  //清空数据
                    $.setPage(); //存储当前的页面记录
                    location.href='/pages/login.html';
                }else if(res.index==1){
                    //取消，不用执行代码
                }
            })

        })

    }



    function getUserInfo(){
        $.ajax({
            url:'my/users/userinfo',
            headers: {
                Authorization: $.token()
            },
            success:function(res){
                if(res.meta.status==200){
                    var html = template('userTpl',{data:res.data})
                    $('.userinfo').html(html)
                }else{
                    mui.toast(res.meta.msg)
                }
            }
            
        })
    }
})