$('[hasemails]').each((i, el) => {
    h = $(el).html();
    h = h.replace("***emails***","jme10@rice.edu");
    $(el).html(h);
})
toggleon = true;
function colorblind(){
    if(toggleon){
    $('#colorblock').css({"-webkit-filter": "grayscale(1)", "-moz-filter": "grayscale(1)", "-ms-filter":"grayscale(1)", "filter": "grayscale(1)", "color": "black"});
    toggleon = false;
    }
    else{
        $('#colorblock').removeAttr('style');
        toggleon = true;
    }
}

tohidetables = true;

function detailbuttonpress(){
    console.log('Button pressed');
    if(tohidetables){
        tohidetables = false;
        $("#detailbutton").html('<span class="icon is-small"><i class="fas fa-chevron-up"></i></span><span>Show Details</span>');
        $("#tablecols").hide();
    }
    else{
        tohidetables = true;
        $("#detailbutton").html('<span class="icon is-small"><i class="fas fa-chevron-down"></i></span><span>Hide Details</span>');
        $("#tablecols").show();
    }
}