window.onload=function (){
	userspan=document.getElementById('muser')
	userspan.innerHTML=user[0];
}

function cannl() {
	window.history.back(-1);
}
function  save_device(){
	deviceid=document.getElementById('_device_text').value
    // alert(deviceid.length)
	var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/add_device/adddevice/",
          method: "POST",
          data: {
			  "deviceid": deviceid,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert('设备添加成功！')
                $('input','#add_device_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
          },
          error:function() {undefined
                alert("设备号已存在！");
          }
    })
	function test(){
		if (deviceid === '') {
			alert("请输入设备号!");
			return false;
		}
        if (deviceid.length>10) {
			alert("设备号最大为10位！");
            // document.getElementById('_device_text').style.borderColor='red';
			return false;
		}
		return true;
	}

}