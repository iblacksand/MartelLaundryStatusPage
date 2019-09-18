$('[hasemails]').each((i, el) => {
    h = $(el).html();
    h = h.replace("***emails***","jme10@rice.edu");
    $(el).html(h);
})