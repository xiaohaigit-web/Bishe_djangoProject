window.onload=mycreat;
function mycreat(){
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
		tr.id='data__tr';
		tr.className='data_tr';
		tr.style.border='black'
		//创建td节点
		var td = document.createElement("li");
		td.id='data__td';
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
function checkbianji(form){
	if (form.patient_id.value == '') {
		alert("ID不能为空!");
		form.patient_id.focus();
		return false;
	}
	if (form.patient_name.value == '') {
		alert("姓名不能为空!");
		form.patient_name.focus();
		return false;
	}
	if (form.patient_gender.value == '') {
		alert("性别不能为空!");
		form.patient_gender.focus();
		return false;
	}
	if (form.patient_birthday.value == '') {
		alert("生日不能为空!");
		form.patient_birthday.focus();
		return false;
	}
	if (form.patient_physician.value == '') {
		alert("医生不能为空!");
		form.patient_physician.focus();
		return false;
	}
	// document.getElementById('bianji_li').style.display='none';
	alert("修改成功！")
	return true;
}
function delete_patient(item){
	document.getElementById("delete_patient").style.display='block';
	var data=item.parentNode.firstChild.textContent
	console.log(data);
	document.getElementById('de_patient_id').value=data;


}
function delete_cannl(){
	document.getElementById("delete_patient").style.display='none';
}

// var form = $('#bianji_form');
// var options = {
//          url: 'edit/',
//          type: 'post',
//          dataType: 'json',
//          data: form.serialize(),
//          success: function (data) {
//                  alert('修改成功！')
//           }
// };
// $.ajax(options);