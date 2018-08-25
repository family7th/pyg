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

        getCartDate();
        eventList();
        
    }

    //注册点击事件
    function eventList(){
        //购物车商品的数量增加或者减少,因为点击按钮增加减少，还是最大值最小值，都已经封装好了，所以我们只需要在点击完按钮后，计算一次总加前就可以了
        $('.sc_content').on('tap','button',function(){
            countAll();
        })

        //点击时，不同状态的时候，组件的显示也不同，这里封装了类来控制，所以我们只需要控制类名的添加和减少，就可以控制组件的显示和隐藏
        $('#edit_btn').on('tap',function(){
            // console.log(123);
            $('body').toggleClass('edit_status');
        

        //动态切换文字
        if($('body').hasClass('edit_status')){
            $('#edit_btn').text('完成');
        }else{
            $('#edit_btn').text('编辑');

            /* 
            0 获取所有的li标签
            1  判断有没有商品
            2 循环 li标签
            1 获取 li 身上obj 
            2 改变 obj里面 obj.amount（要购买的数量 ） = 所在li标签的 里面 input标签的值
            3 再去构造请求的参数  infos:{}
            */
           var lis = $('.sc_content li');
           if(lis.length==0){
            mui.toast('您还没有购买商品');
            return;
           }
           //需要发送到后台的infos对象
           var infos = {};
           for(var i=0;i<lis.length;i++){
               var li = lis[i];
               //商品对象
               var obj = $(li).data('obj');
               //改变购买的数量
                obj.amount = $(li).find(".mui-input-numbox").val();
            
                infos[obj.goods_id]=obj;
           }
           //同步更新数据
           syncCart(infos);
         } 
        })

        //刪除购物车数据
        $('#delete_btn').on('tap',function(){
            //点击的时候获取被选中的复选框
            var chks = $(".sc_content [name='g_chk']:checked");
            //如果长度为0；没有被选中的
            if(chks.length==0){
                mui.toast('没有选中商品');
                return;
            }
            //弹出确认框
            mui.confirm('确认删除？','提示',['是','否'],function(res){
                if(res.index==0){
                    //确认删除，重构参数(把没有选中的商品)，发送请求，同步更新购物车
                    var unSelectLis = $(".sc_content [name='g_chk']").not(":checked").parent('li');

                    //未被删除的对象字段
                    var infos = {};
                    //遍历未被选中的对象的li
                    for(var i=0;i<unSelectLis.length;i++){
                        var li = unSelectLis[i];
                        var obj = $(li).data("obj");
                        //对象赋值的两种方式： infos.abc = 123 ; infos["abc"]=123
                        //观察返回数据可以知道，未被选中的对象的key就是等于obj中的goods_id
                        infos[obj.goods_id]=obj;
                    }
                    //发送请求，删除数据
                    syncCart(infos);
                }else if(res.index==1){
                    //没代码执行
                }
            })
        })

        //生成订单
        $(".order_creat").on('tap',function(){
             /* 
            1 判断有么有数据 
            2 构造请求的参数 
            */
            var lis = $('.sc_content li');
            if(lis.length==0){
                mui.toast('您还没有购买商品');
                return;
            }
            //构造参数，发送请求
            var paramsObj = {
                order_price:$('.total_price').text(),//总价钱
                consignee_addr:'天河',
                goods:[] //包括每一个li里面的id,amount,goods_price等,所以需要循环遍历
            };
            //循环遍历lis
            for(var i=0;i<lis.length;i++){
                var li = lis[i];
                var obj = $(li).data('obj');
                var tmp = {
                    goods_id:obj.goods_id,
                    goods_number:$(li).find(".mui-input-numbox").val(),
                    goods_price : obj.goods_price
                };
                paramsObj.goods.push(tmp);
                // console.log(paramsObj.goods);
            }

            //发送数据
            orderCreate(paramsObj);
        })
    }


    //查询购物车数据，构建数据发送请求
    function getCartDate(){
        //获取token        此时是字符串，应该先转化为对象才可以.token
       // var token = localStorage.getItem('userinfo').token;
       var token = $.token();
        $.ajax({
            url:"my/cart/all",
            type:'get',//默认是get方式，可以省略
            headers: {
                Authorization: token
            },
            success:function(res){
                // console.log(JSON.parse(res.data.cart_info));
                if(res.meta.status==200){
                    var cart_info = JSON.parse(res.data.cart_info);
                    var html = template('mainTpl',{obj:cart_info});
                    $('.shopping_car ul').html(html);
                    //初始化数字输入框，（；一般动态生成的组件都需要初始化）
                    mui(".mui-numbox").numbox();

                    //一有数据的时候就计算一次总价格
                    countAll();
                }else{
                    mui.toast(res.meta.msg);
                }
                    
            }
        })
            
    }

    //计算总价格
    function countAll(){
        /* 
        1 获取所有的li标签
        2 循环 
            1 计算每一个li标签所对应的商品的总价格（单价*数量）
            2 叠加不同种类的商品的总价格
        3 拿到总价格 =》 给标签赋值 
         */
        var lis = $('.sc_content li');
        //总价格
        var total = 0;
        //遍历循环获取每个li的价格，相加
        for(var i =0; i<lis.length;i++){
            var obj = $(lis[i]).data('obj');
            // console.log(obj);
            // total += obj.amount * obj.goods_price;
            //单价
            var goods_price = obj.goods_price;
            // console.log(goods_price);
            //数量
            var nums = $(lis[i]).find('.mui-input-numbox').val();
            total += goods_price * nums;
        }
        //赋值到总价钱
        $('.total_price').text(total);
    }

    //同步购物车数据
    function syncCart(infos){
         //发送请求，删除数据
         $.ajax({
            url:"my/cart/sync",
            type:"post",
            data:{
                infos:JSON.stringify(infos)
            },
            headers:{
                Authorization: $.token()
            },
            success:function(res){
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    getCartDate();
                }else{
                    mui.toast(res.meta.msg);
                }
            }
        })
    }
    
    //生成订单
    function orderCreate(params){
        $.ajax({
            url:'my/orders/create',
            type:'post',
            data:params,
            headers:{
                Authorization: $.token()
            },
            success:function(res){
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    //跳转到订单页面
                    location.href="/pages/order.html";
                }else{
                    mui.toast(res.meta.msg);
                }
            }
        })
    }
})