$(function () {
    //因为需要传多个参数，所以用对象传参更加方便
    var QueryObj = {
        query:"",
        cid:$.getValue('cid'),
        pagenum:1,
        pagesize:10
    }
    //声明一个总页数，在上拉加载的时候需要用来判断
    var totalPages ;
    


    init();
  
    function init() {        
        mui.init({
            pullRefresh: {
                container: ".pyg_view",
                down: {
                    auto: true, //一开始自动刷新
                    //  刷新时自动触发
                    callback: function () {
                        $('.pyg_view ul').html('');//先清空内容，因为发送请求的时候是append追加内容
                        QueryObj.pagenum = 1; //重置当前页面，如果不重置的话，当用户不停地加载的话，QueryObj.pagenum不停地增加，但是没有那么多页面，当下拉刷新的时候，就会出现bug
                        search(function(){//获得数据后，应该停止刷新，所以需要传入回调函数
                            mui('.pyg_view').pullRefresh().endPulldownToRefresh();
                            //重置上啦刷新组件
                            mui('.pyg_view').pullRefresh().refresh(true);
                        });
                    }
                },
                up: {                  
                    callback: function () {
                    //先判断有没有下一页，如果有加载，没有就提示用户没有，返回return
                    //当前页QueryObj.pagenum  , 总页数:totalPages 
                        if(QueryObj.pagenum >= totalPages){
                            console.log("没有更多数据加载");
                            //上拉加载停止
                            mui('.pyg_view').pullRefresh().endPullupToRefresh();
                            return;
                        }else{
                            QueryObj.pagenum++; //当前页数+1，重新发送请求
                            search(function(){//获得数据后，应该停止刷新，所以需要传入回调函数 
                                mui('.pyg_view').pullRefresh().endPullupToRefresh();
                            });
                        }  
                    }
                }
            }
        });
    }

    //发送请求的函数
    function search(callback){
        $.get('goods/search',QueryObj,function(res){
            // console.log(res.data.goods);
            //获取总页数
            totalPages = Math.ceil(res.data.total / QueryObj.pagesize);
            // console.log(totalPages);
            var html = template('mainTpl',{arr:res.data.goods})
            // $('.pyg_view ul').html(html); 因为在下拉加载的时候需要的是添加页面，html是覆盖
            $('.pyg_view ul').append(html);
            callback && callback();
        })
    }


    //获取url上 的参数
    



})