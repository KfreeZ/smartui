$(document).ready(function(){
    var btn = document.getElementById('applyBtn');
    var vendor = document.getElementById('vendor');
    var detail_scope0 = document.getElementById("detail0");
    var detail_scope1 = document.getElementById("detail1");
    // console.log(detail_scope0);
    console.log(vendor);
    var modeValue;
    var vendorValue = new Array(3);
    var deviceValue= new Array(3);

    $("#mode li").click(function () {
        // console.log('click');
        modeValue = $(this).text();       //获取点击li的值   
        console.log(modeValue)
        $("#modeType").text(modeValue);
    });

    // scope0 config
    $("#vendor0 li").click(function () {
        vendorValue[0] = $(this).text(); 
        $("#vendorMode0").text(vendorValue[0]);  
    });
    $("#device0 li").click(function () {
        deviceValue[0] = $(this).text();  
        $("#deviceMode0").text(deviceValue[0]); 
    });

    // scope1 config
    $("#vendor1 li").click(function () {
        vendorValue[1] = $(this).text(); 
        $("#vendorMode0").text(vendorValue[1]);  
    });
    $("#device1 li").click(function () {
        deviceValue[1] = $(this).text();  
        $("#deviceMode1").text(deviceValue[1]); 
    });


    btn.addEventListener('click', function(){

                    // test occupancy refresh after apply attach
                    var jsonObj = {"dhcpstatus" : 
                                    [
                                      {"scope": "1.1.1.1-1.1.1.255", "total": 100, "used": "20"},
                                      {"scope": "2.1.1.1-1.1.1.255", "total": 50, "used": "30"},
                                      {"scope": "3.1.1.1-1.1.1.255", "total": 25, "used": "40"}
                                    ]
                                  } 
                    console.log("post dataobject to server"+jsonObj)
                    var used = jsonObj.dhcpstatus[0].used;
                    var total = jsonObj.dhcpstatus[0].total;
                    // console.log(used + "  " + total)
                    $("#scope0_occupancy").html("total:"+total+"; used:"+used);
                    // var occup= (used/total)*100;
                    // $("#scope0_occupancy").style.width = occup+"%";

        var myData = {  "mode": modeValue,
                        "policies":[
                                      {
                                        "scope": $("#scop0").text(), 
                                        "device_class": deviceValue[0],
                                        "vendor": vendorValue[0]
                                      },

                                      {
                                        "scope": $("#scop1").text(), 
                                        "device_class": deviceValue[1],
                                        "vendor": vendorValue[1]
                                      }

                                    ]
                      };
        console.log("attach apply-btn post data"+myData);
        $("#modeType").text("Mode");
        $("#vendorMode0").text("Vendor");
        $("#deviceMode0").text("Device");
        $("#vendorMode1").text("Vendor");
        $("#deviceMode1").text("Device");  


        var aj = $.ajax( {    
        url:'apply',  
        data:myData,
        type:'post',    
        cache:true,  
        dataType:'json', 
   
        success:function(data) {   
            console.log(data);
            // ajax_refresh_occupancy                   
            var jsonObj = JSON.parse(data);    //获得jsonObj对象
            var used = jsonObj.dhcpstatus[0].used;
            var total = jsonObj.dhcpstatus[0].total;
            $("#apply").html("total:"+total+"; used:"+used); 
            $("#modeType").text("Mode");
            $("#vendorMode0").text("Vendor");
            $("#deviceMode0").text("Device"); 
        },    
        error:function() {    
            alert("异常！");    
        }    
        });  
    })

    // detail_scope0
    detail_scope0.addEventListener('click', function(){

        var aj = $.ajax( {    
        url:'productManager_reverseUpdate',  
        type:'get',    
        cache:true,  
        dataType:'json',  
        success:function(data) {   
            console.log(data); 
            var jsonObj = JSON.parse(data);       
            $("#detail0_info").html(jsonObj);
        },    
        error : function() {      
            alert("异常！");    
        }    
        });  
    })

    // detail_scope1
    detail_scope1.addEventListener('click', function(){

        var aj = $.ajax( {    
        url:'productManager_reverseUpdate?',  
        type:'get',    
        cache:true,  
        dataType:'json',  
        success:function(data) {   
            console.log(data); 
            var jsonObj = JSON.parse(data);       
            $("#detail0_info").html(jsonObj);
        },    
        error : function() {      
            alert("异常！");    
        }    
        });  
    })


 // ajax_refresh_scope0_occupancy 定时局部刷新
    $(function(){
        // set fresh time
        setInterval(refresh_scope0,300000);        
        function refresh_scope0(){     
          $("#scope0_occupancy").html("new imformation");       
          $.ajax({    
                 url: "",    
                 type: 'POST',   
                 dataType : 'json',  
                 data: {},    
                 success: function (data) {         
                      console.log(data);
                      // ajax_refresh_occupancy                   
                      var jsonObj = JSON.parse(data);    //获得jsonObj对象
                      var used = jsonObj.dhcpstatus[0].used;
                      var total = jsonObj.dhcpstatus[0].total;
                      $("#scope0_occupancy").html("total:"+total+"; used:"+used); 
                 },    
                 error : function(jqXHR) {  
                 alert("发生错误：" + jqXHR.status);  
                 },  
           }); 
        }
      });


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
  //                    // 导致出错的原因较多
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




