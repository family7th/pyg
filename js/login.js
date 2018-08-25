$(function(){
    init();

    function init(){
        eventList();

    }

    function eventList(){
        $("#reg_btn").on('tap',function(){
            //获取电话号码和密码并且验证合法性
            var mobile_txt = $("[name='mobile']").val().trim();
            var pwd_txt = $("[name = 'pwd']").val().trim();
            if(!$.checkPhone(mobile_txt)){
                mui.toast('电话号码不合法');
                return;
            }
            if(pwd_txt.length<6){
                mui.toast('密码不合法');
                return;
            }
            //合法后发送请求
            $.post('login',{
                username:mobile_txt,
                password:pwd_txt
            },function(res){
                // console.log(res);
                //判断是否正确
                // debugger
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    //登录成功后，存储token信息
                    /* 
          本地存储复习
          1 sessionStorage  会话存储 浏览器一关闭 就不存在 
          2 localStorage 永久存储 除非手动删除否则一直存在
          3 api
              setItem(key,val) 设置值
              getItem(key)
              removeItem(key)
              clear() 清空
          4 存储的数据类型
            1 当存的简单类型 => 全部先转成字符串格式 
            2 当存的复杂类型   '[object object]'
                先转成json字符串 再存储 
                JSON.stringify(obj)
            3 取数据(复杂类型) 
                字符串 先解析成原来的状态 
                JSON.parse()
           */
                   //把全部数据都存起来，以后有可能会用到，因为返回的数据是对象，所以先转化为字符串再存
                    $.setUser(res.data);
                    // debugger;
                    
                    setTimeout(function(){
                        var pageName = $.getPage();
                        if(!pageName){
                            location.href = "/index.html";
                        }else{
                            location.href = pageName;
                        }                       
                    },2000)
                }else{
                    mui.toast(res.meta.msg);
                }
            })

        })
    }
})