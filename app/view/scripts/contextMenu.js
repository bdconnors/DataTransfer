$('.jumbotron').on('#context-menu',(e)=>{

    let top = e.pageY -10;
    let left = e.pageX -90;
    $().css({
        display:block,
        top:top,
        left:left

    }).addClass('show');
    return false;


}).on('click',()=>{
    $('#context-menu').removeClass('show').hide();
});

$('#context-menu a').on('click',()=>{
    $(this).parent.removeClass('show').hide();
});