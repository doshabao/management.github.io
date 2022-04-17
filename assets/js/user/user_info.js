$(function () {

    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })
    initUserInfo()
    //重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()

    })

    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    // console.log('获取用户基本资料失败');
                    layer.msg('获取用户基本资料失败')
                }
                console.log(res);
                //调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })

    }

    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认请求
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // renderAvatar(res.data)
                window.parent.getUserInfo()
            }
        })
    })

})