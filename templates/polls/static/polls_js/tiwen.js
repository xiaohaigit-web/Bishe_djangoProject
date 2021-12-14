row_list=[33.4,33.6,35.6,34,37,35,38,39,38,37,35,39,39.40,41,41,39,38,38,37,37,38,36,38,36,35,35]
time_list=['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
function cannll () {
	window.history.back(-1);
}
window.onload=mycr;
function mycr(){
	for(i=0;i<patient_list.length;i++){
		cd=i.toString();
		//找到要添加节点的父节点(table)
		var tb = document.getElementById("datadiv");
		data_div=document.createElement("div");
		data_div.id='data_div'+cd;
		data_div.className='data_div';
		//tubiao
		data_tubiao=document.createElement("div");
		data_tubiao.id='data_tubiao'+cd;
		data_tubiao.className='data_tubiao';
		data_tubiao.onclick=function (){
			tubiao(this);
		}
		//data_tubiao.innerHTML='这是一个折线图'
		//information
		data_infmation=document.createElement("div");
		data_infmation.id='data_infmation'+cd;
		data_infmation.className='data_infmation';
		
		information_li1=document.createElement('li');
		information_li1.innerHTML='ID:'+patient_list[i].patient_id;
		information_li2=document.createElement('li');
		information_li2.innerHTML='姓名:'+patient_list[i].patient_name;
		information_li5=document.createElement('li');
		information_li5.innerHTML='性别:'+patient_list[i].patient_gender;
		// information_li4=document.createElement('li');
		// information_li4.innerHTML='设备号:'+patient_list[i].patient_device;
		information_li3=document.createElement('li');
		information_li3.innerHTML='医生:'+patient_list[i].patient_physician;
		
		data_infmation.appendChild(information_li1);
		data_infmation.appendChild(information_li2);
		data_infmation.appendChild(information_li3);
		data_infmation.appendChild(information_li5);
		//tiwen_data
		tiwen_data=document.createElement("div");
		tiwen_data.id='tiwen_data';
		
		tiwen_li=document.createElement('li');
		tiwen='tiwen'+cd;
		//console.log(typeof (patient_list[i].patient_row_data.pop()))
		//console.log(typeof(patient_list[i]))

		tiwen_span1=document.createElement('span');
		tiwen_span1.className='tiwen_span1';
		tiwen_span1.id='tiwen_min'+cd;
		tiwen_span1.innerHTML='低温警报';
		
		tiwen_span2=document.createElement('span');
		tiwen_span2.className='tiwen_span2';
		tiwen_span2.id='tiwen_avg'+cd;
		tiwen_span2.innerHTML='体温正常';
		
		tiwen_span3=document.createElement('span');
		tiwen_span3.className='tiwen_span3';
		tiwen_span3.id='tiwen_max'+cd;
		tiwen_span3.innerHTML='高温警报';

		if (patient_list[i].patient_row_data.length === 0){
			tiwen_li.innerHTML='体温：';
		}
		else{
			tiwen_li.innerHTML='体温：'+patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1];
			if(patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1]>38.0){
				tiwen_span3.style.display='block';
				tiwen_span2.style.display='none';
				tiwen_span1.style.display='none';
				console.log("high---: ",patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1])
			}
			if(patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1]>=34.0 && patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1]<=38.0){
				tiwen_span2.style.display='block';
				tiwen_span1.style.display='none';
				tiwen_span3.style.display='none';
				console.log("avg---: ",patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1])
			}
			if(patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1]<34.0){
				tiwen_span2.style.display='none';
				tiwen_span1.style.display='block';
				tiwen_span3.style.display='none';
				console.log("min---: ",patient_list[i].patient_row_data[patient_list[i].patient_row_data.length-1])
			}
		}
		
		tiwen_data.appendChild(tiwen_li);
		tiwen_data.appendChild(tiwen_span1);
		tiwen_data.appendChild(tiwen_span2);
		tiwen_data.appendChild(tiwen_span3);
		
		data_div.appendChild(data_tubiao);
		data_div.appendChild(data_infmation);
		data_div.appendChild(tiwen_data);
		tb.appendChild(data_div);
	}
	// Step:3 conifg ECharts's path, link to echarts.js from current page.
	// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
	require.config({
	    paths: {
	        echarts: '/static/polls_js',
	    }
	});
	
	// Step:4 require echarts and use it in the callback.
	// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
	require(
	    [
	        'echarts',
	        'echarts/chart/line',
			'echarts/chart/bar',
			'echarts/theme/infographic',
			'echarts/theme/macarons',
	    ],
	    function (ec) {
			for(i=0;i<patient_list.length;i++){
				cd=i.toString();
				//--- 折线图 ---
				var myChart1 = ec.init(document.getElementById('data_tubiao'+cd));
				myChart1.setOption({
					backgroundColor: '#c0c5b5',
					grid:{
						x:30,
						y:30,
						x2:30,
						y2:30,
						borderWidth:1
					},
					tooltip : {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#ff0000'
							}
						}
					},
					legend: {
						data:[patient_list[i].patient_id+'病人体温'],                        //标题
						backgroundColor: '#48036F',
						fontSize: 15,//字体大小
					},
					calculable : true,
					xAxis :[ 
						{
							type : 'category',
							data : patient_list[i].patient_row_time,
							axisLabel:{
							    rotate: 0,
							    interval:120
							},
							name:'时间',
							// axisTick: {
							//         show: false,  //是否显示网状线 默认为true
							//         alignWithLabel: true
							//     },
							
							xaxisLine:{
							    show:true,  //这里的show用于设置是否显示x轴那一条线 默认为true
							    lineStyle:{ //lineStyle里面写x轴那一条线的样式
							        color:'#133CAC',
							        width:2,    //轴线的粗细 我写的是2 最小为0，值为0的时候线隐藏
							    },
								symbol: ['none', 'triangle'],
							},

						}
					],
					
					yAxis : [
						{
							type : 'value',
							splitArea : {show : true},
							name:'体温',
							scale:true,
							max:50,
							min:30,
							splitNumber:4,
							splitLine:{show:false}, //去除网状线 默认为true
							axisLine:{
								show:true,  //这里的show用于设置是否显示y轴那一条线 默认为true
								lineStyle:{ //lineStyle里面写y轴那一条线的样式
									color:'#133CAC',
									width:2,    //轴线的粗细 我写的是2 最小为0，值为0的时候线隐藏
									symbol: ['arrow'],
							    },
						    },
							// textStyle: {
							//     color: '#c3dbff',  //更改坐标轴文字颜色
							//     fontSize : 2      //更改坐标轴文字大小
							// },
						}
					],
					series : [
						{
							name:'病人体温',
							type:'line',
							// itemStyle:{
							//     normal:{ color: "#00aa00" } //坐标圆点的颜色
							// },
							lineStyle:{
								normal:{ width:1,color: "#133CAC"  }//线条的颜色及宽度
							},
							label: {//线条上的数字提示信息
								normal: {
									show: true,
									position: 'top'
								}
							},
							// smooth: true,//线条平滑
							data:patient_list[i].patient_row_data
						},
						// {
						//     name:'降水量',
						//     type:'line',
						//     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
						// }
						
					]
				});
				
				
			}
		window.onresize = function(){
			myChart1.resize();//使图表适应
		};
	    }
	);
}
function tubiao(item){
	pid=item.nextElementSibling.firstChild.textContent
	console.log(pid.substring(3,8))
	pid=pid.substring(3,8);
	for (j=0;j<patient_list.length;j++){
		if (pid===patient_list[j].patient_id){
			row_data=patient_list[j].patient_row_data
			row_time=patient_list[j].patient_row_time
			//console.log(typeof (row_data))

			document.getElementById('fangda_div').style.display='block';
			require.config({
			    paths: {
			        echarts: '..//js'
			    }
			});
			require(
			    [
			        'echarts',
			        'echarts/chart/line',
					'echarts/chart/bar',
					'echarts/theme/infographic',
					'echarts/theme/macarons',

			    ],
			    function (ec) {
						cd=i.toString();
						//--- 折线图 ---
						var myChart2 = ec.init(document.getElementById('fangda'));
						myChart2.setOption({
							backgroundColor: '#c0c5b5',
							 grid:{
								x:80,
								y:30,
								x2:60,
								y2:105,
								borderWidth:1
							},
							tooltip : {
								trigger: 'axis',
								axisPointer: {
									type: 'cross',
									label: {
										backgroundColor: '#ff0000'
									}
								}
							},
							legend: {
								data:[pid+'病人体温'], //标题
								backgroundColor: '#48036F',
								fontSize: 10,//字体大小
							},
							toolbox: {                              //工具箱
								show : true,
								feature : {
									dataZoom: {
									    yAxisIndex: 'none'
									},
									// mark : {show: true},
									dataView : {show: true, readOnly: false},
									magicType : {show: true, type: ['line', 'bar']},
									restore : {show: true},
									saveAsImage : {show: true}
								}
							},
							calculable : true,
							xAxis :
								{
									axisLabel:{
									    rotate: 75,
									    interval:2,     //x轴文本间距
										textStyle: {
											fontSize : 12     //更改坐标轴文字大小
										}
									},

									type : 'category',
									// type:'time',
									data : row_time,
									name:'时间',
									boundaryGap: false,
									axisLine: {
									  //   lineStyle: {
											// color: 'red',
									  //   }
									},
								},

							yAxis : [
								{
									type : 'value',
									splitArea : {show : true},
									name:'体温',
									axisLabel: {
									    formatter: '{value} °C',
									},
									scale:true,
									max:45,
									min:30,
									splitNumber:20,
									// splitLine:{show:false}, //去除网状线 默认为true

								}
							],
							series : [
								{
									name:'体温',
									type:'line',
									// itemStyle:{
									//     normal:{ color: "#00aa00" } //坐标圆点的颜色
									// },
									lineStyle:{
										normal:{ width:1,color: "white",backgroundColor:'black'  }//线条的颜色及宽度
									},
									label: {//线条上的数字提示信息
										normal: {
											show: true,
											position: 'top'
										}
									},
									// smooth: true,//线条平滑
									data:row_data,
									markPoint: {
									    data: [
									        {type: 'max', name: '最大值'},
									        {type: 'min', name: '最小值'}
									    ]
									},
									markLine: {
									    data: [
									        {type: 'average', name: '平均值'}
									    ]
									}

								},
								// {
								//     name:'降水量',
								//     type:'line',
								//     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
								// }

							]
						});
				window.onresize = function(){
					myChart2.resize();//使图表适应
				};
			    }
			);
		}
	}

	// document.getElementById('fangda_div').style.display='block';
	// require.config({
	//     paths: {
	//         echarts: '..//js'
	//     }
	// });
	// require(
	//     [
	//         'echarts',
	//         'echarts/chart/line',
	// 		'echarts/chart/bar',
	// 		'echarts/theme/infographic',
	// 		'echarts/theme/macarons',
	//
	//     ],
	//     function (ec) {
	// 		for(i=0;i<4;i++){
	// 			cd=i.toString();
	// 			//--- 折线图 ---
	// 			var myChart2 = ec.init(document.getElementById('fangda'));
	// 			// var myChart2 = ec.init(document.getElementById('fangda'+cd));
	// 			myChart2.setOption({
	// 				backgroundColor: '#c0c5b5',
	// 				tooltip : {
	// 					trigger: 'axis',
	// 					axisPointer: {
	// 						type: 'cross',
	// 						label: {
	// 							backgroundColor: '#ff0000'
	// 						}
	// 					}
	// 				},
	// 				legend: {
	// 					data:['病人体温'],                        //标题
	// 					backgroundColor: '#8b8b8b',
	// 				},
	// 				toolbox: {                              //工具箱
	// 					show : true,
	// 					feature : {
	// 						dataZoom: {
	// 						    yAxisIndex: 'none'
	// 						},
	// 						// mark : {show: true},
	// 						dataView : {show: true, readOnly: false},
	// 						magicType : {show: true, type: ['line', 'bar']},
	// 						restore : {show: true},
	// 						saveAsImage : {show: true}
	// 					}
	// 				},
	// 				calculable : true,
	// 				xAxis :
	// 					{
	// 						axisLabel:{
	// 						    rotate: 60,
	// 						    interval:0
	// 						},
	//
	// 						type : 'category',
	// 						// type:'time',
	// 						data : row_list,
	// 						name:'时间',
	// 						boundaryGap: false,
	// 						axisLine: {
	// 						  //   lineStyle: {
	// 								// color: 'red',
	// 						  //   }
	// 						},
	// 					},
	//
	// 				yAxis : [
	// 					{
	// 						type : 'value',
	// 						splitArea : {show : true},
	// 						name:'体温',
	// 						axisLabel: {
	// 						    formatter: '{value} °C',
	// 						},
	// 						scale:true,
	// 						max:45,
	// 						min:30,
	// 						splitNumber:20,
	// 						// splitLine:{show:false}, //去除网状线 默认为true
	//
	// 					}
	// 				],
	// 				series : [
	// 					{
	// 						name:'体温',
	// 						type:'line',
	// 						// itemStyle:{
	// 						//     normal:{ color: "#00aa00" } //坐标圆点的颜色
	// 						// },
	// 						lineStyle:{
	// 							normal:{ width:1,color: "white",backgroundColor:'black'  }//线条的颜色及宽度
	// 						},
	// 						label: {//线条上的数字提示信息
	// 							normal: {
	// 								show: true,
	// 								position: 'top'
	// 							}
	// 						},
	// 						// smooth: true,//线条平滑
	// 						data:time_list,
	// 						markPoint: {
	// 						    data: [
	// 						        {type: 'max', name: '最大值'},
	// 						        {type: 'min', name: '最小值'}
	// 						    ]
	// 						},
	// 						markLine: {
	// 						    data: [
	// 						        {type: 'average', name: '平均值'}
	// 						    ]
	// 						}
	//
	// 					},
	// 					// {
	// 					//     name:'降水量',
	// 					//     type:'line',
	// 					//     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
	// 					// }
	//
	// 				]
	// 			});
	//
	//
	// 		}
	// 	window.onresize = function(){
	// 		myChart2.resize();//使图表适应
	// 	};
	//     }
	// );
	
}
function fangda_cannl(){
	document.getElementById('fangda_div').style.display='none';
}
