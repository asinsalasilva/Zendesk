var email =$('edocr_widget').readAttribute('email');
$j(document).ready(function() {
  var url ='/proxy/direct?url=/zendesk?email='+email;
  $j.ajax({
            url: url,
            async: false,
			dataType: 'html'
      })
      .done(function(data){
		  var doc_data = eval('(' + data + ')');
		  var doc_str='';
		  for(i=0;i<doc_data.length;i++){
			 doc_str += '<div class="document_wrapper">';
			 doc_str += '<div class="document-data">';
			 doc_str += '<div class="document-thumb"><a href="'+doc_data[i].url+'" target="_blank"><img src="'+doc_data[i].picture+'" width="50 /></a></div>';
			 doc_str += '<div class="document-title"><a href="'+doc_data[i].url+'" target="_blank">'+ doc_data[i].title +'</a></div>';
			 doc_str += '<div class="document-description">'+ doc_data[i].teaser +'</div>';
			 doc_str += '</div>';
			 doc_str += '</div>';
		  }
		  doc_str += '<div class="clear"></div>';
		  var content = "<div id='form-content'>";
		  content += '<form id="edocr-search" onsubmit="searchDocuments(this); return false;">';
		  content += '<input type="text" name="q" value="" id="search_text"/>';
		  content += '<input type="hidden" name="page" value="1" id="page-val"/>';
		  content += '<input type="hidden" name="pages" value="1" id="page-count-val"/>';
		  content += '<input type="submit" id="submit" value="Search Edocr" class="button primary"/>'
		  content += '</form>';
		  content += '<div id="edocr-search-result"></div>';
		  content += "</div>"; 
		  
		  doc_str += '<br/><h2>Search Documents</h2>';
		  doc_str += content;
		  $('doc-container').innerHTML = doc_str;
      });
});

function searchDocuments(form){
 var result_str ="";
 var search_term = form['q'].value;
 var url = '/proxy/direct?url=/zendesk/search?q='+search_term;
 if(search_term.length > 3){
  $j.ajax({
            url: url,
            async: false,
			dataType: 'html'
      })
      .done(function(resultdata){
     var result_data = eval('(' + resultdata + ')');
	 var pagination="";
	 var data_length = result_data.length;
     for(i=0;i<(data_length-1);i++){
       result_str += '<div class="document_wrapper">';
       result_str += '<div class="document-data">';
       result_str += '<div class="document-thumb"><a href="'+result_data[i].url+'" target="_blank"><img src="'+result_data[i].picture+'" width="50" /></a></div>';
       result_str += '<div class="document-title"><a href="'+result_data[i].url+'" target="_blank">'+ result_data[i].title +'</a></div>';
	   result_str += '<div class="document-description">'+ result_data[i].teaser +'</div>';
       result_str += '</div>';
       result_str += '</div>';
     }
     if(result_data.length==0){
	  result_str = "0 result found";
	  }
       result_str += '<div class="clear"></div>';
       result_str += '<div>&nbsp;</div>';
	   var pages;
	   if(data_length >0){
	     pages = result_data[data_length-1].pagination;
	     pages = parseInt(pages);
	     $('page-count-val').value = pages;
         if(pages > 1){
		   for(j=1;j<(pages+1);j++){
		     pagination += '<a href="javascript: void(0)" onclick="setClass('+j+');moreDocuments('+j+');"';
			 if(j==1){
				pagination += 'class="selected"'; 
				 }
			 pagination += '>'+j+'</a>&nbsp';
			 if(j == 7) break;
		   }
	     }
	     if(pages > 7){
		     pagination += '&nbsp...';
		   }
	   }
       result_str += '<div class="clear"></div>';
       result_str += '<div>&nbsp;</div><div id="pagination">'+pagination+'</div>';
     $('edocr-search-result').innerHTML = result_str;
      });
   }
   else if(search_term.length > 0 && search_term.length <= 2){
     $('edocr-search-result').innerHTML = "Enter a valid text";
	 }
   else{
     $('edocr-search-result').innerHTML = "Enter a search text";
   }
}

function moreDocuments(page){
 var query = $('search_text').value;
 var page_val = parseInt(page);
 var new_limit = (page_val-1)*5;
 var num_pages = $('page-count-val').value;
 var selected = $('page-val').value;
 selected = parseInt(selected);
 num_pages = parseInt(num_pages);
 query = query.replace("^","");
 query += "^"+new_limit;
 
 var url = '/proxy/direct?url=/zendesk/search/more?q='+query;
  $j.ajax({
            url: url,
            async: false,
			dataType: 'html'
      })
      .done(function(resultdata){
     var result_data = eval('(' + resultdata + ')');
	 var pagination = '';
     var result_str ="";
     for(i=0;i<result_data.length;i++){
       result_str += '<div class="document_wrapper">';
       result_str += '<div class="document-data">';
       result_str += '<div class="document-thumb"><a href="'+result_data[i].url+'" target="_blank"><img src="'+result_data[i].picture+'" width="50" /></a></div>';
       result_str += '<div class="document-title"><a href="'+result_data[i].url+'" target="_blank">'+ result_data[i].title +'</a></div>';
	   result_str += '<div class="document-description">'+ result_data[i].teaser +'</div>';
       result_str += '</div>';
       result_str += '</div>';
     }
       result_str += '<div class="clear"></div>';
	   var end_str="";
	   var start_str="";
	   if(page_val <= 4){
	     for(j=1;j<(num_pages+1);j++){
		   pagination += '<a href="javascript: void(0)" onclick="setClass('+j+');moreDocuments('+j+');"';
		   if(selected == j){
			pagination += 'class="selected"';   
			   }
		   pagination += '>' +j+ '</a>&nbsp';
	       if(j >= 7){ break;}
			 }
		 if(num_pages > 7){
			 start_str="";
			 end_str="...";
			 }
		   }
	   else{
		 var start = 1;
		 var end = 1;
	     if(num_pages <= 7){
		   start = 1;
		   end = num_pages;
		   start_str="";
		   end_str="";
			 }
		 else{
		   start = page_val - 3;
		   end = page_val + 3;
		   start_str="...";
		   end_str="...";
			 }
		 for(j=start; j< (num_pages+1); j++){
		     pagination += '<a href="javascript: void(0)" onclick="setClass('+j+');moreDocuments('+j+');"';
		   if(selected == j){
			pagination += 'class="selected"';   
			   }
		   pagination += '>' +j+ '</a>&nbsp';
			 if(j==end) {break;}
			 }	 
		   }
       result_str += '<div>&nbsp;</div><div id="pagination">'+start_str+''+pagination+''+end_str+'</div>';
     if(result_data.length==0){
	  result_str = "no more result found";
	  }
     $('edocr-search-result').innerHTML = result_str;
      });
}
function setClass(page){
  $('page-val').value = page;
	}
