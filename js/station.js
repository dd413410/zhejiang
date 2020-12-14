layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls',
	func: 'func'
});
layui.use(['urls', 'func', 'form', 'laypage'], function() {

	var $ = layui.$,
		urls = layui.urls,
		url = urls.url,
		ajax = urls.ajax,
		func = layui.func,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage;


	var center = "自建站",
		type = "",
		page = 1,
		start = "",
		end = "";

	function checks() {
		ajax({
			url: url.stype,
			type: "get",
			data: {},
			success: function(res) {
				var data = res.data;
				var typeStr = '';
				for (var j = 0; j < data.length; j++) {
					typeStr += '<option value="' + data[j].pk + '">' + data[j].fields.title + '</option>';
				}
				$('#type').html(typeStr);
				layForm.render('select');
				type = data[0].pk;
				getListFn();
			},
			error: function(r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			},
		});
	}
	checks();

	function getListFn() {
		ajax({
			url: url.status,
			type: "get",
			data: {
				center: center,
				type: type,
				pageSize: 10,
				pageNum: page
			},
			success: function(res) {
				$("#tbody").empty();
				var data = res.data;
				var count = res.count;
				$("#count").html(count);
				count > 10 ? $("#pag").show() : $("#pag").hide();
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<div class="layui-row tbody">' +
						'<div class="layui-col-xs3">' + dataItem.station + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.ofStation + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.newFileTime + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.stationStatus + '</div>' +
						"</div>";
				};
				$("#tbody").html(str);
				
				laypage.render({
					elem: "pag",
					count: count,
					curr: page,
					theme: "#5a98de",
					jump: function(obj, is) {
						if (!is) {
							page = obj.curr;
							getListFn();
						}
					},
				});
			}
		});
	};


	$("#sear").click(function() {
		center = $("#center").val();
		type = $("#type").val();
		page = 1;
		getListFn();
	});

	$("#close").click(function() {
		urls.close();
	});
});
