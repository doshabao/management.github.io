$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-pub', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                initEditor()
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件
    $('.layui-btn-danger').on('click', function () {
        $('#file')[0].click()
    })

    // 为文件选择框绑定 change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件
        console.log(e);
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }

        //1、拿到用户选择的文件
        var file = e.target.files[0]
        //2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
            })

    })

    //定义文章的发布状态
    var art_state = '已发布'
    $('btn_save2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定submit事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        //2.基于form表单 快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        //3、将文章的状态添加到表单中
        fd.append('state', art_state);
        //4、将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5、将文件对象存储到fd中
                fd.append('cover_img', blob);
                //6、发起ajax数据请求
                publishArticle(fd);
            })

        fd.forEach(function (v, k) {
            console.log(v, k);
        })
    })

    // 6、定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意如果向服务器提交的是 FormData 格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/04-阶段四%20前端后交互/后台大事件管理项目/article/art_List.html'
            }
        })
    }


})