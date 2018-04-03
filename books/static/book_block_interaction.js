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

function create_detail_block_post_data(submit_div){
    authors = [];
    for( var i = 0; i < submit_div.find(".authors-container").find("input").length; i++){
        authors.push(submit_div.find(".authors-container").find("input").eq(i).val())
    }
    identifiers = [];
    for( var i = 0; i < submit_div.find(".identifier-container").find("li").length; i++){
        identifier_temp = submit_div.find(".identifier-container").find("select").eq(i).val() + ":" + submit_div.find(".identifier-container").find("input").eq(i).val();
        identifiers.push(identifier_temp)
    }
    return {
        detail_title: $(submit_div).find("#title").val(),
        detail_subtitle: $(submit_div).find("#subtitle").val(),
        detail_publisher: $(submit_div).find("#publisher").val(),
        detail_publisheddate: $(submit_div).find("#publisheddate").val(),
        detail_description: $(submit_div).find("#description").val(),
        detail_authors: authors,
        detail_identifiers: identifiers,
        detail_pk: $(submit_div).find("#pk").text(),
    }
}

