
from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED

from .models import Todo
from .serializers import TodoSerializer


def home(request):
    return render(request, "home.html")


@api_view(["GET", "POST"])
def todos_list(request):
    if request.method == "GET":
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True)
        return Response({
            "todos": serializer.data,
            "status_choices": [
                {"value": key, "label": label}
                for key, label in Todo.StatusChoice.choices
            ],
            "priority_choices": [
                {"value": key, "label": label}
                for key, label in Todo.PriorityChoice.choices
            ],
        })

    if request.method == "POST":
        name = request.data.get("name")
        description = request.data.get("description", "")
        status = request.data.get("status", "in_progress")  # Значение по умолчанию
        priority = request.data.get("priority", "low")  # Значение по умолчанию
        due_date = request.data.get("due_date", None)  # Можно передать None, если не указан due_date

        # Создаем новый Todo объект
        todo = Todo.objects.create(
            name=name,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date
        )
        serializer = TodoSerializer(todo, many=False)
        return Response(serializer.data, status=HTTP_201_CREATED)


@api_view(["GET", "DELETE", "PATCH"])
def todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response({"error": "Todo not found"}, status=HTTP_200_OK)

    if request.method == "GET":
        serializer = TodoSerializer(todo, many=False)
        return Response(serializer.data)

    if request.method == "DELETE":
        todo.delete()
        return Response(status=HTTP_200_OK)

    if request.method == "PATCH":
        name = request.data.get("name", todo.name)
        description = request.data.get("description", todo.description)
        status = request.data.get("status", todo.status)
        priority = request.data.get("priority", todo.priority)
        due_date = request.data.get("due_date", todo.due_date)

        # Обновляем поля объекта Todo
        todo.name = name
        todo.description = description
        todo.status = status
        todo.priority = priority
        todo.due_date = due_date
        todo.save()

        serializer = TodoSerializer(todo, many=False)
        return Response(serializer.data)