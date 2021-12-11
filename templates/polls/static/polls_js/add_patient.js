function cannl() {
	window.history.back(-1);
}
function  save_patient(form){
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
	alert("病人添加成功！")
	return true;
}