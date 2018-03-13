# request and return object is all like:
#{
# TotalItems:1
# items:[
#   {
#   "title": "",
#   "subtitle": "",
#   "authors":
#   [
#       ""
#   ],
#   "publisher": "",
#   "publishedDate": "",
#   "industryIdentifiers":
#   [
#       {
#           "type": "ISBN_13",
#           "identifier": "9789862723807"
#       },
#       {
#           "type": "ISBN_10",
#           "identifier": "9862723807"
#     }
#   ],
#   "description": ""
#   "pk": (option)
#   "source": "which API"
#   }
# ]
#}

# [soytw] to add: category

#   Relative PATH
#import sys, os
#APIS_PATH = os.path.join(os.path.dirname(__file__), "APIs")
#sys.path.append(APIS_PATH)
#import Google_Books_API
#import xISBN_API
from books.get_books_detail.APIs import Google_Books_API, xISBN_API, Local_DB

def get_book_detail( request_bar ):
    return_object = {}
    return_object["TotalItems"] = 0
    return_object["items"] = []
    APIs = [Local_DB, Google_Books_API, xISBN_API]
    for API in APIs:
        try:
            respond_object = API.get_book_detail( request_bar )
        except:
            pass
        return_object["TotalItems"] = return_object["TotalItems"] + respond_object["TotalItems"]
        for item in respond_object["items"]:
            item["source"] = API.__name__
            item["source"] = item["source"].split(".")[-1]
            return_object["items"].append( item )

    return return_object

