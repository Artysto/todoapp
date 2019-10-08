function preAjax(csrftoken){
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
 
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

}

global_task_pk = 0;
global_comment_pk = 0;

function successTodoRefresh(){
$(document).ready(function(){
    console.log("Hi making ajax call for todo_list");
    $.ajax({
        url: 'todo',
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById("todo").innerHTML= res;
            }
            });
    });
}

successTodoRefresh();

function fetchTasks(pk){
    $.ajax({
        url: '/' + pk +'/view-task',
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById('task').innerHTML = res;
        }
    });
}

function successTaskRefresh(event, elementOn){
$(document).on(event, elementOn, function(){
    console.log("Hi making ajax call for task_list");
    var pk = $(this).attr('value')
    global_task_pk = pk;
    fetchTasks(pk);
});
}

successTaskRefresh('click', '.todos');

function fetchComments(pk){
    $.ajax({
        url: '/' + pk +'/view-comment',
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = res;
        }
    });
}

function successCommentRefresh(event, elementOn){
$(document).on(event,elementOn, function(){
    console.log("Hi making ajax call for comment_list");
    var pk = $(this).attr('value');
    global_comment_pk = pk;
    console.log(pk);
    fetchComments(pk);
});
}
successCommentRefresh('click', '.tasks');

// Capturing and transmitting delete todo event to server through Ajax
$(document).on('click','.todo_delete', function(event){
    console.log("Hi making an ajax call for todo delete")
    var url = $(this).attr('value');
    event.preventDefault();
    console.log(url);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = ""
            document.getElementById('task').innerHTML = ""
            successTodoRefresh();
        }
    });
});

// Capturing and transmitting delete task event to server through Ajax
$(document).on('click','.task_delete', function(event){
    console.log("Hi making an ajax call for task delete")
    var url = $(this).attr('value');
    event.preventDefault();
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = ""
            fetchTasks(global_task_pk);
        }
    });
});

// Capturing and transmitting done task event to server through Ajax
$(document).on('click','.task_done', function(event){
    event.preventDefault();
    var url = $(this).attr('value');
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = ""
            fetchTasks(global_task_pk);
        }
    });
});

// Capturing and transmitting delete comment event to server through Ajax
$(document).on('click','.comment_delete', function(event){
    console.log("Hi making an ajax call for comment delete")
    var url = $(this).attr('value');
    event.preventDefault();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            console.log(res);
            fetchComments(global_comment_pk);
        }
    });
});


//Capturing add todo event
$(document).on('click', '#add-todo', function(event){
    event.preventDefault();
    target = $(this);
    url = target.attr('href');
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = ""
            document.getElementById('task').innerHTML = ""
            string_html = "<h2>Add Todo</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        }
    })


});

adding_todo = true;

// Transmiting add todo event to server through Ajax

$(document).on("click", "#todo-submit", function(event){
    if(adding_todo == true){
    event.preventDefault();
    form = $('#todo-form');
    var url = $(form).attr('action');
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(form, csrftoken);
    var form_data = form;
    console.log(form);
    preAjax( csrftoken );    
    $.ajax({
        url: url,
        type: 'POST',
        data: form_data.serialize(),
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = ""
            document.getElementById('task').innerHTML = ""
            successTodoRefresh();
        },
        
        });
    
        }
    });

//Capturing add task event
var global_temp_url = "";
$(document).on('click', '#add-task', function(event){
    event.preventDefault();
    target = $(this);
    url = target.attr('href');
    global_temp_url =url;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            string_html = "<h2>Add Task</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        }
    })
});

adding_task = true;
// Transmiting add task event to server through Ajax
$(document).on("click", "#task-submit", function(event){
    if(adding_task == true){
        event.preventDefault();
        form = $('#task-form');
        var url = global_temp_url;
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        console.log(form, csrftoken);
        var form_data = form;
        console.log(form_data.serialize(), url );
        preAjax( csrftoken );    
        $.ajax({
            url: url,
            type: 'POST',
            data: form_data.serialize(),
            success: function(res){
                console.log(res);
                document.getElementById('comment').innerHTML = "";
                fetchTasks(global_task_pk);
                successTodoRefresh();
            },
            error: function(errors){
                console.log(errors);
            },
            
            });
        }
});    

//Capturing add comment event
$(document).on('click', '#add-comment', function(event){
    event.stopImmediatePropagation();
    event.preventDefault();
    target = $(this);
    var url = target.attr('href');
    global_temp_url = url;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            string_html = "<h2>Add Comment</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        }
    });  
});

adding_comment = true;
// Transmiting add comment event to server through Ajax
$(document).on('click', '#comment-submit', function(event){
    if(adding_comment == true){
event.preventDefault();
    form = $('#comment-form');
    var url = global_temp_url;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(csrftoken, url);
    console.log(this);
    var form_data = new FormData(form[0]);
    console.log(form_data);
    preAjax( csrftoken );    
    $.ajax({
        url: url,
        type: 'POST',
        contentType: false,
        processData: false,
        enctype: 'multipart/form-data',
        data: form_data,
        success: function(res){
            fetchComments(global_comment_pk);
            fetchTasks(global_task_pk);
            successTodoRefresh();
            
        },
        error: function(res_error){
            console.log(res_error);
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            document.getElementById('todo').innerHTML = res_error;
        },
    });
    } 
    
});


//Capturing update todo event
$(document).on( 'click', '.todo_update', function(event){
    adding_todo = false;
    var url = $(this).attr('value');
    global_temp_url = url;
    console.log('Captured click', url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            string_html = "<h2>Update Todo</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        },
    });
});


//Transmitting update todo event 
$(document).on("click", "#todo-submit", function(event){
    if(adding_todo == false){
    adding_todo = true;
    event.preventDefault();
    form = $('#todo-form');
    var url = global_temp_url;
    console.log(global_temp_url)
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(form, csrftoken);
    var form_data = form;
    console.log(form);
    preAjax( csrftoken );    
    $.ajax({
        url: url,
        type: 'POST',
        data: form_data.serialize(),
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            successTodoRefresh();
        },
        
        });
    
    }
    });

//Capturing update task event
$(document).on( 'click', '.task_update', function(event){
    adding_task = false;
    var url = $(this).attr('value');
    global_temp_url = url;
    console.log('Captured click', url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            string_html = "<h2>Update Task</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        },
    });
});


//Transmitting update task event 
$(document).on("click", "#task-submit", function(event){
    if(adding_task == false){
    adding_task = true;
    event.preventDefault();
    form = $('#task-form');
    var url = global_temp_url;
    console.log(global_temp_url)
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(form, csrftoken);
    var form_data = form;
    console.log(form);
    preAjax( csrftoken );    
    $.ajax({
        url: url,
        type: 'POST',
        data: form_data.serialize(),
        success: function(res){
            console.log(res);
            document.getElementById('comment').innerHTML = "";
            fetchTasks(global_task_pk);
            successTodoRefresh();
        },
        
        });
    
    }
    });

//Capturing update comment event
$(document).on( 'click', '.comment_update', function(event){
    adding_comment = false;
    var url = $(this).attr('value');
    global_temp_url = url;
    console.log('Captured click', url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res){
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            string_html = "<h2>Update Comment</h2>";
            string_html += res;
            document.getElementById('todo').innerHTML = string_html;
        },
    });
});

//Transmitting update todo event 
$(document).on("click", "#comment-submit", function(event){
    if(adding_comment == false){
    adding_comment = true;
    event.preventDefault();
    form = $('#comment-form');
    var url = global_temp_url;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(csrftoken, url);
    console.log(this);
    var form_data = new FormData(form[0]);
    console.log(form_data);
    preAjax( csrftoken );    
    $.ajax({
        url: url,
        type: 'POST',
        contentType: false,
        processData: false,
        enctype: 'multipart/form-data',
        data: form_data,
        success: function(res){
            fetchComments(global_comment_pk);
            fetchTasks(global_task_pk);
            successTodoRefresh();
            
        },
        error: function(res_error){
            console.log(res_error);
            document.getElementById('comment').innerHTML = "";
            document.getElementById('task').innerHTML = "";
            document.getElementById('todo').innerHTML = res_error;
        },
        });
    }
});
