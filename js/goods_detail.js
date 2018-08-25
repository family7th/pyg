$(function(){
    //声明一个全局变量，用来存储商品的信息数据，
    var GoodsObj;
    init();

    function init(){
     getDetail();
     eventList();

    }

    
    function eventList(){
     $('.add_btn').on('tap',function(){
         //构造参数，发送请求
            var obj = {
                cat_id :GoodsObj.cat_id,
                goods_id:GoodsObj.goods_id,
                goods_name:GoodsObj.goods_name,
                goods_number:GoodsObj.goods_number,
                goods_price:GoodsObj.goods_price,
                goods_small_logo:GoodsObj.goods_small_logo,
                goods_weight:GoodsObj.goods_weight
            }

             // 发送到后台的参数分为两种
            // 1 常规的参数   $.ajax({data:obj})
            // 2 token 登录验证使用 => 请求头中 

            //获取token
            var token = JSON.parse(localStorage.getItem('userinfo')).token;
            $.ajax({
                url:"my/cart/add",
                type:"post",
                data:{info:JSON.stringify(obj)},
                headers:{
                    Authorization:token
                },
                success:function(res){
                    console.log(res);
                    //无效的token，未登录
                    if(res.meta.status==401){
                        mui.toast('未登录');
                        //跳转前先存储当前路径到会话存储中，用于判断登陆后该跳转到首页还是跳回当前页
                        $.setPage();
                        setTimeout(function(){
                            location.href = "/pages/login.html";
                        },1000)
                    }else if(res.meta.status==200){
                        //添加成功,弹出提示框
                        mui.toast(res.meta.msg);
                        //弹出确认框，确认是留在当前页面还是跳转到购物车页面
                        mui.confirm('是否留在此页面','',['是','否'],function(res){
                            // console.log(res);//从结果可知，是：index==0 , 否:index==1
                            if(res.index==0){
                                //留在此页面
                            }else if(res.index==1){
                                //跳转到购物车页面
                                location.href = "/pages/cart.html";
                            }
                        })
                    }
                }
            })


        //  $.post('my/cart/add',{info:JSON.stringify(obj)},function(res){
        //      console.log(res);
        //      //无效的token，未登录
            //  if(res.meta.status==401){
            //      mui.toast('未登录');
            //      //跳转前先存储当前路径到会话存储中，用于判断登陆后该跳转到首页还是跳回当前页
            //      sessionStorage.setItem('pageName',location.href);
            //      setTimeout(function(){
            //          location.href = "/pages/login.html";
            //      },1000)
            //  }
        //  })  这个是常规参数时发送请求方式，现在要带token，需要用Ajax发送请求

     })

    }

    function getDetail(){
        $.get('goods/detail',{
            goods_id:$.getValue('goods_id')
        },function(res){
            // console.log(res);
            //把商品信息全部储存在全局变量中
            GoodsObj = res.data;
            var html = template('mainTpl',{data:res.data});
            $('.pyg_view').html(html);
               //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
                });
        })
    }
     
   


    
})