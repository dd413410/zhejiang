layui.config({
    base: '../../lib/model/'
}).extend({
    urls: 'urls'
});
layui.use(["urls", "form", "laydate", "laypage"], function () {
    var urls = layui.urls,
        url = urls.url,
        ajax = urls.ajax,
        $ = layui.$,
        layForm = layui.form,
        lay = layui.layer,
        laydate = layui.laydate,
        laypage = layui.laypage;

    var site = '国家站',
        siteType = 2,
        page = 1;

    function configFn() {
        ajax({
            url: url.contrast,
            type: 'get',
            data: {
                type: site,
                siteType: siteType,
                pageNum: page
            },
            success: function (res) {
                $('#tbody').empty();
                var datas = res.data;
                var time;
                var cheAll;
                var checkStr = '';
                // 头部全选循环
                var max = res.max;
                var headStr;
                if (siteType == 2) {
                    headStr = "<div>站名</div>" +
                        "<div>操作</div>" +
                        "<div class='type'>" +
                        "<input type='checkbox' value='m' lay-filter='port' lay-skin='primary'  title='分钟全选'/>" +
                        "<input type='checkbox' value='h' lay-filter='port' lay-skin='primary' title='小时全选'/>" +
                        "<input type='checkbox' value='d' lay-filter='port' lay-skin='primary' title='每天全选'/>" +
                        "</div>";
                } else {
                    headStr = "<div>站名</div>" +
                        "<div>操作</div>" +
                        "<div class='type'>" +
                        "<input type='checkbox' value='h' lay-filter='port' lay-skin='primary' title='小时全选'/>" +
                        "</div>";
                };
                var cheAlls = '';
                for (var m = 0; m < max; m++) {
                    cheAlls += "<div>" + "<input type='checkbox' value=" + m + " lay-filter='portElem' lay-skin='primary' title='全选'/>" + "</div>";
                };
                var headStr = headStr + cheAlls;
                $('#thead').html(headStr);

                for (var i = 0; i < datas.length; i++) {
                    var itemData = datas[i];
                    var m = itemData.m || 0, h = itemData.h || 0, d = itemData.d || 0;
                    var tle;
                    if (siteType == 2) {
                        var mInpt = m == 0 ? "<input type='checkbox' name='m' lay-skin='primary' title='分钟数据'/>" : "<input type='checkbox' name='m' checked lay-skin='primary' title='分钟数据'/>";
                        var hInpt = h == 0 ? "<input type='checkbox' name='h' lay-skin='primary' title='小时数据'/>" : "<input type='checkbox' name='h' checked lay-skin='primary' title='小时数据'/>";
                        var dInpt = d == 0 ? "<input type='checkbox' name='d' lay-skin='primary' title='每天数据'/>" : "<input type='checkbox' name='d' checked lay-skin='primary' title='每天数据'/>";
                        tle = "<div class='type'>" + mInpt + hInpt + dInpt + "</div>";
                    } else {
                        var hInpt = h == 0 ? "<input type='checkbox' name='h' lay-skin='primary' title='小时数据'/>" : "<input type='checkbox' name='h' checked lay-skin='primary' title='小时数据'/>";
                        tle = "<div class='type'>" + hInpt + "</div>";
                    };

                    var num = 0;
                    var str = '';
                    for (var e = 0; e < itemData.element.length; e++) {
                        var elemData = itemData.element[e];
                        if (elemData.checked == 0) {
                            str +=
                                '<div>' +
                                '<input type="checkbox" name="el" lay-skin="primary"  title="' + elemData.name + '" value="' + elemData.element + '" lay-filter="elem"/>' +
                                '</div>'
                        } else {
                            str +=
                                '<div>' +
                                '<input type="checkbox" name="el" checked lay-skin="primary"  title="' + elemData.name + '" value="' + elemData.element + '" lay-filter="elem"/>' +
                                '</div>';
                            num++
                        };
                        if (num == itemData.element.length) {
                            cheAll =
                                '<div class="name" name="' + itemData.name + '" title=\"' + itemData.name + '\">' + itemData.name + '</div>' +
                                '<div class="name">' +
                                '<input type="checkbox" name="cheAll" checked lay-skin="primary" value="' + itemData.id + '" lay-filter="cheAll"/>' +
                                '<span>全选</span>' +
                                '</div >';
                        } else {
                            cheAll =
                                '<div class="name" name="' + itemData.name + '" title=\"' + itemData.name + '\">' + itemData.name + '</div>' +
                                '<div class="name">' +
                                '<input type="checkbox" name="cheAll" lay-skin="primary" value="' + itemData.id + '" lay-filter="cheAll"/>' +
                                '<span>全选</span>' +
                                '</div >';
                        };
                    };
                    var hide = '<input type="hidden" name="stationCode" value="' + itemData.stationCode + '"/>' +
                        '<input type="hidden" name="stationNum" value="' + itemData.stationNum + '"/>' +
                        '<input type="hidden" name="stationNumCode" value="' + itemData.stationNumCode + '"/>';
                    checkStr += '<div class="item" id="' + itemData.id + '" type="' + itemData.type + '" >' + hide + cheAll + tle + str + '</div>';

                };
                $('#tbody').html(checkStr);
                layForm.render();
                var count = res.len;
                count > 10 ? $('#pag').show() : $('#pag').hide();
                laypage.render({
                    elem: 'pag',
                    count: count,
                    curr: page,
                    theme: '#5a98de',
                    jump: function (obj, is) {
                        if (!is) {
                            page = obj.curr;
                            configFn();
                        }
                    }
                });
            }
        });
    };
    configFn();
    /*
		@@@监听下拉框
	*/
    layForm.on('select(sele)', function (data) {
        site = data.value;
        page = 1;
        configFn();
        return false;
    });
    layForm.on('select(site)', function (data) {
        siteType = data.value;
        page = 1;
        configFn();
        return false;
    });

    /*
        @@@监听纵向全选
    */
    layForm.on('checkbox(port)', function (data) {
        var checked = data.elem.checked;
        var val = data.value;
        var dom = $('.item input[name=' + val + ']');
        if (checked) {
            for (var f = 0; f < dom.length; f++) {
                dom[f].checked = true;
            };
        } else {
            for (var f = 0; f < dom.length; f++) {
                dom[f].checked = false;
            };
        };
        layForm.render('checkbox');
        return false;
    });

    layForm.on('checkbox(portElem)', function (data) {
        var checked = data.elem.checked;
        var idx = siteType == 2 ? Number(data.value) + 4 : Number(data.value) + 2;
        var dom = $("#tbody .item");
        if (checked) {
            for (var d = 0; d < dom.length; d++) {
                var domItem = dom[d];
                var item = $(domItem).find("input[type='checkbox']").get(idx);
                if (item) {
                    item.checked = true;
                }
            };
        } else {
            for (var d = 0; d < dom.length; d++) {
                var domItem = dom[d];
                var item = $(domItem).find("input[type='checkbox']").get(idx);
                if (item) {
                    item.checked = false;
                }
            };
        }
        layForm.render('checkbox');
        return false;
    });

    /*
        @@@监听每行全选
    */
    layForm.on('checkbox(cheAll)', function (data) {
        var checked = data.elem.checked;
        var val = data.value;
        var dom = $('.item[id=' + val + ']')[0];
        // var subDom = $(dom).find($("input[name=el]"));
        var subDom = $(dom).find($("input"));
        if (checked) {
            for (var f = 0; f < subDom.length; f++) {
                subDom[f].checked = true;
            };
        } else {
            for (var f = 0; f < subDom.length; f++) {
                subDom[f].checked = false;
            };
        };
        layForm.render('checkbox');
        return false;
    });
    /*
        @@@监听每个复选框
    */
    layForm.on('checkbox(elem)', function (data) {
        var parDom = $(data.othis).parents('.item').get(0);
        var subDom = $(parDom).find($("input[name=el]"));
        var lth = 0;
        for (var i = 0; i < subDom.length; i++) {
            if (subDom[i].checked) {
                lth++
            }
        };
        var getDom = $(parDom).find($("input[name=cheAll]")).get(0);
        if (lth == subDom.length) {
            getDom.checked = true;
        } else {
            getDom.checked = false;
        };
        layForm.render('checkbox');
        return false;
    });

    $("#checkBtn").click(function () {
        var dataArr = [];
        $('#tbody .item').each(function () {
            var children = $(this).children("div").get(0);
            var name = $(children).attr('name');

            var check = $(this).find($("input[name=el]"));
            var elemArr = [];
            for (var c = 0; c < check.length; c++) {
                if (check[c].checked) {
                    var val = $(check[c]).val();
                    elemArr.push(val);
                };
            };
            var str = elemArr.join(',');

            var stationCode = $(this).find($("input[name=stationCode]")).val();
            var stationNum = $(this).find($("input[name=stationNum]")).val();
            var stationNumCode = $(this).find($("input[name=stationNumCode]")).val();

            var type = $(this).attr('type');
            var id = $(this).attr('id');

            var checkH = $(this).find($("input[name=h]")).get(0).checked;
            var h = checkH == false ? 0 : 1;
            var obj = {
                name: name,
                id: id,
                stationCode: stationCode,
                stationNum: stationNum,
                stationNumCode: stationNumCode,
                type: type,
                el: str,
                m: 0,
                h: h,
                d: 0
            };
            if (siteType == 2) {
                var checkM = $(this).find($("input[name=m]")).get(0).checked;
                var checkD = $(this).find($("input[name=d]")).get(0).checked;
                var m = checkM == false ? 0 : 1;
                var h = checkH == false ? 0 : 1;
                var d = checkD == false ? 0 : 1;
                obj.m = m;
                obj.d = d;
            };
            dataArr.push(obj);
        });
        conFn(dataArr);
    });

    function conFn(dataArr) {
        ajax({
            url: url.contrast,
            type: 'post',
            data: {
                data: JSON.stringify(dataArr)
            },
            success: function (res) {
                if (res.code == 200) {
                    lay.msg('设置要素成功!')
                }
            }
        });
    };
    /*
        @@@监听关闭页面
    */
    $('#close').click(function () {
        var index = parent.layer.getFrameIndex(window.name)
        parent.layer.close(index);
    });
});