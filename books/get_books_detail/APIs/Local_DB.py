import os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import API_settings
from write_error_log import append_error_log

from books import utils, sql_operation

def get_book_detail( request_bar ):
    search = sql_operation.search()
    respond_object = search.search_using_identifier(request_bar)

    return_object = {}
    return_object["items"] = []
    if respond_object == 0:
        return_object["TotalItems"] = 0
    else:
        return_object["TotalItems"] = 1
        return_object["items"].append(utils.bookdetail_2_dictionary(respond_object))
   
    return return_object

