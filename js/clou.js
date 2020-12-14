layui.config({
	base: '../lib/model/'
}).extend({
	urls: 'urls'
});
layui.use(['urls', 'func', 'form', 'laydate'], function() {
	var urls = layui.urls,
		url = urls.url,
		ajax = urls.ajax,
		func = layui.func;
	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laydate = layui.laydate;

	var id = func.locaStr("id");

	laydate.render({
		elem: '#time',
		range: "~",
		max: func.initDate(),
		value: func.initDate() + "\xa0" + "~" + "\xa0" + func.initDate()
	});
	var startTime = "",
		endTime = "";
	$("#sear").click(function() {
		var time = $("#time").val();
		var idx = time.indexOf("~");
		if (idx == -1) {
			lay.msg("请选择时间!");
			return false;
		};
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();

		var a = new Date(startTime).getTime();
		var b = new Date(endTime).getTime();

		var c = Number(b) - Number(a);
		var range = 6 * 24 * 60 * 60 * 1000;
		if(c>range){
			lay.msg("请把时间范围控制在七天内!");
			return false;
		};
		getDetaFn();
	});

	function getDetaFn() {
		ajax({
			url: url.curves,
			type: 'get',
			data: {
				id: id,
				startTime: startTime,
				endTime: endTime
			},
			success: function(res) {
				var data=res.data;
				var time=res.time;
				initFn(data,time);;
			}
		});
	};
	
	
	function initFn(data,time){
		var myChart = echarts.init(document.getElementById('main'));
		var option = {
			backgroundColor: '#08132c',
			color: '#38b8f2',
			title: {
				text: "数据文件接收柱状图",
				textStyle: {
					color: "#07a6ff"
				},
				left: "center",
				top: 5
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#07a6ff'
					},
					lineStyle: {
						type: 'dashed'
					}
				},
				formatter: function(e) {
					var str = '';
					for (var i = 0; i < e.length; i++) {
						str += e[i].marker + e[i].name+':'+e[i].data + '</br>';
					};
					return str;
				}
			},
			grid: {
				left: '25',
				right: '25',
				bottom: '24',
				top: '75',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: time,
				// data: ['北海', '东海', '南海', '地方站', '全局'],
				splitLine: {
					show: false
				},
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#07a6ff"
					}
				},
			},
			yAxis: {
				axisLabel: {
					color: '#07a6ff',
					textStyle: {
						fontSize: 12
					}
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#07a6ff"
					}
				}
			},
			series: [{
					type: 'bar',
					barWidth: 30,
					data: data
					// data: [20, 40, 60, 80, 3000]
				}
			]
		};
		myChart.setOption(option)
	};

	$('#close').click(function() {
		urls.close();
	});
});
