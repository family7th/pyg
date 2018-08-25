$(function(){
  //初始化
  init();

  function init(){   //初始化函数调用
    getSwiperData(); //轮播图函数调用
    getCatitems();//导航栏函数调用
    getGoodslist()//商品页函数调用

  }




})

//轮播图
function getSwiperData(){
  //发送请求，申请数据 
  $.get('home/swiperdata',function(res){
    // console.log(res); 
    //渲染数据
    var html = template('swiperTpl',{arr:res.data});
    $('.mui-slider').html(html);

    // 获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
    });

  })
  
}

//导航栏
function getCatitems(){
  $.get('home/catitems',function(res){
    // console.log(res);
    var html = template('navTpl',{arr:res.data});
    $('.index_nav').html(html);
  })
}

//商品页
function getGoodslist(){
  $.get('home/goodslist',function(res){
    // console.log(res);
    var html = template('goodsTpl',{arr:res.data});
    $('.index_goodlist').html(html);

  })

}

