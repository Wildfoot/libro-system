from books import models
from books import utils
 
class store:
    "Store book in SQL"

    def store_identifier(self, industryidentifier, book_detail):
        #utils.check_isbn_issn(industryidentifier["identifier"])
        ret = models.BookIdentifier.objects.create(itype = industryidentifier["type"], identifier = industryidentifier["identifier"], belongbook = book_detail)
        return ret

    def store_author(self, author):
        author_name = ""
        author_name = "unknown" if author == "" else author
        obj, is_created = models.Author.objects.get_or_create(name = author_name)
        return obj

    def store_publisher(self, publisher):
        publisher_name = ""
        publisher_name = "unknown" if publisher == "" else publisher
        obj, is_created = models.Publisher.objects.get_or_create(name = publisher_name)
        return obj

    def store_book_detail(self, book_detail):
        # cover over if pk key exist
        ret = None
        if book_detail["pk"] != "":
            models.Bookdetails.objects.filter(pk = book_detail["pk"]).delete()
            ret = models.Bookdetails.objects.create(pk = book_detail["pk"])
        else:
            ret = models.Bookdetails.objects.create()
        ret.title = book_detail["title"]
        ret.subtitle = book_detail["subtitle"]
        ret.publisher = self.store_publisher(book_detail["publisher"])
        ret.published_date = book_detail["publisheddate"]
        ret.description = book_detail["description"]

        for author in book_detail["authors"]:
            ret.authors.add(self.store_author(author))
        
        for industryidentifier in book_detail["identifiers"]:
            self.store_identifier(industryidentifier, ret)

        ret.save()
        return ret

    def store_location(self, location):
        location_description = ""
        location_description = "unknown" if location == "" else location
        obj, is_created = models.Location.objects.get_or_create(description = location_description)
        return obj

    def store_possessor(self, possessor):
        possessor_name = ""
        possessor_name = "unknown" if possessor == "" else possessor
        obj, is_created = models.Possessor.objects.get_or_create(name = possessor_name)
        return obj

    def store_book(self, book_detail, substance_information):
        ret = models.Book.objects.create(notas = substance_information["notas"], location = self.store_location(substance_information["location"]), possessor = self.store_possessor(substance_information["possessor"]), detail = self.store_book_detail(book_detail))
        return ret

class search:
    "search from SQL"
    
    def search_using_identifier(self, identifier):
        try:
            obj = models.BookIdentifier.objects.get(identifier = identifier)
        except models.BookIdentifier.DoesNotExist:
            return 0
        else:
            return obj.belongbook
       

class check:
    "check SQL contain"
    def check_identifier_valid(self, identifier):
        utils.check_isbn_issn(identifier)

    def check_identifiers_valid(self, book_detail):
        for identifier in book_detail["identifiers"]:
            utils.check_isbn_issn(identifier["identifier"])

    def check_title_not_empty(self, book_detail):
        if book_detail["title"] == "":
            raise BookdetailValidError("title_empty")

    def check_resemble_book(self, book_detail):
        pass

# identifer can't check
#    def check_identifier_equal_model_in_db_using_pk(self, book_detail):
#        if book_detail["pk"] != "":
#            try:
#                obj = models.Bookdetails.objects.get(pk = int(book_detail["pk"]))
#                for bookidentifier in obj.bookidentifier_set.all():
#                    bookidentifier.identifier
#
#            except models.DoesNotExist:
#                pass

        
    def check_duplicate_identifier(self, identifier):
        try:
            obj = models.BookIdentifier.objects.get(identifier = identifier["identifier"])
        except models.BookIdentifier.DoesNotExist:
            return 0
        else:
            raise utils.IndustryIdentifierDuplicate("Identifier_duplicate", identifier["identifier"], obj.belongbook)
#        except:
#            #Unexpected Error
#            raise 

    def check_duplicate_books(self, book_detail):
        #ignore if pk exist
        if book_detail["pk"] != "":
#            self.check_identifier_equal_model_in_db_using_pk(book_detail)
            return 0

        for identifier in book_detail["identifiers"]:
            self.check_duplicate_identifier(identifier)
        return 0
