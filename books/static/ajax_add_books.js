// create_post_data's parameter
// parameter = {
// substance_information : true/false
// isbn : true/false
// option : true/false
// detail : true/false
// detail_submit_target : (A jquery object)
// }
var A_clear_book_detail_block //A jquery object
var TEST = "initial"
function create_post_data(parameter){
    var response_object = {};
    if(parameter["substance_information"]){
        response_object = Object.assign(response_object,{
            information_location: $("#location").val(),
            information_possessor: $("#possessor").val(),
            information_notas: $("#notas").val(),
        })
    }
    if(parameter["isbn"]){
        response_object = Object.assign(response_object,{
            isbn_input: $("#isbn-input").val(),
        })
    }
    if(parameter["option"]){
        response_object = Object.assign(response_object,{
        })
    }
    if(parameter["detail"]){ 
        submit_div = parameter["detail_submit_target"];

        authors = [];
        for( var i = 0; i < submit_div.find(".authors-container").find("input").length; i++){
            authors.push(submit_div.find(".authors-container").find("input").eq(i).val())
        }
        identifiers = [];
        for( var i = 0; i < submit_div.find(".identifier-container").find("li").length; i++){
            identifier_temp = submit_div.find(".identifier-container").find("select").eq(i).val() + ":" + submit_div.find(".identifier-container").find("input").eq(i).val();
            identifiers.push(identifier_temp)
        }

        response_object = Object.assign(response_object,{
            detail_title: $(submit_div).find("#title").val(),
            detail_subtitle: $(submit_div).find("#subtitle").val(),
            detail_publisher: $(submit_div).find("#publisher").val(),
            detail_publisheddate: $(submit_div).find("#publisheddate").val(),
            detail_description: $(submit_div).find("#description").val(),
            detail_authors: authors,
            detail_identifiers: identifiers,
            detail_pk: $(submit_div).find("#pk").text(),
        })
    }
    return response_object;
}

// Arguments :
//  verb : 'GET'|'POST'
//  target : an optional opening target (a name, or "_blank"), defaults to "_self"
//  https://stackoverflow.com/questions/17793183/how-to-replace-window-open-with-a-post
open_new_window = function(verb, url, data, target) {
	var form = document.createElement("form");
	form.action = url;
	form.method = verb;
	form.target = target || "_self";
	if (data) {
		for (var key in data) {
			var input = document.createElement("textarea");
			input.name = key;
			input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			form.appendChild(input);
		}
	}
	form.style.display = 'none';
	document.body.appendChild(form);
	form.submit();
};

//filled up display item and append
function filled_up_display_item(E, destination){
    var display_item = A_clear_book_detail_block.clone();
    display_item.find("#title").val(E["title"]);
    display_item.find("#subtitle").val(E["subtitle"]);
    display_item.find("#publisher").val(E["publisher"]);
    display_item.find("#publisheddate").val(E["publisheddate"]);
    display_item.find("#description").val(E["description"]);
    display_item.find("#source").html(E["source"]);
    display_item.find("#pk").html(E["pk"]);
    A_clear_author_item = A_clear_book_detail_block.find(".author-item").clone();
    for(var j in E["authors"]){
        if(j == 0){
            display_item.find(".author-item").find(":input").val(E["authors"][j])
        }
        else{
            new_author_item = A_clear_author_item.clone();
            new_author_item.find(":input").val(E["authors"][j]);
            new_author_item.appendTo(display_item.find(".authors-container"));
        }
    }
    A_clear_identifier_item = A_clear_book_detail_block.find(".identifier-item").clone();
    for(var j in E["industryIdentifiers"]){
        if(j == 0){
            display_item.find(".identifier-item").find(":input").val(E["industryIdentifiers"][j]["identifier"]);
        }
        else{
            new_identifier_item = A_clear_identifier_item.clone();
            //failing. so I move select after appendTo
            new_identifier_item.find(":input").val(E["industryIdentifiers"][j]["identifier"]);
            new_identifier_item.appendTo(display_item.find(".identifier-container"));
        }
    }
    display_item.appendTo("body");
    
    //fill up select
    for(var j in E["industryIdentifiers"]){
        $(".book-detail-block:last").find(".identifier-container").find("select").eq(j).val(E["industryIdentifiers"][j]["type"]);
    }
}

function submit_book_detail_to_store_ajax(submit_div){
        request_post_data_parameter = {
            substance_information : true,
            isbn : false,
            option : false,
            detail : true,
            detail_submit_target : submit_div,
        }
        $.ajax({
            url: "/detail-to-store/",
            type: "POST",
            data: create_post_data(request_post_data_parameter),
            error: function(){
                display_status_message("Ajax request error");
            },
            success: function( response ){
                TEST = response;
                switch(response["status"]){
                    case "success":
                        $(".book-detail-block").remove();
                        $("#isbn-input").focus();
                        break;
                    case "Identifier_duplicate":
                        pass_data = {
                            csrfmiddlewaretoken: CSRF_TOKEN,
                            pk: response["pk"],
                            user_book: response["user_book"],
                        };
                        var new_window = window.open("about:blank", "Book_Duplicate", "width=700,height=500,resizable,scrollbars=yes,status=1");
						open_new_window("POST", "../duplicate-book/", pass_data, "Book_Duplicate");
                        break;
                        
                }
            },
        });
}
function isbn_to_book_detail_ajax(){

    request_post_data_parameter = {
        substance_information : false,
        isbn : true,
        option : false,
        detail : false,
    }

    $.ajax({
        url: "/add-books-ajax/",
        type: "POST",
        data: create_post_data(request_post_data_parameter),
        error: function() {
            display_status_message("Ajax request error");
            //var display_item = A_clear_book_detail_block.clone();
            //display_item.appendTo("body");
        },
        success: function( response ){
            if(response["status"] == "invalid_identifier"){
                display_status_message("invalid identifier")
            }
            else{
                $(".book-detail-block").remove();
            }

            for(var i = 0;i < response["TotalItems"];i++ )
            {
                E = response["items"][i];
                filled_up_display_item(E, "body")
            }
            if(response["TotalItems"] == 0){
                var display_item = A_clear_book_detail_block.clone();
                display_item.appendTo("body");
            }
        }
    });
}

$(document).ready(function(){
    A_clear_book_detail_block = $(".book-detail-block").clone();
    $("#isbn-input").focus();
    $("#sent-isbn").click(function(){
        isbn_to_book_detail_ajax();
    });
    $("#isbn-input").keypress(function(keyin){
        if(keyin.which == 13){
            isbn_to_book_detail_ajax();
            return false;
        }
    });
});
$(document).on("click", "#submit-book-to-store", function(event){
    event.preventDefault();
    submit_book_detail_to_store_ajax($(this.parentElement))
});
