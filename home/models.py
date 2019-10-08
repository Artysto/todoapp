from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import date

# Create your models here.
CHOICES = (('High','High'),('Normal','Normal'))


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)

    def get_absolute_url(self):
        return reverse('home:add-task', args=[self.pk])

    def __str__(self):
        return str(self.title)


class Task(models.Model):
    todo_list = models.ForeignKey(Todo, on_delete= models.CASCADE)
    task_name = models.CharField(max_length=250)
    priority = models.CharField(max_length=25, choices=CHOICES)
    is_done = models.BooleanField(default=False)
    deadline = models.DateField()

    def get_absolute_url(self):
        return reverse('home:add-comment', args=[self.pk])

    def __str__(self):
        return str(self.task_name)


class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete= models.CASCADE)
    content = models.CharField(max_length=250)
    file = models.FileField()

    def get_absolute_url(self):
        return reverse('home:index')

    def __str__(self):
        return "just_a_comment"