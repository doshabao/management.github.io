$(function () {
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('#oldPwd').val()) {
                // return layer.msg('新旧密码不能相同')
                return "新旧密码不能相同"
            }
        },
        rePwd: function (value) {
            if (value !== $('#newPwd').val()) {
                return "两次密码输入不一致"
            }
        }

    })


    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                return layer.msg(res.message);
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })

})