$(document).ready(function(){
    var btn = document.getElementById('applyBtn');
    var vender = document.getElementById('vender');
    // var detail_scope1 = document.getElementById("detail1");
    // console.log(detail_scope1);
    console.log(vender);
    var venderValue;
    var deviceValue;
    var modeValue;

    $("#mode li").click(function () {
        modeValue = $(this).text(); //获取点击li的值      
    });
    $("#vender li").click(function () {
        venderValue = $(this).text(); //获取点击li的值      
    });
    $("#device li").click(function () {
        deviceValue = $(this).text(); //获取点击li的值      
    });

    btn.addEventListener('click', function(){
    
        var myData = {};
        var scopes = {};
        
        myData['mode'] = modeValue;
        myData['vender'] = venderValue;
        myData['device'] = deviceValue;
        console.log(myData);


        var aj = $.ajax( {    
        url:'apply',  
        data: '{"mode":"fifo", "policy" : [{"scope": "1.1.1.1-1.1.1.255", "deviceclass": "stb", "vendor": "arris"},{"scope": "2.1.1.1-1.1.1.255", "deviceclass": "host", "vendor": "cisco"},{"scope": "3.1.1.1-1.1.1.255", "deviceclass": "cm", "vendor": "sa"}]}',
        type:'post',    
        cache:true,  
        dataType:'json',    
        success:function() {
            console.log(data);
            // ajax_refresh_occupancy            
            //$.get("refresh",function(data){
                 
            //    $("#scope1_occupancy").innerHTML()
            //});   
        },    
        error : function() {    
            alert("异常！");    
        }    
        });  
    })

    // detail_scope1
    $("#detail1").click(function(){
        $.get("url",function(data){
            $("#detail1_info").innerHTML(data)
        });
    });

 // // ajax_refresh_scope1_occupancy 定时局部刷新
 //    $(function(){
 //        setInterval(refresh_scope1,10);
 //        function refresh_scope1(){
 //            $.get("url",function(data){

 //                $("#scope1_occupancy").innerHTML(data)
 //        });
 //     }

});






  //           $.ajax({
  //                 url: `demo0.php?name=${username}`,
  //                 dataType: 'json',
  //                 method: 'GET',
  //                 success: function(data) {
  //                    if (data.result == 1) {
  //                        $('.box').html(`<div>你的姓名${username}已成功保存。</div>`);
  //                    }
  //                },
  //                error: function(xhr) {
  //                    // 导致出错的原因较多，以后再研究
  //                    alert('error:' + JSON.stringify(xhr));
  //                }
  //            })
  //            .done(function(data) {

  //                console.log('success');
  //            })
  //            .fail(function() {
  //                console.log('error');
  //            })
  //            .always(function() {
  //                console.log('complete');
  //            });

  // 