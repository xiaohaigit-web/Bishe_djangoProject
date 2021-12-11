window.onload=mycreat;
function mycreat(){
	for(i=0;i<ret.length;i++){
		//找到要添加节点的父节点(table)
		var tb = document.getElementById("data");
		//创建tbody节点，表格中必须有tbody才能添加，直接添加tr不成功
		var tbody = document.createElement("tbody");
		//创建tr节点
		var tr = document.createElement("li");
		tr.id='data__tr';
		tr.className='data_tr';
		tr.style.border='black'
		//创建td节点
		var td = document.createElement("li");
		td.id='data__td';
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
function unbind_patient(item){
}
function remove_(){
	var flag=confirm('确认删除？');
	if(flag){
		document.getElementById('data_span4').remove();
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
function patient_bind_cannl(){
	document.getElementById('bind').style.display='none';
	window.location.reload()
}
function delete_device(item){
	document.getElementById('delete_device').style.display='block';
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('de_device_id').value=data;
}
function delete_cannl(){
	document.getElementById('delete_device').style.display='none';
}