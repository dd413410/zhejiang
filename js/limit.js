layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls',
	dtree: 'dtree',
	func: 'func'
});
layui.use(['urls', 'dtree', 'func', 'element', 'laydate', 'form', 'laypage'], function () {
	var urls = layui.urls,
		func = layui.func,
		url = urls.url,
		ajax = urls.ajax,
		$ = layui.$,
		util = layui.util,
		dtree = layui.dtree,
		layEle = layui.element,
		laydate = layui.laydate,
		layForm = layui.form,
		lay = layui.layer,
		laypage = layui.laypage;

	var userName = '',
		page = 1;
	var user = [];

	function list() {
		ajax({
			url: url.users,
			type: 'get',
			data: {
				name: userName,
				page_size: page
			},
			success: function (res) {
				$('#tbody').empty();
				user = res.results;
				var count = res.count;
				$('#count').html(count);
				count > 10 ? $('#pag').show() : $('#pag').hide();
				for (var u = 0; u < user.length; u++) {
					var str = '';
					str =
						'<div class="layui-row tbody">' +
						'<div class="layui-col-xs3">' + user[u].username + '</div>' +
						'<div class="layui-col-xs3">' + user[u].create_time + '</div>' +
						'<div class="layui-col-xs3">' + user[u].site + '</div>' +
						'<div class="layui-col-xs3">' +
						'<img onclick = "operFn(limChang,' + user[u].id + ')" src="../../static/1.png" title="修改密码"/>' +
						'<img onclick="operFn(limInfo,' + user[u].id + ')" src="../../static/2.png" title="修改信息"/>' +
						'<img onclick="limitFn(limit,' + user[u].id + ')" src="../../static/3.png" title="分配角色"/>' +
						'<img class="deleImg" atr=' + user[u].username + ' src="../../static/4.png" title="删除"/>' +
						'</div>' +
						'</div>';
					$('#tbody').append(str);
				};
				laypage.render({
					elem: 'pag',
					count: count,
					curr: page,
					theme: '#5a98de',
					jump: function (obj, is) {
						if (!is) {
							page = obj.curr;
							list();
						}
					}
				});
			}
		});
	};
	list();
	function checks() {
		ajax({
			url: url.checks,
			type: 'get',
			data: {
				username: layui.sessionData('home').temp.user
			},
			success: function (res) {
				var selelimi = '',
					seleInfo = '',
					check = '';
				for (var j = 0; j < res.length; j++) {
					selelimi += '<option value="' + res[j].id + '">' + res[j].site_name + '</option>';
				}
				for (var c = 0; c < res.length; c++) {
					seleInfo += '<option class="tion" value="' + res[c].id + '">' + res[c].site_name + '</option>';
				}
				for (var s = 0; s < res.length; s++) {
					check += '<input type="checkbox" class="check" name=' + res[s].id + ' lay-skin="primary" title=' + res[s].site_name +
						'>'
				}
				$('#selelimi').html(selelimi);
				$('#seleInfo').html(seleInfo);
				$('#check').html(check);
				layForm.render('select');
				layForm.render('checkbox');
			}
		});
	};
	checks();
	$("#sear").click(function () {
		userName = $('#look').val();
		page = 1;
		list();
	});
	$(window).keyup(function (event) {
		if (event.keyCode == 13) {
			$("#sear").click();
		}
	});
	//判断用户输入
	var userReg = /[a-zA-Z][1-9\._]*/;
	layForm.verify({
		username: function (val) {
			if (!func.trimFn(val) || !userReg.test(val)) {
				return '请输入账号,不可存在汉字或全为数字';
			} else {
				if (val.length > 8 || val.length < 5) {
					return '账号长度请保持在5-8位';
				}
			}
		},
		password: function (val) {
			if (!func.trimFn(val) || val.length < 8 || val.length > 20) {
				return '请输入8位以上20位以下的密码,并且不可存在空格';
			}
		},
		used: function (val) {
			var pass = $('#pass').val();
			if (val !== pass) {
				return '两次输入密码不一致';
			}
		},
		newPass: function (val) {
			if (!func.trimFn(val)) {
				return '请输入此账号的当前密码';
			}
		},
		password2: function (val) {
			if (!func.trimFn(val) || val.length < 8 || val.length > 20) {
				return '请输入8位以上20位以下的新密码,并且不可存在空格';
			}
		},
		password3: function (val) {
			var newPass = $('#pass2').val();
			if (val !== newPass) {
				return '两次输入密码不一致';
			}
		},
	});
	//添加人员
	layForm.on('submit(addSub)', function (data) {
		var data = data.field;
		ajax({
			url: url.user,
			type: 'post',
			data: data,
			success: function (res) {
				lay.msg('添加成功');
				closeFn('add');
				list();
			},
			error: function (r) {
				var err = r.responseJSON;
				var objArr = Object.keys(err);
				lay.msg(err[objArr[0]][0]);
			}
		});
		return false;
	});

	var user_name, user_id;
	window.limitFn = function (s, e) {
		$(s).show();
		layEle.tabChange('tab', 1);
		if (e) {
			user_id = e;
			tree();
		}
	};

	layEle.on('tab(tab)', function (e) {
		var tabId = $(e.elem.context).attr('lay-id');
		switch (tabId) {
			case '2':
				checkFn();
				break;
			default:
				tree();
		};
	});

	function tree() {
		for (var i = 0; i < user.length; i++) {
			if (user[i].id == user_id) {
				user_name = user[i].username;
				$('[name="username"]').val(user_name);
				ajax({
					url: url.tree,
					type: 'post',
					data: {
						username: layui.sessionData('home').temp.user,
						type: 2,
						name: user_name
					},
					success: function (res) {
						var data = res.data;
						var str = res.site;
						var DTree = dtree.render({
							elem: "#elemTree",
							dataStyle: "layuiStyle",
							data: data,
							initLevel: 1,
							skin: "laySimple",
							nodeIconArray: {
								"3": {
									"open": "dtree-icon-jian",
									"close": "dtree-icon-jia"
								}
							},
							ficon: ["3", "7"],
							checkbar: true,
							checkbarType: "all",
							done: function () {
								var params = dtree.chooseDataInit("elemTree", str);
							}
						});
					}
				});
			}
		};
	};

	function checkFn() {
		ajax({
			url: url.permiss,
			type: 'get',
			data: {
				name: user_name
			},
			success: function (res) {
				var cheArr = res.site;
				var chekArr = res.default;
				var date = res.date; //注意空格不要取消
				var time;
				if (date.indexOf(':') > -1) {
					time = date.replace(/:/g, " ~ ");
				} else {
					time = ''
				};
				var chek = '';
				var str = '';
				for (var i = 0; i < cheArr.length; i++) {
					str += '<input type="checkbox" class="check" name=' + cheArr[i].id + ' lay-skin="primary" title=' + cheArr[i]
						.name + '>'
				}
				$('#chekBox').html(str);
				layForm.render('checkbox');
				laydate.render({
					elem: '#time',
					type: 'month',
					format: 'yyyy-MM',
					value: time,
					range: '~'
				});
				var check = $('.check');
				for (var d = 0; d < check.length; d++) {
					check[d].checked = false;
				}
				for (var j = 0; j < chekArr.length; j++) {
					for (var k = 0; k < check.length; k++) {
						if (chekArr[j] == check[k].name) {
							check[k].checked = true;
						}
					}
				}
				layForm.render('checkbox');
			}
		});
	};
	$('#treeBtn').click(function () {
		var param = dtree.getCheckbarNodesParam("elemTree");
		var arr = [];
		for (var p = 0; p < param.length; p++) {
			arr.push(param[p].nodeId)
		}
		var str = arr.join(',');
		ajax({
			url: url.userDefa,
			type: 'post',
			data: {
				username: layui.sessionData('home').temp.user,
				name: user_name,
				site: str,
				type: 2
			},
			success: function (res) {
				lay.msg('分配站点成功！');
				$('#limit').hide();
				user_id = null;
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			}
		});
	});
	$('#checkBtn').click(function () {
		var check = $('.check');
		var arr = [];
		for (var d = 0; d < check.length; d++) {
			if (check[d].checked) {
				arr.push(check[d].name)
			}
		};
		var str = arr.join(',');
		var time = $('#time').val();
		if (time == '') {
			lay.msg('请选择时间范围！')
			return
		}
		var dateTime = $('#time').val().split('~');
		dateTime[0] = dateTime[0].replace(/^\s*|\s*$/g, "");
		dateTime[1] = dateTime[1].replace(/^\s*|\s*$/g, "");
		var date = dateTime.join(':');
		ajax({
			url: url.permiss,
			type: 'post',
			data: {
				username: layui.sessionData('home').temp.user,
				name: user_name,
				site: str,
				date: date
			},
			success: function (res) {
				lay.msg('分配下载站点成功！');
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			}
		});
	});

	window.operFn = function (s, e) {
		$('#cheAll').checked = false;
		$("#addForm")[0].reset();
		$("#changeForm")[0].reset();
		layForm.render();
		if (e) {
			$(s).show();
			id = e;
			for (var i = 0; i < user.length; i++) {
				if (user[i].id == e) {
					var tion = $('.tion');
					var site;
					site = user[i].site;
					for (var t = 0; t < tion.length; t++) {
						if ($(tion[t]).text() == site) {
							site = $(tion[t]).val();
						}
					}
					user_name = user[i].username;
					layForm.val('infoForm', {
						"name": user_name,
						"site": site
					});
					$('#id').val(e);
					$('#name').val(user_name);
					var siteArr = user[i].display_site;
					var siteId = siteArr.split(',');
					if (siteId.length > 0) {
						var check = $('.check');
						if (siteId.length == check.length) {
							$('#cheAll').checked = true;
						}
						for (var d = 0; d < check.length; d++) {
							check[d].checked = false;
						}
						for (var j = 0; j < siteId.length; j++) {
							for (var k = 0; k < check.length; k++) {
								if (siteId[j] == check[k].name) {
									check[k].checked = true;
								}
							}
						}
						layForm.render('checkbox');
					}
				}
			}
		} else {
			$('#' + s).show();
		}
	};

	//修改密码
	layForm.on('submit(changeSub)', function (data) {
		var newPass = data.field;
		newPass.username = layui.sessionData('home').temp.user;
		newPass.name = user_name;
		ajax({
			url: url.changePass,
			type: 'post',
			data: newPass,
			success: function (res) {
				lay.msg('修改成功');
				closeFn('limChang');
				list();
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			}
		});
		return false;
	});

	//修改信息
	layForm.on('submit(infoSub)', function (data) {
		var data = data.field;
		data.username = layui.sessionData('home').temp.user;
		ajax({
			url: url.changeSite,
			type: 'post',
			data: data,
			success: function (res) {
				lay.msg('修改成功');
				closeFn('limInfo');
				list();
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			}
		});
		return false;
	});
	$("#tbody").on("click", ".deleImg", function () {
		var name = $(this).attr('atr');
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 10000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				ajax({
					url: url.dele,
					type: 'post',
					data: {
						username: layui.sessionData('home').temp.user,
						name: name
					},
					success: function (res) {
						lay.msg('删除成功！');
						lay.close(infoMsg);
						list();
					},
					error: function (r) {
						if (r.status == 400) {
							var err = r.responseJSON;
							var objArr = Object.keys(err);
							lay.msg(err[objArr[0]]);
						}
					}
				});
			},
			btn2: function () {
				lay.msg('已取消删除。');
			}
		});
	});

	window.closeFn = function (h) {
		$('#' + h).hide();
	};
	$('#close').click(function () {
		urls.close();
	});
});
