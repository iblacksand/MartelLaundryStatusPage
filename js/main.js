$('[hasemails]').each((i, el) => {
    h = $(el).html();
    h = h.replace("***emails***","jme" + "10" + "@" +"r" +"ice" + "." + "edu");
    $(el).html(h);
}) // replaces fields with [hasemails] with real emails so bots can't scrape emails from the website and spam it
toggleon = true; // true if button will activate filter
function colorblind(){ // changes the website from color to black and white
    if(toggleon){
    $('#colorblock').css({"-webkit-filter": "grayscale(1)", "-moz-filter": "grayscale(1)", "-ms-filter":"grayscale(1)", "filter": "grayscale(1)", "color": "black"}); // changes all of the contenst under colorblock div to be under a b&w filter
    toggleon = false;
    }
    else{
        $('#colorblock').removeAttr('style'); // remove filter from div
        toggleon = true;
    }
}

tohidetables = true; // to hide tables of the washer/dryer status on button press

function detailbuttonpress(){
    if(tohidetables){ // will hide the tables
        tohidetables = false; 
        $("#detailbutton").html('<span class="icon is-small"><i class="fas fa-chevron-down"></i></span><span>Show Details</span>');
        $("#tablecols").hide();
    }
    else{ // show the tables
        tohidetables = true;
        $("#detailbutton").html('<span class="icon is-small"><i class="fas fa-chevron-up"></i></span><span>Hide Details</span>');
        $("#tablecols").show();
    }
}