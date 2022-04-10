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
from polls.models import User, Patient_Device, Patient, Device, Row_Data
from collections import Iterable
from django.contrib.auth.decorators import login_required
from lib.mypage import Pagination
from django.db.models import Max


# 登陆装饰器
# def login_auth_session(func):
#     def inner(request, *args, **kwargs):
#         path = request.get_full_path()
#         """
#         检测用户当前路径,用于用户点击其他页面也需要用户登录
#         """
#         if request.session.get('name'):  # 这里使用request.session.get('xxx')判断用户到底是否登录
#             return func(request, *args, **kwargs)
#
#         # 用户没有登录，其先前点击的路径将会拼接到登录页面的后面
#         return redirect('/polls/login/?next=%s' % path)
#
#     return inner

def login_auth_cookie(func):
    def inner(request, *args, **kwargs):
        path = request.get_full_path()
        """
        检测用户当前路径,用于用户点击其他页面也需要用户登录
        """
        print(request.COOKIES.get('key'))
        if request.COOKIES.get('key'):  # 这里使用request.COOKIES.get判断用户到底是否登录
            return func(request, *args, **kwargs)
        else:
            # 用户没有登录，其先前点击的路径将会拼接到登录页面的后面
            return redirect('/polls/login/?next=%s' % path)

    return inner

# 登录页面
def login(request):
    return render(request, 'polls/login.html', status=200)

# 注册页面
@login_auth_cookie
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
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username, password)
        print(type(username), type(password))
        user = User.objects.all()
        for var in user:
            print(var.username, var.password)
            if var.username == username and str(var.password) == password:
                next_ = request.GET.get('next')  # 获取用户/login/后面的路径
                print(next_)
                if next_:
                    # 用户一旦登录跳转至用户之前打开位置的网址
                    res = redirect(next_)
                    res.set_cookie(key='key', value=username + ',' + password)
                    request.session.set_expiry(0)
                else:
                    # 用户没有点击其他网页跳转会首页网页
                    res = redirect('/polls/login/admin_patient/')
                    res.set_cookie(key='key', value=username + ',' + password)
                    request.session.set_expiry(0)
                return res
    # 用户密码有误或者不登录将一直在登陆页面
    return HttpResponse(status=400)

    # a = request.POST
    # username = a.get('username')
    # password = a.get('password')
    # user_tup = (username, password)
    # db = pymysql.connect(host='127.0.0.1',
    #                      port=3306,
    #                      user='root',
    #                      password='210014',
    #                      db='django')
    # cursor = db.cursor()
    # # sql = 'select * from polls_user'
    # sql = User.objects.all()
    # # cursor.execute(sql)
    # # all_users = cursor.fetchall()
    # all_users = sql
    # cursor.close()
    # db.close()
    # has_user = 0
    # for var in all_users:
    #     print(var.username, type(var.username))
    #     print(var.password, type(var.password))
    #     if user_tup[0] == var.username and user_tup[1] == str(var.password):
    #         has_user = 1
    # if has_user == 1:
    #     # return render(request, 'polls/admin_patient.html')
    #     return redirect('admin_patient')
    # else:
    #     return HttpResponse(status=400)

@login_auth_cookie
def admin_device(request):
    patientid_all = Patient.objects.all()
    patient_device_all = Patient_Device.objects.all()
    device_all = Device.objects.all()
    device_list = []
    patientid_list = []

    paginator = Paginator(device_all, 10)
    try:
        page_number = request.GET.get('page', '1')
        page = paginator.page(page_number)
    except (PageNotAnInteger, EmptyPage, InvalidPage):
        # 如果出现上述异常，默认展示第1页
        page = paginator.page(1)

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

    for i in page.object_list:
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
    user = request.COOKIES['key']
    user = user.split(',')
    return render(request, 'polls/admin_device.html', {'ret': device_list,
                                                       'page': page,
                                                       'patientid_list': patientid_list,
                                                       'user': user,
                                                       })

@login_auth_cookie
def tiwen(request):
    global device_status
    global patient_device
    all_data = []
    patient_list = []
    all_patient = Patient.objects.all()
    for i in all_patient:
        row = []
        rtime = []
        if i.have_data == 1:
            device = Patient_Device.objects.get(patient_id=i.patient_id)
            device_status = device.device_status
            patient_device = device.deviceid
            data = Row_Data.objects.filter(deviceid__contains=device.deviceid)
            all_data.append(data)
            for j in data:
                row.append(float(j.row))
                timeArray = time.localtime(j.recordTime)
                otherStyleTime = time.strftime("%Y-%m-%d %H:%M", timeArray)
                rtime.append(otherStyleTime)
        else:
            device_status = 2
            # patient_device = '无设备'
        if len(row) > 288:
            row = row[len(row) - 288:]
            rtime = rtime[len(rtime) - 288:]
        # print('row:', len(row), i.patient_id)
        # print('rtime:', len(rtime))
        patient_dirt = {
            "patient_id": i.patient_id,
            "patient_name": i.patient_name,
            "patient_gender": i.patient_gender,
            "patient_birthday": i.patient_birthday,
            "patient_physician": i.patient_physician,
            "device_status": device_status,
            "patient_device": patient_device,
            "patient_row_data": row,
            "patient_row_time": rtime
        }
        patient_list.append(patient_dirt)

    # print(len(patient_list))
    # for i in  patient_list:
    #     print(i)

    return render(request, 'polls/tiwen.html', {
        'patient_list': patient_list,
    })

@login_auth_cookie
def admin_patient(request):
    patient_device = Patient_Device.objects.all()
    json_list = []
    # 1. 把需要分页的数据全部查询出来；
    user_list = Patient.objects.all()
    # 2. 利用user_list数据，创建一个分页器对象
    # 参数1：要分页的数据；参数2：设置每页要展示的数据个数；参数3：如果最后一页不到5个数据，是否将最后一页的数据合并到上一页进行展示；默认是False，不合并；
    paginator = Paginator(user_list, 10)
    # 3. 创建页面对象Page，每一个page对应的是每一个页面，这个page中包含：
    # page对象有三个属性：
    # a> page.number: 表示当前查询的页码；
    # b> page.object_list: 表示当前页要展示的数据；
    # c> page.paginator: 它就是上面创建的Paginator(user_list, 5)这个对象，无论是哪一页，这个paginator对象始终跟着Page对象；
    try:
        page_number = request.GET.get('page', '1')
        page = paginator.page(page_number)
    except (PageNotAnInteger, EmptyPage, InvalidPage):
        # 如果出现上述异常，默认展示第1页
        page = paginator.page(1)
    print(type(page.object_list))
    print(page)
    for i in page.object_list:
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
    user = request.COOKIES['key']
    user = user.split(',')
    print(user[0])
    return render(request, 'polls/admin_patient.html', {
        'page': page,
        'ret': json_list,
        'user': user,
    })

# 添加病人页面
@login_auth_cookie
def add_patient(request):
    user = request.COOKIES['key']
    user = user.split(',')
    return render(request, 'polls/add_patient.html', {'user': user, })

@login_auth_cookie
def add_device(request):
    user = request.COOKIES['key']
    user = user.split(',')
    return render(request, 'polls/add_device.html', {'user': user, })

@ensure_csrf_cookie
@login_auth_cookie
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
@login_auth_cookie
def addpatient(request):
    has_id = 0
    add_request = request.POST
    patient_id = add_request.get('patient_id')
    patient_name = add_request.get('patient_name')
    patient_gender = add_request.get('patient_gender')
    patient_birthday = add_request.get('patient_birthday')
    patient_physician = add_request.get('patient_physician')
    print(patient_id, patient_name, patient_gender)

    sql1 = Patient.objects.all()
    all_ids = sql1
    for var in all_ids:
        if patient_id == var.patient_id:
            # 表示该id已经存在
            has_id = 1
    if has_id == 0:
        db = pymysql.connect(host='127.0.0.1',
                             port=3306,
                             user='root',
                             password='210014',
                             db='django'
                             )
        # 创建游标
        cursor = db.cursor()
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
@login_auth_cookie
def edit(request):
    a = request.POST  # 获取post()请求
    edit_id = a.get('edit_id')
    patient_id = a.get('patient_id')
    patient_name = a.get('patient_name')
    patient_gender = a.get('patient_gender')
    patient_birthday = a.get('patient_birthday')
    patient_physician = a.get('patient_physician')
    print(edit_id)
    print(patient_id, patient_name, patient_gender, patient_birthday, patient_physician)
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
@login_auth_cookie
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
@login_auth_cookie
def release(request):
    a = request.POST  # 获取post()请求
    deviceid = a.get('patient_id')
    device_re = Patient_Device.objects.get(deviceid=deviceid)
    device_re.delete()
    return redirect('admin_device')

@ensure_csrf_cookie
@login_auth_cookie
def de_device(request):
    a = request.POST  # 获取post()请求
    deviceid = a.get('deviceid')
    device_de = Device.objects.get(deviceid=deviceid)
    device_de.delete()
    return HttpResponse(status=200)

@ensure_csrf_cookie
@login_auth_cookie
def de_patient(request):
    a = request.POST  # 获取post()请求
    patient_id = a.get('patient_id')
    print(patient_id)
    patient_de = Patient.objects.get(patient_id=patient_id)
    patient_de.delete()
    return redirect('admin_patient')

def save_row_data(request):
    add_request = request.POST
    deviceid = add_request.get('deviceid')
    row = add_request.get('row')
    recordtime = add_request.get('recordTime')
    count = 0  # device_status判断
    print(deviceid, row, recordtime)

    obj = Patient_Device.objects.get(deviceid=deviceid)
    patient = Patient.objects.get(patient_id=obj.patient_id)
    has = 0
    haved_recordtime = Row_Data.objects.filter(deviceid__contains=deviceid)
    for i in haved_recordtime:
        if recordtime == i.recordTime:
            has = 1
    if has == 0:
        db = pymysql.connect(host='127.0.0.1',
                             port=3306,
                             user='root',
                             password='210014',
                             db='django'
                             )
        # 创建游标
        cursor = db.cursor()
        reversetime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        sql21 = Row_Data(
            deviceid=deviceid,
            row=row,
            recordTime=recordtime,
            reverseTime=reversetime
        )
        patient.have_data = 1
        patient.save()
        sql21.save()
        db.commit()
        cursor.close()
        db.close()
        return HttpResponse(status=200)
    else:
        return HttpResponse('the patient recordtime haved!')

from django.core.paginator import Paginator, PageNotAnInteger, InvalidPage, EmptyPage

def select(request):
    # 1. 把需要分页的数据全部查询出来；
    user_list = Patient.objects.all()
    # 2. 利用user_list数据，创建一个分页器对象
    # 参数1：要分页的数据；参数2：设置每页要展示的数据个数；参数3：如果最后一页不到5个数据，是否将最后一页的数据合并到上一页进行展示；默认是False，不合并；
    paginator = Paginator(user_list, 4)
    # 3. 创建页面对象Page，每一个page对应的是每一个页面，这个page中包含：
    # page对象有三个属性：
    # a> page.number: 表示当前查询的页码；
    # b> page.object_list: 表示当前页要展示的数据；
    # c> page.paginator: 它就是上面创建的Paginator(user_list, 5)这个对象，无论是哪一页，这个paginator对象始终跟着Page对象；
    try:
        page_number = request.GET.get('page', '1')
        page = paginator.page(page_number)
    except (PageNotAnInteger, EmptyPage, InvalidPage):
        # 如果出现上述异常，默认展示第1页
        page = paginator.page(1)
    print(type(page))
    return render(request, 'polls/admin_patient.html', {'page': page})

def ajax_tiwen(request):
    row_list = []
    all_patient = Patient.objects.all()
    for i in all_patient:
        row = []
        rtime = []
        if i.have_data == 1:
            data = Row_Data.objects.filter(patient_id__contains=i.patient_id)
            for j in data:
                row.append(float(j.row))
                timeArray = time.localtime(j.recordTime)
                otherStyleTime = time.strftime("%Y-%m-%d %H:%M", timeArray)
                rtime.append(otherStyleTime)
        # if len(row) > 144:
        row = row[len(row) - 1:]
        # print('row:', len(row))
        # print('rtime:', len(rtime))
        # print('row: ', row)
        # print('tiem: ', rtime)
        if len(row) != 0:
            row_list.append(row[0])
        else:
            row_list.append('')
    # print(len(patient_list))
    # for i in patient_list:
    #     print(i)
    print(type(row_list))
    print(row_list)
    return HttpResponse(row_list)


@login_auth_cookie
def device_status(request):
    all_patient = Patient.objects.all()
    for i in all_patient:
        if i.have_data == 1:
            device = Patient_Device.objects.get(patient_id=i.patient_id)
            lastdata = Row_Data.objects.filter(deviceid__contains=device.deviceid).last()
            lastdata = lastdata.reverseTime
            timeArray = time.strptime(lastdata, "%Y-%m-%d %H:%M:%S")
            # 转换为时间戳:
            last_reversetime = int(time.mktime(timeArray))
            # print('last_reversetime:', last_reversetime, type(last_reversetime))
            nowtime = int(time.time())
            # print('nowtime:', nowtime, type(nowtime))
            old_status = Patient_Device.objects.get(patient_id=i.patient_id)
            if nowtime - last_reversetime < 120:
                old_status.device_status = 1
                old_status.save()
            else:
                old_status.device_status = 0
                old_status.save()
            print(i.patient_id, old_status.device_status)
    return HttpResponse(status=200)


def putout(request):
    res = redirect('/polls/login/')
    key = request.COOKIES['key']
    print('key:', key)
    res.delete_cookie('key')
    return res


def login_ajax(request):
    # print(request.body,type(request.body))
    # print(request.body.decode(),type(request.body.decode()))
    # print(json.loads(request.body),type(json.loads(request.body)))
    obj = json.loads(request.body)
    username = obj.get('username')
    password = obj.get('password')

    muser = User.objects.all()
    print(username, password)
    for user in muser:
        print(user.username, user.password)
        if username == user.username:
            print('_____')
            if str(user.password) == password:
                return_dirt = {
                    'flag': 1,
                    'msg': '登录成功！'
                }
                return_json = json.dumps(return_dirt)
                return HttpResponse(return_json)
            else:
                return_dirt = {
                    'flag': 2,
                    'msg': '密码错误！'
                }
                return_json = json.dumps(return_dirt)
                print(type(return_json))
                return HttpResponse(return_json)
    return_dirt = {
        'flag': 0,
        'msg': '用户不存在！'
    }
    return_json = json.dumps(return_dirt)
    return HttpResponse(return_json)


def old_ajax(request):
    a = request.POST
    username = a.get('username')
    password = a.get('password')
    try:
        obj = User.objects.get(username=username)
    except:
        return HttpResponse(status=401)

    if str(obj.password) == password:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=402)
