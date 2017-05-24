$(document).ready(function(){

	var localCfg = {
		"Mode" : "NULL",
		"DhcpStatus" : []
	}

	reflesh();
	setInterval(reflesh, 5000);	

    $("#mode li").click(function() {
        if ($(this).text() == "SEQUENCED") {
			localCfg.Mode = "FIFO";
		} else {
			localCfg.Mode = $(this).text();
		}
		
        console.log("Mode changes to: " + localCfg.Mode)
        $("#modeText").text($(this).text());
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
	
	function scopeDisplay(str) {
		scopeArr = str.split(" ");
		return scopeArr[0] + "/" + maskToPrefix(scopeArr[1]);
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
			localCfg.DhcpStatus[vendorID].Vendor = textTransfer($(this).text());
			setVendorText(localCfg.DhcpStatus[vendorID].Vendor, vendorID);
		});
	}
	function setDeviceBtn(deviceID) {
		$(".deviceList:eq(" + deviceID + ")").find("a").click(function() {
		    localCfg.DhcpStatus[deviceID].DeviceClass = textTransfer($(this).text());
			setDeviceText(localCfg.DhcpStatus[deviceID].DeviceClass, deviceID);			
		});	
	}
	
	function reflesh() {
		$.ajaxSettings.async = false;
		$.getJSON("./update", function(data) {
		console.log(data)
			var oldListNum = $(".scopeList").length;
			var listNum = data.DhcpStatus.length;
			
			if (localCfg.Mode == "NULL") {
				$("#modeText").text(data.Mode);
			}
			
			if (listNum > oldListNum) {
				for (i = oldListNum; i < listNum; i++) {
					$.get("public/row.html", function(row) {
						$("#display").append(row);	
					});
					
					setVendorBtn(i);
					setDeviceBtn(i);
				}
			} else {
				for (i = 0; i < oldListNum - listNum; i++) {
					$(".scopeList:last").remove();
					$(".rowDivider:last").remove();	
				}
			}
			console.log(localCfg);
			console.log(data);
			$(".scope").each(function(index) {
				var scope = data.DhcpStatus[index].Scope;
				$(this).html(scopeDisplay(scope) + "<br>");
				
				
				for (i = 0; i < localCfg.DhcpStatus.length; i++) {
					if (scope == localCfg.DhcpStatus[i].Scope) {
						setVendorText(localCfg.DhcpStatus[i].Vendor, index);
						setDeviceText(localCfg.DhcpStatus[i].DeviceClass, index);
						break;
					}
				}
				if (i == localCfg.DhcpStatus.length) {
					setVendorText(data.DhcpStatus[index].Vendor, index);
					setDeviceText(data.DhcpStatus[index].DeviceClass, index);
				}
				
				$(".detail:eq(" + index + ")").click(function() {
					$("#InfoIndex").empty();
					$("#InfoValue").empty();
					indexText = 
			 					  "Total :   " + "<br>"
			 					+ "Used :   " + "<br>"
			 					+ "Avail :   " +  "<br>"
			 					+ "Unavail :   " + "<br>"
			 					+ "Deactivated :   " + "<br>"
			 					+ "Offered :   " + "<br>"
			 					+ "TotalDynamic :  " + "<br>"
			 					+ "TotalReserved :  ";
					
					valueText = 
			 					  data.DhcpStatus[index].Total + "<br>"
			 					+ data.DhcpStatus[index].Used + "<br>"
			 					+ data.DhcpStatus[index].Avail + "<br>"
			 					+ data.DhcpStatus[index].Unavail + "<br>"
			 					+ data.DhcpStatus[index].Deactivated + "<br>"
			 					+ data.DhcpStatus[index].Offered + "<br>"
			 					+ data.DhcpStatus[index].TotalDynamic + "<br>"
			 					+ data.DhcpStatus[index].TotalReserved;
					$("#scopeTitle").html(data.DhcpStatus[index].Scope)
					$("#InfoIndex").html(indexText);
					$("#InfoValue").html(valueText);					
				});						
			});
			
			localCfg.Mode = $("#modeText").text();
			localCfg.DhcpStatus = data.DhcpStatus;
			for (i = 0; i < localCfg.DhcpStatus.length; i++) {
				localCfg.DhcpStatus[i].DeviceClass = textTransfer($(".deviceBtn:eq(" + i + ")").text());
				localCfg.DhcpStatus[i].Vendor = textTransfer($(".vendorBtn:eq(" + i + ")").text());	
			}
			
			$(".progress-bar").each(function(index) {
				var total = data.DhcpStatus[index].Total;
				var used = data.DhcpStatus[index].Used;
				var percentage = 100 * used/total;
				percentage = Math.round(percentage * 100)/100;
				
				$(this).attr("style", "width: " + percentage + "%");
				if (percentage > 90) {
					$(this).attr("class", "scopebar progress-bar progress-bar-danger");
				} else {
					$(this).attr("class", "scopebar progress-bar");
				}
			});	

			$(".barText").each(function(index){
				var total = data.DhcpStatus[index].Total;
				var used = data.DhcpStatus[index].Used;
				var percentage = 100 * used/total;
				percentage = Math.round(percentage * 100)/100;
			
				$(this).html(percentage + "%");
			});
			
		});
		$.ajaxSettings.async = true;
	};


	$("#applyBtn").click(function() {
		var myData = JSON.stringify(localCfg);
		console.log("apply btn:");
		console.log(myData);
		$.post("./apply", myData, function(postData, status) {
			alert("Apply " + status);
			reflesh();
		});
	});
});



