function cannl() {
	window.history.back(-1);
}
function  save_device(form){
	if (form.deviceid.value == '') {
		alert("请输入设备号!");
		form.deviceid.focus();
		return false;
	}
	alert("设备添加成功！")
	return true;
}