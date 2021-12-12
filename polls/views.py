# Create your views here.
import json
import time
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.serializers import serialize
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.shortcuts import HttpResponse
import pymysql
from polls.models import User, Patient_Device, Patient, Device
from collections import Iterable


# 登录页面
def login(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'polls/login.html')


# 注册页面
def regiter(request):
    return render(request, 'polls/zhuche.html')


# 定义一个函数，用来保存注册的数据
@ensure_csrf_cookie
def save(request):
    has_regiter = 0  # 用来记录当前账号是否已存在，0：不存在 1：已存在
    a = request.POST  # 获取get()请求
    # print("a:", a)
    # 通过get()请求获取前段提交的数据
    username = a.get('username')
    password = a.get('password')
    save_message = {
        'mn': '请输入用户名！',
        'mm': '请输入密码！',
        'ms': '注册成功！',
        'me': '账号已存在！请重新输入',
        'ma': '返回登录',
        'md': '重新输入'
    }
    # 连接数据库
    db = pymysql.connect(host='127.0.0.1',
                         port=3306,
                         user='root',
                         password='210014',
                         db='django'
                         )
    # 创建游标
    cursor = db.cursor()
    sql1 = User.objects.all()
    all_users = sql1
    for var in all_users:
        if username in var.username:
            # 表示该账号已经存在
            has_regiter = 1
    if has_regiter == 0:
        add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # 将用户名与密码插入到数据库中
        sql21 = User(username=username, password=password, add_time=add_time)
        sql21.save()
        db.commit()
        cursor.close()
        db.close()
        return render(request, 'polls/zhuche_succssfuly.html', {'save_message': save_message})
    else:
        return render(request, 'polls/zhanghaohaved.html', {'save_message': save_message})


@ensure_csrf_cookie
def query(request):
    a = request.POST
    username = a.get('username')
    password = a.get('password')
    user_tup = (username, password)
    db = pymysql.connect(host='127.0.0.1',
                         port=3306,
                         user='root',
                         password='210014',
                         db='django')
    cursor = db.cursor()
    # sql = 'select * from polls_user'
    sql = User.objects.all()
    # cursor.execute(sql)
    # all_users = cursor.fetchall()
    all_users = sql
    cursor.close()
    db.close()
    has_user = 0
    for var in all_users:
        print(var.username, type(var.username))
        print(var.password, type(var.password))
        if user_tup[0] == var.username and user_tup[1] == str(var.password):
            has_user = 1
    if has_user == 1:
        # return render(request, 'polls/admin_patient.html')
        return redirect('admin_patient')
    else:
        return HttpResponse(status=400)


def admin_device(request):
    patientid_all = Patient.objects.all()
    patient_device_all = Patient_Device.objects.all()
    device_all = Device.objects.all()
    device_list = []
    patientid_list = []
    for i in patientid_all:
        has_bind = 0
        for jj in patient_device_all:
            if i.patient_id == jj.patient_id:
                has_bind = 1
        if has_bind == 0:
            json_dirt = {
                "patient_id": i.patient_id,
            }
            patientid_list.append(json_dirt)

    for i in device_all:
        has_bind = 0
        n_j = 0  # 记录j
        for j in patient_device_all:
            if i.deviceid == j.deviceid:
                has_bind = 1
                n_j = j
        if has_bind == 1:
            json_dict = {
                "deviceid": n_j.deviceid,
                "patient_id": n_j.patient_id,
                "bind_time": n_j.bind_time,
            }
            device_list.append(json_dict)
        else:
            json_dict = {
                "deviceid": i.deviceid,
                "patient_id": '--',
                "bind_time": '--',
            }
            device_list.append(json_dict)
    # print(device_list)
    return render(request, 'polls/admin_device.html', {'ret': device_list,
                                                       'patientid_list': patientid_list,
                                                       })


def tiwen(request):
    return render(request, 'polls/tiwen.html')


def admin_patient(request):
    ret = Patient.objects.all()
    patient_device = Patient_Device.objects.all()
    # ret = serialize("json", ret)
    patient_device_list = []
    json_list = []
    for i in ret:
        print(i)
        json_dict = {
            "patient_id": i.patient_id,
            "patient_name": i.patient_name,
            "patient_gender": i.patient_gender,
            "patient_birthday": i.patient_birthday,
            "patient_physician": i.patient_physician
        }
        for j in patient_device:
            if i.patient_id == j.patient_id:
                json_dict['bind_status'] = 1
        json_list.append(json_dict)

    # for i in json_list:
    #     print(i['patient_id'])
    # print(isinstance(json_list, Iterable))
    return render(request, 'polls/admin_patient.html', {
        'ret': json_list,
    })

# 添加病人页面
def add_patient(request):
    return render(request, 'polls/add_patient.html')

def add_device(request):
    return render(request, 'polls/add_device.html')

@ensure_csrf_cookie
def adddevice(request):
    has_id = 0
    add_request = request.POST
    deviceid = add_request.get('deviceid')
    print('deviceid:', deviceid)
    db = pymysql.connect(host='127.0.0.1',
                         port=3306,
                         user='root',
                         password='210014',
                         db='django'
                         )
    # 创建游标
    cursor = db.cursor()
    sql1 = Device.objects.all()
    all_ids = sql1
    for var in all_ids:
        if deviceid in var.deviceid:
            ##表示该id已经存在
            has_id = 1
    if has_id == 0:
        add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        sql21 = Device(
            deviceid=deviceid,
            add_time=add_time,
        )
        sql21.save()
        db.commit()
        cursor.close()
        db.close()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=403)


@ensure_csrf_cookie
def addpatient(request):
    has_id = 0
    add_request = request.POST
    patient_id = add_request.get('patient_id')
    patient_name = add_request.get('patient_name')
    patient_gender = add_request.get('patient_gender')
    patient_birthday = add_request.get('patient_birthday')
    patient_physician = add_request.get('patient_physician')
    print(patient_id,patient_name,patient_gender)
    db = pymysql.connect(host='127.0.0.1',
                         port=3306,
                         user='root',
                         password='210014',
                         db='django'
                         )
    # 创建游标
    cursor = db.cursor()
    sql1 = Patient.objects.all()
    all_ids = sql1
    for var in all_ids:
        if patient_id == var.patient_id:
            # 表示该id已经存在
            has_id = 1
    if has_id == 0:
        add_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        sql21 = Patient(
            patient_id=patient_id,
            patient_name=patient_name,
            patient_gender=patient_gender,
            patient_birthday=patient_birthday,
            patient_physician=patient_physician,
            add_time=add_time,
        )
        sql21.save()
        db.commit()
        cursor.close()
        db.close()
        return HttpResponse("病人添加成功")
    else:
        return HttpResponse("id已存在")

@ensure_csrf_cookie
def edit(request):
    a = request.POST  # 获取post()请求
    edit_id = a.get('edit_id')
    patient_id = a.get('patient_id')
    patient_name = a.get('patient_name')
    patient_gender = a.get('patient_gender')
    patient_birthday = a.get('patient_birthday')
    patient_physician = a.get('patient_physician')
    print(edit_id)
    print(patient_id,patient_name,patient_gender,patient_birthday,patient_physician)
    has_patient_id = 0
    haved_id = Patient.objects.all()
    for i in haved_id:
        if patient_id == i.patient_id:
            has_patient_id = 1
    if edit_id == patient_id:
        has_patient_id = 0
    if has_patient_id != 1:
        edit_patient = Patient.objects.get(patient_id=edit_id)
        edit_patient.patient_id = patient_id
        edit_patient.patient_name = patient_name
        edit_patient.patient_gender = patient_gender
        edit_patient.patient_birthday = patient_birthday
        edit_patient.patient_physician = patient_physician
        edit_patient.save()
        return redirect('admin_patient')
    else:
        return HttpResponse(status=403)

@ensure_csrf_cookie
def bind(request):
    has_id = 0
    a = request.POST  # 获取post()请求
    # print("a:", a)
    # 通过get()请求获取前段提交的数据
    patient_id = a.get('patient_id')
    deviceid = a.get('bind_device')
    print(patient_id)
    print(deviceid)
    # 连接数据库
    db = pymysql.connect(host='127.0.0.1',
                         port=3306,
                         user='root',
                         password='210014',
                         db='django'
                         )
    # 创建游标
    cursor = db.cursor()
    sql1 = Patient.objects.all()
    all_users = sql1
    for var in all_users:
        if patient_id == var.patient_id:
            has_id = 1
    if has_id == 1:
        bind_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # 将patient_id与deviceid插入到数据库中
        sql21 = Patient_Device(patient_id=patient_id, deviceid=deviceid, bind_time=bind_time)
        sql21.save()
        db.commit()
        cursor.close()
        db.close()
        return redirect('admin_device')
    else:
        return HttpResponse(403)

@ensure_csrf_cookie
def release(request):
    a = request.POST  # 获取post()请求
    deviceid = a.get('patient_id')
    device_re = Patient_Device.objects.get(deviceid=deviceid)
    device_re.delete()
    return redirect('admin_device')

@ensure_csrf_cookie
def de_device(request):
    a = request.POST  # 获取post()请求
    deviceid = a.get('deviceid')
    device_de = Device.objects.get(deviceid=deviceid)
    device_de.delete()
    return HttpResponse(status=200)

@ensure_csrf_cookie
def de_patient(request):
    a = request.POST  # 获取post()请求
    patient_id = a.get('patient_id')
    print(patient_id)
    patient_de = Patient.objects.get(patient_id=patient_id)
    patient_de.delete()
    return redirect('admin_patient')
