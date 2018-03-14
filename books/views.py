from books import models
from books import sql_operation
from books import utils

import json

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
        user_book = json.loads(request.POST["user_book"])
        user_book["industryIdentifiers"] = user_book["identifiers"]
        del user_book["identifiers"]

        pk = int(request.POST["pk"])

        db_book_obj = models.Bookdetails.objects.get(pk=pk)
        db_book = utils.bookdetail_2_dictionary(db_book_obj)

        physical_informations = utils.books_model_to_dict( db_book_obj.book_set.all() )

#        return render(request, "duplicate_books.html", {
#            "user_book": user_book,
#            "db_book": db_book,
#            "pk": pk,
#            })

        return render(request, "duplicate_books.html", locals())
    else:
        return HttpResponse("NO DATA")
