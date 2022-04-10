window.onload=mycreat;
function mycreat(){
	userspan=document.getElementById('muser')
	userspan.innerHTML=user[0];
	for(i=0;i<ret.length;i++){
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
		span1.innerHTML=ret[i].deviceid;
		var span2 = document.createElement("span");
		span2.className='data_span';
		span2.id='bind_patient';
		span2.innerHTML=ret[i].patient_id;
		var span3 = document.createElement("span");
		span3.className='data_span';
		span3.innerHTML=ret[i].bind_time;
		
		var span4 = document.createElement("input");
		span4.className='butten4';
		span4.id='data_span4';
		span4.type='button';
		span4.value='释放';
		if (ret[i].patient_id==='--'){
			span4.disabled=true;
			span4.style.backgroundColor="#f0eded"
		}
		span4.onclick=function(){
			unbind(this);
		};
		var span5 = document.createElement("input");
		span5.className='butten4';
		span5.id='data_span5';
		span5.type='button';
		span5.value='绑定';
		if (ret[i].patient_id!=='--'){
			span5.disabled=true;
			span5.style.backgroundColor="#f0eded"
		}
		span5.onclick=function(){
			patient_bind(this);
		};
		var span6 = document.createElement("input");
		span6.className='butten4';
		span6.id='data_span6';
		span6.type='button';
		span6.value='删除设备';
		if (ret[i].patient_id!=='--'){
			span6.disabled=true;
			span6.style.backgroundColor="#f0eded"
		}
		span6.onclick=function(){
			delete_device(this);
		};
		
		td.appendChild(span1);
		td.appendChild(span2);
		td.appendChild(span3);
		
		td.appendChild(span4);
		td.appendChild(span5);
		td.appendChild(span6);
		tr.appendChild(td);
		tb.appendChild(tr);
	}
}
function unbind(item){
	document.getElementById('unbind').style.display='block';
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('unbind_patient_id').value=data;
}
function unbind_cannl(){
	document.getElementById('unbind').style.display='none';
}
function unbind_butten(){
	patient_id=document.getElementById('unbind_patient_id').value
	console.log(patient_id);
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/admin_device/release/",
          method: "POST",
          data: {
			  "patient_id": patient_id,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert('病人解绑成功！')
                $('input','#unbind_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
				unbind_cannl();
				location=location
          },
          error:function() {undefined
                alert("病人解绑错误！");
          }
    })
	function test(){
		return true;
	}
}
function de_device_butten(item){
	deviceid=document.getElementById('de_device_id').value
	de_tr_id=document.getElementById('de_device_id').name
	console.log(de_tr_id);
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/admin_device/de_device/",
          method: "POST",
          data: {
			  "deviceid": deviceid,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert(deviceid+'设备删除成功！')
			    // var flagg=confirm('病人删除成功！');
				// if(flagg){
				// 	document.getElementById(de_tr_id).remove();
				// }
                $('input','#de_device_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
				document.getElementById(de_tr_id).remove();
				delete_cannl();
				// location=location
          },
          error:function() {undefined
                alert(deviceid+"设备删除错误！");
          }
    })
	function test(){
		return true;
	}
}
function patient_bind(item){
	document.getElementById('bind').style.display='block';
	for(i=0;i<patientid_list.length;i++){
		var ss=document.getElementById("bind_select");
		var option_bind=document.createElement("option");
		option_bind.value=patientid_list[i].patient_id;
		option_bind.innerHTML=patientid_list[i].patient_id;
		ss.appendChild(option_bind)
	}
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('bind_deviceid').value=data;
}
function bind_butten(){
	patient_id=document.getElementById('bind_select').value
	bind_deviice=document.getElementById('bind_deviceid').value
	console.log(patient_id);
    var flag = test();
    if (flag === false) {
         return;
    }
	$.ajax({
          url: "/polls/login/admin_device/bind/",
          method: "POST",
          data: {
			  "patient_id": patient_id,
			  "bind_device":bind_deviice,
			  "csrfmiddlewaretoken": $("[name = 'csrfmiddlewaretoken']").val()  // 使用jQuery取出csrfmiddlewaretoken的值，拼接到data中
          },
          success: function () {
                alert('病人绑定成功！')
                $('input','#bind_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('');
				patient_bind_cannl();
				location=location
          },
          error:function() {undefined
                alert("病人绑定错误！");
          }
    })
	function test(){
		return true;
	}
}
function patient_bind_cannl(){
	document.getElementById('bind').style.display='none';
	window.location.reload()
}
function delete_device(item){
	document.getElementById('delete_device').style.display='block';
	var data1=item.parentNode.parentNode.id
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	console.log(data1)
	document.getElementById('de_device_id').value=data;
	document.getElementById('de_device_id').name=data1;
}
function delete_cannl(){
	document.getElementById('delete_device').style.display='none';
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