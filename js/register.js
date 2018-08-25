$(function () {
    init();

    function init() {
        eventList();
        
    }

    function eventList() {
        //注册获取验证码事件,加入用到on,请先考虑要不要用委托事件
        $('#code_btn').on('tap', function () {
            //获取手机号码并验证是否合法
                               //属性选择器
            var mobile_txt = $("[name='mobile']").val().trim();
            // console.log(mobile_txt);
            if(!$.checkPhone(mobile_txt)){
                //mui提示框
                mui.toast('手机号码不合法');
                return;
            }
            //合法则发送post请求
            $.post('users/get_reg_code',{mobile:mobile_txt},function(res){
                console.log(res);
                //判断是否成功获取
                if(res.meta.status==200){
                    //成功获取数据后，禁用按钮，防止用户多次点击按钮
                    $('#code_btn').attr('disabled','true');
                    //显示多少秒后可以继续使用
                    var times = 5;
                    var timeID = setInterval(function(){
                        times--;
                        $('#code_btn').text(times+"秒后可以使用");
                        if(times==0){
                            clearInterval(timeID);
                            $('#code_btn').text("获取验证码");
                            $('#code_btn').removeAttr('disabled');
                        }
                    },1000);
                    
                }
            })
        })

        //点击注册按钮，注册事件
        $('#reg_btn').on('tap',function(){
            //获取一大推数据并且验证
            var mobile_txt = $("[name='mobile']").val().trim();
            var code_txt = $("[name='code']").val().trim();
            var email_txt = $("[name='email']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();
            var pwd2_txt = $("[name='pwd2']").val().trim();
            var gender_txt = $("[name='gender']:checked").val().trim();

            //验证一大推数据的合法性
            //手机
            if(!$.checkPhone(mobile_txt)){
                //mui提示框
                mui.toast('手机号码不合法');
                return;
            }
            //// 验证验证码 长度不为4 就是非法!!!
            if(code_txt.length !=4 ){
                //mui提示框
                mui.toast('验证码不合法');
                return;
            }
            // 验证邮箱
            if(!$.checkEmail(email_txt)){
                //mui提示框
                mui.toast('邮箱不合法');
                return;
            }
            // 验证密码 长度小于6 非法
            if(pwd_txt.length < 6 ){
                //mui提示框
                mui.toast('密码不合法');
                return;
            }
            //验证两个密码是否相同
             if(pwd_txt != pwd2_txt){
                //mui提示框
                mui.toast('两次密码不同');
                return;
            }

            //数据都合法后，发送请求
            $.post('users/reg',{
                mobile:mobile_txt,
                code:code_txt,
                email:email_txt,
                pwd:pwd_txt,
                gender:gender_txt
            },function(res){
                console.log(res);
                //判断是否注册成功
                if(res.meta.status==200){
                    //成功
                    mui.toast(res.meta.msg);
                    //延迟几秒跳转到首页
                    setTimeout(function(){
                        location.href = "/pages/login.html"
                    },2000);
                }else{
                    mui.toast(res.meta.msg);
                }
            })
        })
    }


   



})