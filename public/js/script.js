$("form").on("submit", function(event){
    const field = $("#item").val().trim().length;
    if(field<=0){

        event.preventDefault();
    }
    $("#item").trigger("focus");
});

$("input:checkbox").on("click", function(){


    $.ajax({
        method: "POST",
        url: "/delete",
        data: { id: $(this).attr("value"), listName: $("#listName").attr("value") },
        success: function(data){
            if(data==='Hoy'){
                window.location.reload();
            }else{
                window.location.replace("http://localhost:3000/category/"+data);
            }
            
           
        }
    })
  
});

$( function() {
    $( "#item" ).trigger( "focus" );
  } );