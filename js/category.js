$(function(){
    var Datas;
    var LeftScroll;
    //初始化
    init();

    function init(){
        htmlFz();
        getCategories();
        eventList();
    }

    //左侧点击事件
    function eventList(){
        $('.left').on('click','li',function(){
            // console.log(this.dataset.index);
            /* 
      1 点击到li标签中的第n个  显示返回值中的第n个
      2 获取被点击的li标签的索引
       */
      // this 当前被点击的dom对象 li标签  js对象还是jq
      //  js
      //  var index=this.dataset.index;
      //  console.log(index);
      // jq
      var index = $(this).data('index');
      $(this).addClass('active').siblings().removeClass('active');
      //LeftScroll.scrollToElement(js中的dom对象)
      LeftScroll.scrollToElement(this);
      renderRight(index);
        })
    }

    //发送请求，取左边的列表数据
    function getCategories(){
        $.get('categories',function(res){
            console.log(res);
            var html = template('leftTpl',{arr:res.data});
            $('.left ul').html(html);
            LeftScroll = new IScroll('.left');

            //因为左边的数据和右边的数据发送请求的都是同一个地址，所以直接在这写就可以了
            //赋值给Datas
            Datas = res.data;
            renderRight(0); //默认渲染的是第一个数据，其他的数据，当用户点击的时候再发送请求
        })
    }

    function renderRight(index){
        //渲染页面时需要的参数arr,因为这里的res不是在这个函数出现的，需要一个全局变量去接收
        var arr = Datas[index].children;
        //渲染模板
        var html2 = template('rightTpl',{arr:arr});
        $('.right').html(html2);
        //确保图片都加载完毕后，滚动才有效果
        //声明变量，图片的长度
        var nums = $('.right img').length;
        $('.right img').on('load',function(){
            //每次有一张图片加载完毕后，都触发出事件，使图片的数量减少一张
            nums--;
            if(nums==0){
                var rightScroll = new IScroll('.right');
            }
        })
    }


    
    
    //匹配不同屏幕大小时，html字体的大小改变
    function htmlFz(){
        //设置初始值
        var baseValue = 100 ;
        //设置设计稿的宽度
        var pageWidth = 375;
        //要匹配的屏幕的宽度
        var screenWidth = document.querySelector('html').offsetWidth;
        //根据比例关系，得到对应的fontsize的大小为
        var fz = screenWidth * baseValue / pageWidth ;
        //赋值给hmtl
        document.querySelector('html').style.fontSize = fz+"px";
    }

    //屏幕在改变的时候也调用设置字体大小的函数
    window.onresize = function(){
        htmlFz();
    }

})

