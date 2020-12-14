function load() {
	window.location.reload();
};

function outFn() {
	window.location.href = '../index.html';
	window.close();
};
layui.config({
	base: '../lib/model/'
}).extend({
	urls: 'urls',
	func: 'func'
});
layui.use(['urls', 'func', 'form'], function() {
	var urls = layui.urls,
		func = layui.func,
		$ = layui.$,
		url = urls.url,
		ajax = urls.ajax,
		layForm = layui.form,
		lay = layui.layer;
	// 判断是否登录
	var user, iden;
	var isIll = layui.sessionData('home').temp;
	if (isIll == undefined) {
		window.location.href = '../index.html';
		window.close();
	} else {
		user = isIll.user;
		iden = isIll.iden;
		$('#user').html(user);
		iden == 2 ? $('.item_').hide() : '';
		var isIe = layui.device();
		isIe.ie ? $("#ieHide").show() : $("#ieHide").hide();
	};

	// 左上角的时间
	var dateVal;
	dateVal = func.initDate();
	$('#date').html('当前时间:' + dateVal)
	setInterval(function() {
		dateVal = func.initDate();
		$('#date').html('当前时间:' + dateVal)
	}, 30000);




	// 左上的今日传输
	function rateFn() {
		ajax({
			url: url.rate,
			type: 'get',
			success: function(res) {
				var data = res.results[0];
				$('#dirs').html(data.dirs);
				$('#sizes').html(data.sizes);
				$('#unit').html(data.unit);
			},
			complete: function(c) {
				setTimeout(rateFn, 60000);
			}
		});
	};
	rateFn();

	// 左上的图形
	function convFn() {
		ajax({
			url: url.convey,
			type: 'get',
			success: function(res) {
				var arr = [ring0, ring1, ring2, ring3];
				for (var i = 0; i < res.length; i++) {
					res[i][0].itemStyle = {
						color: 'rgba(20,177,235,0.2)'
					};
					res[i][1].itemStyle = {
						color: 'rgba(0,100,0,0.8)'
					};
					arr[i].setOption({
						tooltip: {
							formatter: function(parms) {
								var data = parms.data;
								var resu = data.result;
								var str = '<div>' + data.name + data.names + '<div/>' +
									'<div>' + data.names + ':' + data.ratio + '<div/>';
								for (var i = 0; i < resu.length; i++) {
									var obj = Object.keys(resu[i]);
									str += '<div style="text-align:left;">' + obj + ':' + resu[i][obj[0]] + '<div/>';
								}
								return str;
							}
						},
						title: {
							text: res[i][1].name,
							subtext: res[i][1].names
						},
						series: [{
							data: res[i]
						}]
					});
				};
			},
			complete: function(c) {
				setTimeout(convFn, 60000);
			}
		});
	};
	convFn();


	///////////////////左中的滚动
	var introl = null,
		setTime = null;
	var sh = 45; //li的高度
	var speed = 30;

	function rollFn() {
		ajax({
			url: url.alarms,
			type: 'get',
			success: function(r) {
				var str = '';
				for (var s = 0; s < r.length; s++) {
					str += '<li><span class="lt">' + r[s].alarm_site + r[s].alarm_type + '</span>' +
						'<span class="rt">' + r[s].new_alarm + '</span></li>'
				};
				$('#roll').html('<ul>' + str + '</ul>');
				if ($("#roll").find("ul").height() <= $("#roll").height()) {
					window.clearInterval(setTime);
				} else {
					window.clearInterval(setTime);
					setTime = setInterval(function() {
						setRollFn();
					}, speed);
				};
				introl = setTimeout(rollFn, 60000);
			}
		});
	};
	rollFn();

	function setRollFn() {
		$("#roll").find("ul").animate({
			marginTop: '-=1'
		}, 0, function() {
			var s = Math.abs(parseInt($(this).css("margin-top")));
			if (s >= sh) {
				$(this).find("li").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
		$("#roll").hover(function() {
			window.clearTimeout(setTime);
			window.clearInterval(introl);
		}, function() {
			window.clearInterval(setTime);
			window.clearTimeout(introl);
			setTime = setInterval(function() {
				setRollFn();
			}, speed);
			introl = setTimeout(rollFn, 3000);
		});
	};

	// 中上警告
	var eIntrol = null,
		eTime = null;
	var esh = 42; //li的高度
	var espeed = 50;

	function getMonFn() {
		ajax({
			url: url.monitor,
			type: 'get',
			success: function(res) {
				var data = res.data;
				data.length > 0 ? $("#ear_box").show() : $("#ear_box").hide();
				var str = '';
				for (var d = 0; d < data.length; d++) {
					str += '<li>' + data[d] + '</li>';
				};
				$('#ear_list').html('<ul>' + str + '</ul>');
				if ($("#ear_list").find("ul").height() <= $("#ear_list").height()) {
					window.clearInterval(eTime);
				} else {
					window.clearInterval(eTime);
					eTime = setInterval(function() {
						setMonFn();
					}, espeed);
				};
				eIntrol = setTimeout(getMonFn, 60000);
			}
		});
	};
	getMonFn();

	function setMonFn() {
		$("#ear_list").find("ul").animate({
			marginTop: '-=1'
		}, 0, function() {
			var s = Math.abs(parseInt($(this).css("margin-top")));
			if (s >= esh) {
				$(this).find("li").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
		$("#ear_list").hover(function() {
			window.clearTimeout(eTime);
			window.clearInterval(eIntrol);
		}, function() {
			window.clearInterval(eTime);
			window.clearTimeout(eIntrol);
			eTime = setInterval(function() {
				setMonFn();
			}, speed);
			eIntrol = setTimeout(getMonFn, 3000);
		});
	};
	$("#collMon").click(function() {
		window.clearTimeout(eTime);
		window.clearInterval(eIntrol);
		$("#ear_box").hide();
		setTimeout(function() {
			getMonFn();
		}, 300000);
	});

	$("#ear_list").click(function() {
		lay.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			area: ["800px", "480px"],
			content: "./alert.html"
		});
	});

	var id, real_ip, site, outIs = true;
	var zoom = 6;
	//中间地图
	var mapInt = null,
		mapTime = 30000;
	var checkVal = ['雷达', '浮标', '志愿船', '省自建', '国家站'];
	// var checkVal = ['雷达', '浮标', '志愿船', '个人站', '地方站', '国家站'];
	var checkStr; //处理后的checkVal格式
	window.mapFnc = function() {
		clearInterval(mapInt);
		checkStr = checkVal.join(','); //'雷达, 浮标, 志愿船, 个人站, 地方站, 国家站'
		mapFn(); //获取数据 str为请求参数
		mapInt = setInterval(function() {
			mapFns()
		}, mapTime);
	};
	mapFnc();

	layForm.on('checkbox(check)', function(data) {
		clearInterval(mapInt);
		var tempVal = data.value;
		var tempIs = data.elem.checked;
		if (tempIs) {
			checkVal.push(tempVal)
		} else {
			var idx = checkVal.indexOf(tempVal);
			checkVal.splice(idx, 1);
		}
		checkStr = checkVal.join(',');
		mapFn();
		mapInt = setInterval(function() {
			mapFns()
		}, mapTime);
		return false;
	});

	// 获取默认站点
	function FirstShow() {
		layui.sessionData('first', {
			key: 'first',
			value: ''
		});
		ajax({
			url: url.add,
			type: 'get',
			data: {
				username: user
			},
			success: function(res) {
				$('#site').html(res.name);
				id = res.id;
				layui.sessionData('first', {
					key: 'first',
					value: id
				});
				minu();
				elem();
			}
		})
	};
	//分钟数据
	var minuInt = null;

	function minu() {
		clearTimeout(minuInt);
		ajax({
			url: url.minute,
			type: 'post',
			data: {
				id: id
			},
			success: function(res) {
				$('#ol').empty();
				if (JSON.stringify(res) != "{}") {
					var data = res.data;
					var time = res.time;
					$('#time').html(time)
					var ol = '';
					for (var o = 0; o < data.length; o++) {
						ol += '<li><p title=' + data[o].symbol + ":" + data[o].value + ' class="p1">' + data[o].symbol +
							'</p><p title=' + data[o].symbol + ":" + data[o].value + ' class="p2">' + data[o].value + '</p></li>'
					};
					$('#ol').html(ol);
				};
			},
			complete: function() {
				minuInt = setTimeout(minu, 30000);
			}
		});
	};
	// 更新曲线图的元素
	var val;

	function elem() {
		ajax({
			url: url.charts,
			type: 'get',
			data: {
				id: id
			},
			success: function(res) {
				$("#seleBox").empty();
				val = res[0];
				var str = '';
				for (var j = 0; j < res.length; j++) {
					str += '<option value="' + res[j] + '">' + res[j] + '</option>';
				}
				$('#seleBox').html(str)
				layForm.render('select');
				str = '';
				line();
			}
		});
	};
	layForm.on('select(elem)', function(data) {
		val = data.value;
		line();
		return
	});
	// 左侧的折线图
	var lineInt = null;

	function line() {
		clearTimeout(lineInt);
		ajax({
			url: url.charts,
			type: 'post',
			data: {
				id: id,
				value: val
			},
			success: function(res) {
				var time = res.time;
				var value = res.value;
				var name = res.unit;
				var tempData = [];
				ltChart.setOption({
					title: {
						text: val
					},
					yAxis: [{
						name: '单位:' + name,
					}],
					xAxis: [{
						data: time
					}]
				});

				if (val == '风速' || val == '波高') {
					for (var i = 0; i < value.length; i++) {
						var obj = {
							name: name,
							value: value[i].value,
							symbol: 'image://../static/jt' + value[i].dir + '.png'
						};
						tempData.push(obj)
					};
					ltChart.setOption({
						series: [{
							name: val,
							symbolSize: 15,
							data: tempData
						}]
					});
				} else {
					for (var k = 0; k < value.length; k++) {
						var obj = {};
						obj.name = name;
						obj.value = value[k];
						tempData.push(obj)
					}
					ltChart.setOption({
						title: {
							text: val
						},
						yAxis: [{
							name: '单位:' + name,
						}],
						xAxis: [{
							data: time
						}],
						series: [{
							name: val,
							symbolSize: 8,
							data: tempData
						}]
					});
				}
			},
			complete: function() {
				lineInt = setTimeout(line, 180000);
			}
		});
	};
	// 中间地图和左侧折线图部分
	var myChart, ltChart, ring0, ring1, ring2, ring3;
	var degree, arr;
	var setInitVal = null;

	function mapFn() {
		ajax({
			url: url.index,
			type: 'post',
			data: {
				username: user,
				value: checkStr,
				num: zoom
			},
			success: function(res) {
				FirstShow();
				degree = res.degree;
				arr = res.data;
				var dataX = convertData();
				var dataY = date();
				myChart.setOption({
					tooltip: {
						formatter: function(params) {
							var data = params.data;
							var name = '';
							if (data.zx == 0) {
								name = data.site
							};
							return name;
						}
					},
					series: [{
							data: dataX
						},
						{
							data: dataY
						}
					]
				});
			}
		});
	};

	function mapFns() {
		ajax({
			url: url.index,
			type: 'post',
			data: {
				username: user,
				value: checkStr,
				num: zoom
			},
			success: function(res) {
				degree = res.degree;
				arr = res.data;
				var dataX = convertData();
				var dataY = date();
				myChart.setOption({
					tooltip: {
						formatter: function(params) {
							var data = params.data;
							var name = data.site;
							return name;
						}
					},
					series: [{
							data: dataX
						},
						{
							data: dataY
						}
					]
				});
			}
		});
	};

	function convertData() {
		var res = [];
		for (var i = 0; i < arr.length; i++) {
			var dataItem = arr[i];

			var fromCoord = degree[dataItem[1].name];
			var toCoord = degree[dataItem[0].name];
			if (dataItem[1].pk == 2 || dataItem[1].pk == 5) {
				if (fromCoord && toCoord) {
					res.push({
						coords: [fromCoord, toCoord],
						value: dataItem[1].line,
						id: dataItem[1].id,
						site: dataItem[1].name,
						zx: dataItem[1].zx
					});
				}
			}
		}
		return res;
	};

	/*
		@@字段区分
		pk用于区分类别,雷达、浮标、志愿船、站点、自建站、国家站、中心站
		size控制圈大小
		value是空值圈的颜色
		line控制线的颜色
		zx区分是否是中心站 1是  0否
	*/

	function date() {
		var temp = [];
		for (var i = 0; i < arr.length; i++) {
			var arrItem = arr[i][1];
			var obj;
			if (arrItem.size == 8) {
				obj = {
					name: '',
					site: arrItem.name,
					value: degree[arrItem.name].concat([arrItem.value]),
					val: arrItem.value,
					id: arrItem.id,
					symbolSize: 15,
					zx: arrItem.zx
				};
			} else {
				obj = {
					name: arrItem.name,
					site: arrItem.name,
					value: degree[arrItem.name].concat([arrItem.value]),
					val: arrItem.value,
					id: arrItem.id,
					symbolSize: 20,
					zx: arrItem.zx
				};
			};
			if (arrItem.zx == 0) {
				obj.symbol = "image://../static/ionc" + arrItem.pk + arrItem.value + ".png";
			} else {
				obj.symbol = "image://../static/zxz.png";
			};
			temp.push(obj)
		}
		return temp;
	};
	/*
		@@@弹窗数据接口
	*/
	function siteDataFn() {
		ajax({
			url: url.rank,
			type: 'post',
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				var sitename = data[0]['站名'];
				$('#hide-tle').html(sitename);
				$('#hide-tle').attr('title', sitename);
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataIdx = data[i];
					for (var item in dataIdx) {
						str += '<div>' +
							'<p>' + item + '</p>' +
							'<p title=' + dataIdx[item] + '>' + dataIdx[item] + '</p>' +
							'</div>'
					};
				};
				$("#box_box").html(str);
				lay.open({
					type: 1,
					title: false,
					shadeClose: true,
					shade: 0.1,
					content: $('#hideBox'),
					time: 15000
				});
			},
			error: function(r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};
	$("#btn").click(function() {
		var url = './clou.html?id=' + id;
		lay.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			area: ["800px", "480px"],
			content: url
		});
	});




	window.sideFn = function(x, t, dom, src) {
		var is = $(t).attr("is");
		$(t).css("background", "url(../static/" + src + is + ".png)");
		if (is == 2) {
			if (x == 1) {
				$("#" + dom).animate({
					"left": -445
				}, 500);
			} else {
				$("#" + dom).animate({
					"right": -445
				}, 500);
				$(".line_sele").hide();
				$(".rt_time").hide();
			};
			$(t).attr("is", "1");
		} else {
			if (x == 1) {
				$("#" + dom).animate({
					"left": -0
				}, 500);
			} else {
				$("#" + dom).animate({
					"right": 0
				}, 500);
				$(".line_sele").show(500);
				$(".rt_time").show(500);
			};
			$(t).attr("is", "2");
		};
	};











	//初始化图形
	var colorArr = ['#33CC00', '#f00', '#ffde00', '#808080'];

	function init() {
		myChart = echarts.init(document.getElementById('maps'));
		var option = {
			tooltip: {
				trigger: 'item',
				borderColor: '#FFFFCC',
				hideDelay: 0,
				transitionDuration: 0,
				extraCssText: 'z-index:100',
				textStyle: {
					color: '#fff'
				}
			},
			geo: {
				map: 'china',
				zoom: 6,
				scaleLimit: {
					min: 6,
					max: 56
				},
				center: [122, 30],
				label: {
					emphasis: {
						show: false
					}
				},
				roam: true,
				silent: true,
				itemStyle: {
					normal: {
						areaColor: "rgba(0,0,0,0.1)",
						color: '#334559',
						borderColor: '#00b8fd',
						borderWidth: 1,
						shadowColor: '#00b8fd',
						shadowOffsetX: -2,
						shadowOffsetY: 2,
						shadowBlur: 10
					},
					emphasis: {
						color: '#252b3d'
					}
				},
				regions: [{
					name: '南海诸岛',
					itemStyle: {
						normal: {
							opacity: 0
						}
					}
				}]
			},
			series: [{
				type: 'lines',
				tooltip: {
					formatter: function() {
						//这里必须写,要不然鼠标放在线上会显示undefined
						return '';
					}
				},
				zlevel: 3,
				effect: {
					show: true,
					period: 7,
					symbolSize: 2,
					trailLength: 0.02,
					constantSpeed: 50,
					color: 'rgba(255,255,255,0.2)',
					shadowBlur: 8
				},
				lineStyle: {
					normal: {
						width: 1,
						curveness: 0.2,
						color: function(item) {
							var x = item.data.value;
							var clr = x == 0 ? "rgba(51,204,0,0.1)" : "rgba(255,0,0,0.1)";
							return clr;
						}
					}
				}
			}, {
				type: 'scatter',
				coordinateSystem: 'geo',
				zlevel: 3,
				rippleEffect: {
					period: 3,
					brushType: 'fill',
					scale: 0
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						formatter: '{b}',
						textStyle: {
							color: '#fff',
							fontStyle: 'normal',
							fontFamily: 'arial',
							fontSize: 14,
							zIndex: '99999'
						}
					}
				},
				itemStyle: {
					normal: {
						show: false,
						color: function(item) {
							var val = item.data.val;
							return colorArr[val];
						}
					}
				},
			}]
		};
		myChart.setOption(option);
		myChart.on('georoam', function(e) {
			var _option = myChart.getOption();
			var _zoom = _option.geo[0].zoom;
			zoom = Math.round(_zoom);
			clearTimeout(setInitVal)
			setInitVal = setTimeout(mapFns, 1000)
		});
		myChart.on('click', function(e) {
			if (e.data) {
				if (e.data.zx == 0) {
					if (e.data.id) {
						id = e.data.id;
						minu();
						elem();
						siteDataFn();
						$('#site').html(e.data.site)
					}
				}
			};
		});
		ltChart = echarts.init(document.getElementById('main'));
		var ltOption = {
			backgroundColor: "#091c42",
			title: {
				x: 'center',
				textStyle: {
					color: '#07a6ff',
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					label: {
						backgroundColor: '#07a6ff',
					},
				},
				position: ['50%', '10%'],
				formatter: function(value) {
					var data = value[0];
					var seriesName = data.seriesName;
					var com = data.data.name;
					var name = data.axisValue;
					var val = data.value;
					return "<div style='color:#fff;'>" + seriesName + "</div><div style='color:#fff;'>" + name + ":" + val + com +
						"</div>";
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '5%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLabel: {
					textStyle: {
						color: '#07a6ff'
					}
				},
				axisLine: {
					lineStyle: {
						color: '#07a6ff'
					},
					onZero:false
				},
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: '#07a6ff'
					}
				},
				splitLine: {
					lineStyle: {
						color: '#07a6ff'
					}
				},
				axisLine: {
					lineStyle: {
						color: 'none'
					}
				}
			},
			series: [{
				type: 'line',
				cursor: "default",
				smooth: true,
				itemStyle: {
					normal: {
						color: '#07d8b1',
						lineStyle: {
							color: '#07d8b1'
						},
					},
					emphasis: {
						color: '#02675f',
						lineStyle: {
							width: 0.5,
							type: 'dotted',
							color: "#02675f"
						}
					}
				}
			}]
		};
		ltChart.setOption(ltOption);

		ring0 = echarts.init(document.getElementById('ring0'));
		ring1 = echarts.init(document.getElementById('ring1'));
		ring2 = echarts.init(document.getElementById('ring2'));
		ring3 = echarts.init(document.getElementById('ring3'));
		var ringOption = {
			tooltip: {
				trigger: 'item',
				borderColor: '#FFFFCC',
				extraCssText: 'z-index:100',
				position: ['50%', '50%'],
				textStyle: {
					color: '#fff'
				}
			},
			title: {
				x: 'center',
				y: '35%',
				textStyle: {
					fontSize: 14,
					fontWeight: 'normal',
					color: '#00FFFF',
				},
				subtextStyle: {
					fontSize: 12,
					fontWeight: 'normal',
					align: "center",
					color: '#CCCCCC'
				},
			},
			series: [{
				type: 'pie',
				radius: ['50%', '80%'],
				//      radius: ['50%', '70%'],
				clockwise: true, //饼图的扇区是否是顺时针排布
				label: {
					normal: {
						show: false,
						position: 'outter',
						formatter: function(parms) {
							return parms.data.legendname
						}
					}
				}
			}]
		};
		ring0.setOption(ringOption);
		ring1.setOption(ringOption);
		ring2.setOption(ringOption);
		ring3.setOption(ringOption);
	};
	init();
	/*
			@@@中间底部按钮
	*/
	$('[name="openHtm"]').click(function() {
		var url = $(this).attr('url') + '?id=' + id + '';;
		var type = $(this).attr('type');
		var areaArr = [
			['50%', '660px'],
			['90%', '800px'],
			['75%', '680px']
		];
		lay.open({
			type: 2,
			title: false,
			// shadeClose: true,
			shade: 0.8,
			closeBtn: 0,
			area: areaArr[type],
			content: url
		});
	});
});
