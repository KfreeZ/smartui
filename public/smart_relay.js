$(document).ready(function(){
	
	reflesh();
	setInterval(reflesh, 5000);
	
    var vendor = document.getElementById('vendor');
    // console.log(detail_scope0);
    console.log(vendor);
    var modeValue;
    var vendorValue = new Array(10);
    var deviceValue = new Array(10);
	var listNum = 0;

    $("#mode li").click(function() {
        // console.log('click');
        modeValue = $(this).text();       //获取点击li的值   
        console.log("Mode changes to: " + modeValue)
        $("#modeType").text(modeValue);
    });

	function setVendorBtn(index) {
		$(".vendorList:eq(" + index + ")").find("a").click(function() {
		   	vendorValue[index] = $(this).text();
		    if (vendorValue[index] == "Cancel") {
		    	$(".vendorBtn:eq(" + index + ")").text("Vendor");
		    	$(".vendorBtn:eq(" + index + ")").css("color","black");
		    } else {
		    	$(".vendorBtn:eq(" + index + ")").text(vendorValue[index]);
		    	$(".vendorBtn:eq(" + index + ")").css("color","#3473B2");
		    }
		});
	}
	function setDeviceBtn(index) {
		$(".deviceList:eq(" + index + ")").find("a").click(function() {
		    deviceValue[index] = $(this).text(); 
		    if (deviceValue[index] == "Cancel") {
		    	$(".deviceBtn:eq(" + index + ")").text("Device");
		    	$(".deviceBtn:eq(" + index + ")").css("color","black");
		    } else {
		    	$(".deviceBtn:eq(" + index + ")").text(deviceValue[index]);
		    	$(".deviceBtn:eq(" + index + ")").css("color","#3473B2");
		    }
		});	
	}
	
	
	function reflesh() {
		console.log("Mode changes to: " + modeValue)
		console.log("reflesh");
		$.ajaxSettings.async = false;
		$.getJSON("./output.json", function(data) {
			var oldListNum = $(".row").length;
			listNum = data.dhcpstatus.length;
			
			if (listNum > oldListNum) {
				for (i = oldListNum; i < listNum; i++) {
					$.get("./row.html", function(row) {
						$("#display").append(row);	
					});
					
					setVendorBtn(i);
					setDeviceBtn(i);
				}
			} else {
				for (i = 0; i < oldListNum - listNum; i++) {
					$(".row:last").remove();
					$(".rowDivider:last").remove();	
				}
			}

			$(".scope").each(function(index) {
				$(this).html(data.dhcpstatus[index].scope + "<br>");
			});
			$(".progress-bar").each(function(index) {
				var total = data.dhcpstatus[index].total;
				var used = data.dhcpstatus[index].used;
				var percentage = 100 * used/total;
				percentage = percentage.toFixed(2);
				$(this).html(percentage + "%");
				$(this).attr("style", "width: " + percentage + "%");
				if (percentage > 90) {
					$(this).attr("class", "scopebar progress-bar progress-bar-danger");
				} else {
					$(this).attr("class", "scopebar progress-bar");
				}
			});
		});
		$.ajaxSettings.async = true;
	};

	
    $("#applyBtn").click(function() {
       reflesh();
	});

		/*
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
					  *
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
*	
    });

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
*/

	/*
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
*/

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




