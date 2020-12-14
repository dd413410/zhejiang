layui.config({
	base: '../lib/model/'
}).extend({
	urls: 'urls',
	dtree: 'dtree',
	func: 'func'
});
layui.use(['urls', 'dtree','func','form', 'element', 'laypage'], function() {
	var urls = layui.urls,
		func = layui.func,
		url = urls.url,
		ajax = urls.ajax,
		$ = layui.$,
		util = layui.util,
		dtree = layui.dtree,
		layForm = layui.form,
		lay = layui.layer,
		layEle = layui.element,
		laypage = layui.laypage;
	$('#user').val(layui.sessionData('home').temp.user);

	function tree() {
		ajax({
			url: url.tree,
			type: 'post',
			data: {
				username: layui.sessionData('home').temp.user,
				type: 1
			},
			success: function(res) {
				var data = res.data;
				var str = res.site;
				var DTree = dtree.render({
					elem: "#elemTree",
					dataStyle: "layuiStyle",
					width:500,
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
					done: function() {
						var params = dtree.chooseDataInit("elemTree", str);
					}
				});
			}
		});
	};
	tree();
	$('#treeBtn').click(function() {
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
				name: layui.sessionData('home').temp.user,
				site: str,
				type: 1
			},
			success: function(res) {
				lay.msg('修改站点成功！');
				$('#close').click()
			}
		});
	});
	// 站点IP部分
	layEle.on('tab(tab)', function(e) {
		var tabId = $(e.elem.context).attr('tab-id');
		if (tabId == 2) {
			ajax({
				url: url.checks,
				type: 'get',
				data: {
					username: layui.sessionData('home').temp.user
				},
				success: function(res) {
					if (res.length <= 0) {
						return;
					}
					siteId = res[0].id;
					siteIp()
					var seleStr = '';
					for (var j = 0; j < res.length; j++) {
						seleStr += '<option class="tion" value="' + res[j].id + '">' + res[j].site_name + '</option>';
					}
					$('#seleBox').html(seleStr);
					$('#addSele').html(seleStr);
					layForm.render('select');
				}
			});
			$('.hideTab').show();
		} else {
			$('.hideTab').hide();
		}
	});
	var or, arr = [],
		siteId, page = 1;
	// 选完站点之后更新数据
	layForm.on('select(drop)', function(data) {
		$('#tbod').empty();
		siteId = data.value, page = 1;
		siteIp()
		return false;
	});
	function siteIp() {
		ajax({
			url: url.siteIp,
			type: 'get',
			data: {
				id: siteId,
				page_size: page
			},
			success: function(res) {
				$('#tbod').empty();
				arr = res.results;
				var total = res.count;
				total > 15 ? $('#pag').show() : $('#pag').hide();
				var str = '';
				for (var i = 0; i < arr.length; i++) {
					var idx = Number(i + 1);
					str +=
						'<tr>' +
						'<td>' + idx + '</td>' +
						'<td>' + arr[i].name + '</td>' +
						'<td>' + arr[i].ip + '</td>' +
						'<td>' +
						'<i class="layui-icon layui-icon-edit" onclick="lookFn(2,' + arr[i].id + ')"></i>' +
						'<i class="layui-icon layui-icon-delete" onclick="deleFn(' + arr[i].id + ')"></i>' +
						'</td>' +
						'</tr>'
				}
				$('#tbod').append(str);
				laypage.render({
					elem: 'pag',
					count: total,
					curr: page,
					theme: '#5a98de',
					jump: function(obj, is) {
						if (!is) {
							$('#tbod').empty();
							page = obj.curr;
							siteIp();
						}
					}
				});
			}
		});
	};
	window.lookFn = function(e, id) {
		layForm.render();
		$("#addForm")[0].reset(); //先重置一下表单
		$('#addIp').show();
		or = e;
		if (or == 1) {
			$("#addSele").attr("disabled", false);
			layForm.render('select');
		} else {
			$("#addSele").attr("disabled", true);
			layForm.render('select');
			var data;
			for (var r = 0; r < arr.length; r++) {
				if (arr[r].id == id) {
					data = arr[r];
				}
			};
			layForm.val('addForm', {
				'site': data.site,
				"id": data.id,
				"name": data.name,
				"ip": data.ip
			});
		}
	};
	window.deleFn= function(e) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
		  time: 10000,
		  shade: 0.5,
		  btn: ['确定', '取消'],
		  yes: function() {
				ajax({
					url: url.deleIp,
					type: 'post',
					data: {
						id: e
					},
					success: function(res) {
						var msg = res.message;
						if (msg == 'OK') {
							lay.close(infoMsg);
							siteIp();
						}
						lay.msg(msg)
					}
				});
		  },
		  btn2: function() {
		    lay.msg('已取消删除。');
		  }
		});
	};
	
	layForm.on('submit(addIp)', function(data) {
		var data = data.field;
		// 判断or 是1还是2
		// 1 为添加  
		// 2 为修改
		if(or==1){
			delete data.id;
			ajax({
				url: url.siteIp,
				type: 'post',
				data:data,
				success: function(res) {
					lay.msg('添加成功!');
					$('#addIp').hide();
					siteIp();
				},
				error:function(err){
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]][0]);
				}
			});
		}else{
			ajax({
				url: url.changeIp,
				type: 'post',
				data:data,
				success: function(res) {
					lay.msg('添加成功!');
					$('#addIp').hide();
					siteIp();
				},
				error:function(err){
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]][0]);
				}
			});
		}
		return false;
	});
	window.isHide = function(e) {
		$("#addForm")[0].reset();
		$('#addIp').hide();
	};
	//修改密码部分
	layForm.verify({
		name: function(val) {
			if (!func.trimFn(val)) {
				return '请输入实况IP名';
			}
		},
		ip: function(val) {
			var reg=/^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (!func.trimFn(val)||!reg.test(val)) {
				return '请输入正确的实况IP';
			}
		},
		pass: function(val) {
			if (!func.trimFn(val)) {
				return '请输入此账号的当前密码';
			}
		},
		pass1: function(val) {
			if (!func.trimFn(val) || val.length < 8 || val.length > 20) {
				return '请输入8位以上20位以下的新密码,并且不可存在空格';
			}
		},
		pass2: function(val) {
			var newPass = $('#pass1').val();
			if (val !== newPass) {
				return '两次输入密码不一致';
			}
		}
	});
	
	layForm.on('submit(form)', function(d) {
		var data = {
			name:d.field.user,
			username: d.field.user,
			password: d.field.pass,
			password2: d.field.pass1,
			password3: d.field.pass2
		};
		ajax({
			url: url.changePass,
			type: 'post',
			data:data,
			success: function(res) {
				lay.msg('修改密码成功');
			},
			error:function(r){
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]]);
				}
			}
		});
		return false
	});
	$('#close').click(function() {
		parent.mapFnc();
		urls.close();
	});
});
