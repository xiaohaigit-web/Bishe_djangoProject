from django.db import models

# Create your models here.
from django.db import models


class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.IntegerField(default=0)
    add_time = models.CharField(max_length=20, default='2021-12-09 19:52:01')


class Patient(models.Model):
    patient_id = models.CharField(max_length=10)
    patient_name = models.CharField(max_length=20)
    patient_gender = models.CharField(max_length=20)
    patient_birthday = models.CharField(max_length=20)
    patient_physician = models.CharField(max_length=20)
    add_time = models.CharField(max_length=20, default='2021-12-09 19:52:01')
    have_data = models.IntegerField(default=0)


class Device(models.Model):
    deviceid = models.CharField(max_length=10)
    add_time = models.CharField(max_length=20, default='2021-12-09 19:52:01')


class Patient_Device(models.Model):
    patient_id = models.CharField(max_length=20)
    deviceid = models.CharField(max_length=10,default='0000000')
    bind_time = models.CharField(max_length=20, default='2021-12-09 19:52:01')
    device_status = models.IntegerField(default=0)


class Row_Data(models.Model):
    deviceid = models.CharField(max_length=10)
    row = models.CharField(max_length=20, default='0')
    recordTime = models.IntegerField()
    reverseTime = models.CharField(max_length=20, default='2021-12-09 19:52:01')
