$(function(){
    init();

    function init(){
        //查询购物车前先判断有没有登录(其实就是判断是否有token)
        if(!$.checkLogin()){
            //提示用户没有登录
            mui.toast('请先登录');
            //跳转到登录页面,跳转前先存下当前的页面地址到临时会话中
            $.setPage();
            location.href = "/pages/login.html";
            return;
        }else{
            $('body').fadeIn();
        }
        queryOrders()

    }

    function queryOrders(){
        $.ajax({
            url:"my/orders/all",
            type:"get",
            data:{type:1},
            headers: {
                Authorization: $.token()
              },
            success:function(res){
                console.log(res);
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    var html = template('liTpl',{arr:res.data})
                    $('#item1 ul').html(html);
                }else{
                    mui.toast(res.meta.msg);
                }  
            }
        })

    }
   
})