// This file is use to interact with book block's contain
// like add author field or remove identifier etc.
$(document).on("click","#add-new-authors",function(event){
    event.preventDefault();
    var new_author_item = $(".author-item:first").clone();
    new_author_item.find(":input").val("");
    $(this).parent().find(".authors-container").append(new_author_item);
});
$(document).on("click","#add-new-identifier",function(event){
    event.preventDefault();
    var new_identifier_item = $(".identifier-item:first").clone();
    new_identifier_item.find(":input").val("");
    $(this).parent().find(".identifier-container").append(new_identifier_item);
});
$(document).on("click", ".remove-author", function(event){
    event.preventDefault();
    if($(this.parentElement.parentElement).find(".author-item").length != 1){
        $(this).closest($(this)).parent().remove();
    }
});
$(document).on("click", ".remove-identifier", function(event){
    event.preventDefault();
    if($(this.parentElement.parentElement).find(".identifier-item").length != 1){
        $(this).closest($(this)).parent().remove();
    }
});

