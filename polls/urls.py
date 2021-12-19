from django.urls import path
from django.urls import re_path
from . import views

urlpatterns = [
    # path('login', views.login_view, name='login'),

    path('login/', views.login, name='login'),  # 用于打开登录页面
    path('login/regiter/', views.regiter, name='zhuche'),  # 用于打开注册页面
    path('login/regiter/save/', views.save, name='zhuche_save'),  # 输入用户名密码后交给后台save函数处理
    path('login/query/', views.query, name='login_query'),  # 输入用户名密码后交给后台query函数处理
    path('login/admin_device/', views.admin_device, name='admin_device'),
    path('login/admin_patient/', views.admin_patient, name='admin_patient'),
    path('login/tiwen/', views.tiwen, name='tiwen'),
    path('login/add_patient/', views.add_patient, name='add_patient'),
    path('login/add_device/', views.add_device, name='add_device'),
    path('login/add_patient/addpatient/', views.addpatient, name='addpatient'),
    path('login/add_device/adddevice/', views.adddevice, name='adddevice'),
    path('login/admin_device/bind/', views.bind, name='bind_patient'),
    path('login/admin_device/release/', views.release, name='release'),
    path('login/admin_device/de_device/', views.de_device, name='de_device'),
    path('login/admin_patient/de_patient/', views.de_patient, name='de_patient'),
    path('login/admin_patient/edit/', views.edit, name='edit_patient'),
    path('send_data/', views.save_row_data, name='save_rowdata'),
    path('login/tiwen/ajax_tiwen/', views.ajax_tiwen, name='ajax_tiwen'),
    path('select/', views.select),
    path('login/tiwen/device_status/', views.device_status),

    # re_path(r'^login/', views.login, name="login"),
    # re_path(r'^login/regiter/', views.regiter, name="regiter"),
    # re_path(r'^login/regiter/save/', views.save, name="save"),
    # re_path(r'^login/query', views.query, name="query"),

]
