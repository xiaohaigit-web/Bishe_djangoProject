window.onload=mycreat;
function mycreat(){
	userspan=document.getElementById('muser')
	userspan.innerHTML=user[0];
	//console.log(typeof ret)
	for (i=0;i<ret.length;i++){
		console.log(ret[i].patient_id);
		//console.log(typeof ret[i])
		//找到要添加节点的父节点(table)
		var tb = document.getElementById("data");
		//创建tbody节点，表格中必须有tbody才能添加，直接添加tr不成功
		var tbody = document.createElement("tbody");
		//创建tr节点
		var tr = document.createElement("li");
		tr.id='data__tr'+i.toString();
		tr.className='data_tr';
		tr.style.border='black'
		//创建td节点
		var td = document.createElement("li");
		td.id='data__td'+i.toString();
		td.className='data_td';

		var span1 = document.createElement("span");
		span1.className='data_span';
		span1.innerHTML=ret[i].patient_id;
		var span2 = document.createElement("span");
		span2.className='data_span';
		span2.innerHTML=ret[i].patient_name;
		var span3 = document.createElement("span");
		span3.className='data_span';
		span3.innerHTML=ret[i].patient_gender;
		var span4 = document.createElement("span");
		span4.className='data_span';
		span4.innerHTML=ret[i].patient_birthday;

		var span7 = document.createElement("span");
		span7.className='data_span';
		span7.innerHTML=ret[i].patient_physician;

		var span5 = document.createElement("input");
		span5.className='butten5';
		span5.id='data_span5';
		span5.type='button';
		span5.value='编辑';
		span5.onclick=function (){
			bianji(this);
		};
		var span6 = document.createElement("input");
		span6.className='butten6';
		span6.id='data_span6';
		span6.type='button';
		span6.value='删除';
		if (ret[i].bind_status===1){
			span6.disabled=true;
			span6.style.backgroundColor="#f0eded"

		}
		span6.onclick=function (){
			delete_patient(this);
		};
		td.appendChild(span1);
		td.appendChild(span2);
		td.appendChild(span3);
		td.appendChild(span4);
		td.appendChild(span7);
		td.appendChild(span5);
		td.appendChild(span6);
		tr.appendChild(td);
		tb.appendChild(tr);
	}
}
function bianji(item){
	document.getElementById("bianji").style.display='block';
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('edit_send').value=data;
	for (i=0;i<ret.length;i++){
		if(ret[i].patient_id===data){
			document.getElementById('text_id').value=ret[i].patient_id;
			document.getElementById('text_name').value=ret[i].patient_name;
			document.getElementById('text_gender').value=ret[i].patient_gender;
			document.getElementById('text_birthday').value=ret[i].patient_birthday;
			document.getElementById('text_physician').value=ret[i].patient_physician;
		}

	}

}
function bianji_cannl(){
	document.getElementById("bianji").style.display='none';
}
function checkbianji(){
	edit_id=document.getElementById('edit_send').value
	patient_id=document.getElementById('text_id').value
    patient_name=document.getElementById('text_name').value
	patient_gender=document.getElementById('text_gender').value
	patient_birthday=document.getElementById('text_birthday').value
	patient_physician=document.getElementById('text_physician').value
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/admin_patient/edit/",
          method: "POST",
          data: {
			  "edit_id":edit_id,
			  "patient_id": patient_id,
			  "patient_name": patient_name,
			  "patient_gender": patient_gender,
			  "patient_birthday": patient_birthday,
			  "patient_physician": patient_physician,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert('病人更新成功！')
                $('input','#bianji_form_')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
				bianji_cannl();
				location=location
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
		return true;
	}
}
function delete_patient(item){
	document.getElementById("delete_patient").style.display='block';
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('de_patient_id').value=data;
	var data1=item.parentNode.parentNode.id
	document.getElementById('de_patient_id').name=data1;

}
function de_patient(){
	patient_id=document.getElementById('de_patient_id').value
	de_tr_id=document.getElementById('de_patient_id').name
	console.log();
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/admin_patient/de_patient/",
          method: "POST",
          data: {
			  "patient_id": patient_id,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert(patient_id+'病人删除成功！')
                $('input','#de_patient_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
				document.getElementById(de_tr_id).remove();
				delete_cannl();
          },
          error:function() {undefined
                alert(patient_id+"病人绑定中！");
          }
    })
	function test(){
		// if (patient_physician === '') {
		// 	alert("医生不能为空!");
		// 	return false;
		// }
		return true;
		}
}
function delete_cannl(){
	document.getElementById("delete_patient").style.display='none';
}
function putout_mouseover(item){
	item.style.cursor = 'pointer';
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
