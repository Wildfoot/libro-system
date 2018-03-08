from books import models

from django.shortcuts import render
from django.http import HttpResponse

#from django.views.decorators.csrf import csrf_exempt

'''
def add_books(request):
	models.BookDetails.add_books(request.POST.get('books'))
	return HttpResponse('add books')
'''


def add_books(request):
    return render(request, "add_books.html", locals())

#@csrf_exempt
def duplicate_books(request):
    if request.method == "POST":
        user_book = {}
        db_book = {}
        return render(request, "duplicate_books.html", locals())
    else:
        return HttpResponse("NO DATA")
