from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from . import views

app_name = 'home'

urlpatterns = [
    path('', views.home, name='home'),
    path('index', views.index, name='index'),

    path('login', views.Login.as_view(), name='login'),
    path('logout', views.Logout.as_view(), name='logout'),
    path('register', views.register, name='register'),

    # path('experiment', views.Experiment.as_view(), name='experiment'),
    # path('ajaxbase', views.ajax, name='ajaxify'),
    # url('all', views.all, name='all'),

    path('todo', views.TodoList.as_view(), name='todo'),
    path('add-todo', views.AddTodo.as_view(), name='add-todo'),
    path('<int:pk>/update-todo', views.TodoUpdate.as_view(), name='update-todo'),
    path('<int:pk>/delete-todo', views.TodoDelete.as_view(), name='delete-todo'),

    path('<int:todo_id>/add-task', views.AddTask.as_view(), name='add-task'),
    path('<int:todo_id>/view-task', views.TaskList.as_view(), name='view-task'),
    path('<int:pk>/update-task', views.TaskUpdate.as_view(), name='update-task'),
    path('<int:pk>/is-done-task', views.is_done_task, name='done-task'),
    path('<int:pk>/delete-task', views.TaskDelete.as_view(), name='delete-task'),
    
    path('<int:pk>/add-comment', views.AddComment.as_view(), name='add-comment'),
    path('<int:pk>/view-comment', views.CommentList.as_view(), name='view-comment'),
    path('<int:pk>/update-comment', views.CommentUpdate.as_view(), name='update-comment'),
    path('<int:pk>/delete-comment', views.CommentDelete.as_view(), name='delete-comment'),
    
]


