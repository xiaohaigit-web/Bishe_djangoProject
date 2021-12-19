function zhuche() {
    window.location.href="regiter";
}
function login_submit(form){
    if (form.username.value === '') {
		alert("用户名不能为空!");
		form.username.focus();
		return false;
	}
	if (form.password.value === '') {
		alert("密码不能为空!");
		form.password.focus();
		return false;
	}
    return true;
}