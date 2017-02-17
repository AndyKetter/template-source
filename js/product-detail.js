$(function () {
    $('#JS_send').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var name = $('.f-name').val();
        var company = $('.f-company').val();
        var email = $('.f-email').val();
        var phone = $('.f-phone').val();
        var message = $('.f-message').val();
        $.ajax({
            url: 'http://zhan.esmtong.cn/index.php?c=applicationform&a=post',
            type: 'POST',
            dataType: 'json',
            data: {
                name: name,
                company:company,
                email:email,
                phone:phone,
                message:message
            }
        })
        .done(function(res) {
            if (res.status === 1) {
                $('#JS-save-success').find('.modal-body').text('保存成功');
                $('#JS-save-success').modal();
                $('.f-name').val("");
                $('.f-company').val("");
                $('.f-email').val("");
                $('.f-phone').val("");
                $('.f-message').val("");
            }else {
                $('#JS-save-success').find('.modal-body').text('保存失败');
                $('#JS-save-success').modal();
            }
        })
    });
});
