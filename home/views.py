from django.urls import reverse_lazy
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from .models import Todo, Task, Comment
from django.contrib.auth.models import User
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic import ListView
from django.views.generic.detail import SingleObjectMixin
from django.http import JsonResponse
from django.views import View
from django.core import serializers




# Create your views here.

def home(request):
    return render(request, 'home/home.html', {})

def index(request):
    return render(request, 'home/index.html', {})
    
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home:login')
    else:
        form = UserCreationForm()
        context = {'form': form}
        return render(request, 'home/register.html', context)

def is_done_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.is_done = not  task.is_done
    task.save()
    return HttpResponse(status=204)

class Login(LoginView):
    pass


class Logout(LogoutView):
    pass


class TodoList(ListView):
    model = Todo
    template_name = 'home/todo_list.html'
    context_object_name = 'todo_list'
    
    def  get_queryset(self):
        return Todo.objects.filter(user=self.request.user)


class TaskList(ListView):
    template_name = 'home/task_list.html'
    context_object_name = 'todo'

    def get_queryset(self):
        return Todo.objects.filter(pk=self.kwargs['todo_id'])[0]


class CommentList(ListView):
    template_name = 'home/comment_list.html'
    context_object_name = 'task'

    http_method_names = ['get',]

    def get_queryset(self):
        return Task.objects.filter(pk=self.kwargs['pk'])[0]


class AddTodo( CreateView):
    model = Todo
    fields = ['title',]

    def form_valid(self, form):
        user = User.objects.filter(id=self.request.user.pk)[0]
        form.instance.user = user
        return super().form_valid(form)


class AddTask(CreateView):
    model = Task
    fields = [
        'task_name',
        'priority',
        'deadline',
    ]

    def form_valid(self, form):
        todo_list =Todo.objects.filter(pk=self.kwargs["todo_id"])[0]
        form.instance.todo_list = todo_list
        form.instance.is_done = False
        return super().form_valid(form)


class AddComment(CreateView):
    model = Comment
    fields = {
        'content',
        'file',
    }
    

    def form_valid(self, form):
        print(form)
        print(self.kwargs["pk"])
        task = Task.objects.filter(pk=self.kwargs["pk"])[0]
        form.instance.task = task 
        return super().form_valid(form)

    def form_invalid(self, form):
        print(form)
        return HttpResponse("This was invalid")


class TodoUpdate(UpdateView):
    model = Todo
    fields = ['title']


class TaskUpdate(UpdateView):
    model = Task
    fields = [
        'task_name',
        'priority',
        'is_done',
        'deadline'
    ]


class CommentUpdate(UpdateView):
    model = Comment
    fields = [
        'content',
        'file'
    ]


class AjaxDeleteView(SingleObjectMixin, View):
    """
    Works like DeleteView, but without confirmation screens or a success_url.
    """
    def post(self, *args, **kwargs):
        self.object = self.get_object()
        self.object.delete()
        return HttpResponse(status=204)
    
    def get(self, *args, **kwargs):
        self.object = self.get_object()
        self.object.delete()
        return HttpResponse(status=204)


class TodoDelete(AjaxDeleteView):
    model = Todo


class TaskDelete(AjaxDeleteView):
    model = Task


class CommentDelete(AjaxDeleteView):
    model = Comment


# def all(request):
#     todos = Todo.objects.filter(user=request.user)
#     return render(request, 'home/all.html', {'todos': todos})

# def ajax(request):
#     return  render(request, 'home/ajaxbase.html', {})

# def todolist(request):
#     context = {}
#     if request.user.is_authenticated:
#         all_todo = Todo.objects.filter(user=request.user)
#         for todo in all_todo:
#             context[todo.title]= Task.objects.filter(todo_list=todo)
#         context['all_todo'] = all_todo
#     return  render(request, 'home/todo_list.html', context)    


# class Experiment(CreateView):
#     model = Todo
#     fields = ['title',]

# class AjaxableResponseMixin:
#     def form_invalid(self, form):
#         response = super().form_invalid(form)
#         if self.request.is_ajax():
#             return HttpResponse(form.errors, status=400)
#         else:
#             return response

#     def form_valid(self, form):
#         response = super().form_valid(form)
#         if self.request.is_ajax():
#             print("We are in here", response)
#             return HttpResponse("Hi")
#         else:
#             print("This is not ajax")
#             return response