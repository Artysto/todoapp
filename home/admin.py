from django.contrib import admin
from .models import Task, Todo, Comment
# Register your models here.

admin.site.register(Todo)

admin.site.register(Task)

admin.site.register(Comment)



