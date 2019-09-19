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
