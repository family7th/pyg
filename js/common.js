$(function(){
    //mui框架的a标签都是默认不跳转的，需要用js/jq方法解决默认行为
    $('body').on('tap', 'a', function() {
      document.location.href = this.href;
    });

    var BaseUrl=" http://api.pyg.ak48.xyz/";
    //引入模板引擎变量
    template.defaults.imports.iconUrl = BaseUrl;
    // 修改接口的使用方式
    // 拦截器
    // 在每一次发送请求 之前对请求做一些处理 
    // 发送请求之前,提前对于 接口的url进行处理 
    // var oobj={};
    // $.ajax(oobj);
    // http://api.pyg.ak48.xyz/api/public/v1/  +   home/swiperdata

    //声明一个变量，表示发送Ajax请求的个数
    var ajaxNums = 0;
    $.ajaxSettings.beforeSend=function (xhr,obj) {
      obj.url=BaseUrl+"api/public/v1/"+ obj.url;
      // console.log(obj.url);
      ajaxNums++;
      $('body').addClass('wait');
    }

    //发送多次请求的时候，如果不判断是否是最后一个请求回来的数据，那么，只有有第一个请求回来数据了，那么wait,就会被移除，不符合要求
    $.ajaxSettings.complete = function(){
      ajaxNums--;
      if(ajaxNums==0){
        $('body').removeClass('wait');
      }
      
    }


    //拓展zepto => 给$对象添加属性或者方法
    $.extend($,{
      checkPhone:function(phone) {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            return false;
        } else {
            return true;
        }
      },
      checkEmail:function (myemail) {　　
        var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        if (myReg.test(myemail)) {　　　　
            return true;　　
        } else {　　　　
            return false;
        }
      },
      getValue:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
      },
      checkLogin:function(){ 
        //返回这个值，如果有，返回的是对象的字符串，如果没有，则是false  
        return localStorage.getItem('userinfo');
      },
      token:function(){
        var token;
        if(!localStorage.getItem('userinfo')){
          //如果没有userinfo，token为空
          token = "";
        }else{
          //如果有userinfo，token为userinfo里面的token
          token = JSON.parse(localStorage.getItem('userinfo')).token;
        }
        return token;
      },
      //把当前页面存放到 会话存储中
      setPage:function(){
        sessionStorage.setItem("pageName", location.href);
      },
      //把页面的url从 会话存储中 取出来
      getPage:function(){
        sessionStorage.getItem("pageName");
      },
      // 把用户信息存放到 永久存储 中
      setUser:function (obj) {
        localStorage.setItem("userinfo", JSON.stringify(obj));
      },
      // 从 永久存储 中取出 用户信息
      getUser:function () {
        return localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):false;
      },
      //删除永久存储中的userinfo数据
      removeUser:function(){
        localStorage.removeItem('userinfo');
      }
    })
})