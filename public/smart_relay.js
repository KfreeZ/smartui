$(document).ready(function(){
	
    var modeValue;
	var cfgArray = new Array();
	var listNum = 0;

	reflesh();
	setInterval(reflesh, 5000);	

    $("#mode li").click(function() {
        // console.log('click');
        modeValue = $(this).text();       //获取点击li的值   
        console.log("Mode changes to: " + modeValue)
        $("#modeType").text(modeValue);
    });

	function maskToPrefix(mask) {
		var prefix = 0;
		maskArr = mask.split(".");
		for (i = 0; i < 4; i++) {
			tmp = parseInt(maskArr[i]).toString(2);
			prefix += tmp.split("1").length - 1;
		}	
		return prefix;
	} 
	
	function textTransfer(str) {
		if (str == "Cancel" || str == "Vendor" || str == "Device") {
			return "NULL";
		}
		return str;
	}
	
	function setVendorText(str, vendorID) {
		if (str == "NULL") {
		    $(".vendorBtn:eq(" + vendorID + ")").text("Vendor");
		    $(".vendorBtn:eq(" + vendorID + ")").css("color","black");
		} else {
		    $(".vendorBtn:eq(" + vendorID + ")").text(str);
		    $(".vendorBtn:eq(" + vendorID + ")").css("color","#3473B2");
		}
	}
	function setDeviceText(str, deviceID) {
		if (str == "NULL") {
		    $(".deviceBtn:eq(" + deviceID + ")").text("Device");
		    $(".deviceBtn:eq(" + deviceID + ")").css("color","black");
		} else {
		    $(".deviceBtn:eq(" + deviceID + ")").text(str);
		    $(".deviceBtn:eq(" + deviceID + ")").css("color","#3473B2");
		}
	}
	
	function setVendorBtn(vendorID) {
		$(".vendorList:eq(" + vendorID + ")").find("a").click(function() {
			cfgArray[vendorID].vendor = textTransfer($(this).text());
			setVendorText(cfgArray[vendorID].vendor, vendorID);
		});
	}
	function setDeviceBtn(deviceID) {
		$(".deviceList:eq(" + deviceID + ")").find("a").click(function() {
		    cfgArray[deviceID].device = textTransfer($(this).text());
			setDeviceText(cfgArray[deviceID].device, deviceID);			
		});	
	}
	
	
	function reflesh() {
		$.ajaxSettings.async = false;
		//$.getJSON("./update", function(data) {
		$.getJSON("./public/output.json", function(data) {
		console.log(data)
			var oldListNum = $(".row").length;
			listNum = data.DhcpStatus.length;
			
			if (listNum > oldListNum) {
				for (i = 0; i < listNum - oldListNum; i++) {
					$.get("public/row.html", function(row) {
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
				var scope = data.DhcpStatus[index].scope;
				$(this).html(scope + "<br>");
				
				
				for (i = 0; i < cfgArray.length; i++) {
					if (scope == cfgArray[i].scope) {
						setVendorText(cfgArray[i].vendor, index);
						setDeviceText(cfgArray[i].device, index);
						break;
					}
				}
				if (i == cfgArray.length) {
					setVendorText("NULL", index);
					setDeviceText("NULL", index);
				}
			});
			
			cfgArray.splice(0, cfgArray.length);
			for (i = 0; i < listNum; i++) {
				var cfgValue = 
				{
					"scope": data.DhcpStatus[i].scope,
					"vendor": textTransfer($(".vendorBtn:eq(" + i + ")").text()),
					"device": textTransfer($(".deviceBtn:eq(" + i + ")").text()),		
				}
				cfgArray.push(cfgValue);
			}
			
			$(".progress-bar").each(function(index) {
				var total = data.DhcpStatus[index].Total;
				var used = data.DhcpStatus[index].Used;
				var percentage = 100 * used/total;
				percentage = Math.round(percentage * 100)/100;
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
            var used = jsonObj.DhcpStatus[0].used;
            var total = jsonObj.DhcpStatus[0].total;
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
                      var used = jsonObj.DhcpStatus[0].used;
                      var total = jsonObj.DhcpStatus[0].total;
                      $("#scope0_occupancy").html("total:"+total+"; used:"+used); 
                 },    
                 error : function(jqXHR) {  
                 alert("发生错误：" + jqXHR.status);  
                 },  
           }); 
        }
      });


});
*/







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




