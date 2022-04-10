window.onload=function (){
	userspan=document.getElementById('muser')
	userspan.innerHTML=user[0];
}
function cannl() {
	window.history.back(-1);
}
function  save_patient(){
	patient_id=document.getElementById('text1').value
    patient_name=document.getElementById('text2').value
	patient_gender=document.getElementById('text3').value
	patient_birthday=document.getElementById('text4').value
	patient_physician=document.getElementById('text5').value
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/add_patient/addpatient/",
          method: "POST",
          data: {
			  "patient_id": patient_id,
			  "patient_name": patient_name,
			  "patient_gender": patient_gender,
			  "patient_birthday": patient_birthday,
			  "patient_physician": patient_physician,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert('病人添加成功！')
                $('input','#add_patient_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
          },
          error:function() {undefined
                alert("病人ID已存在！");
          }
    })
	function test(){
		if (patient_id === '') {
		alert("ID不能为空!");
		return false;
		}
		if (patient_name === '') {
			alert("姓名不能为空!");
			return false;
		}
		if (patient_gender === '') {
			alert("性别不能为空!");
			return false;
		}
		if (patient_birthday === '') {
			alert("生日不能为空!");
			return false;
		}
		if (patient_physician === '') {
			alert("医生不能为空!");
			return false;
		}
		if (patient_id.length>20) {
			alert("病人ID最大为20位！");
			return false;
		}
		if (patient_name.length>20) {
			alert("病人姓名最大为20位！");
			return false;
		}
		if (patient_gender.length>20) {
			alert("病人性别最大为20位！");
			return false;
		}
		if (patient_birthday.length>20) {
			alert("病人生日最大为20位！");
			return false;
		}
		if (patient_physician.length>20) {
			alert("病人医生最大为20位！");
			return false;
		}
		return true;
		}
}
function putout(){
	// alert('ssss')
	var flag=confirm("是否确定登出？");
	if(flag){
		console.log('out')
		$.ajax({
			  url: "/polls/login/putout/",
			  method: "POST",
			  data: {
				  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
			  },
			  success: function () {
					alert('登出成功！')
				  window.location.href="http://127.0.0.1:8000/polls/login/";
			  },
			  error:function() {undefined
					alert("登出错误！");
			  }
    	})
	}
}