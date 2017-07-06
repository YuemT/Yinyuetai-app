(function(w){
		w.Cdrag = function(wrap,callback){
			//获取content内容区
			var content = wrap.children[0];
			//3d变换处理文字闪的效果
			transformCss(content,'translateZ',0.01);
			//定义元素的初始和结束位置时间以及时间差，位移
			var nowP = 0;
			var nowT = 0;
			var lastP = 0;
			var lastT = 0;
			var disP = 0;
			var disT = 0;
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
			//通过Tween替换贝塞尔曲线，动态获取每一步的translateY，实现即点即停的效果
			var Tween = {
				//t:当前一开始的的次数
				//b:初始位置
				//c:初始位置与目标位置的差值
				//d:总次数
				//s:回弹效果（s越大，回弹越远）
				//返回值：每一步移动的距离
				
				//move阶段匀速
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//if判断区域有回弹效果
				easeOut: function(t,b,c,d,s){
				            if (s == undefined) s = 1.70158;
				            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
				       }	
			}
			
			//内容区touchstart事件
			content.addEventListener('touchstart',function(ev){
				content.style.transition = 'none';
				//手指点击时关闭定时器
				clearInterval(content.timer);
				//获取手指当前位置
				var touch = ev.changedTouches[0];
				startY = touch.clientY;
				//防抖动
				startX = touch.clientX;
				//获取元素当前位置
				eleY = transformCss(content,'translateY');
				//定义元素的初始位置，时间（用于后期获取speed）
				lastP = eleY;
				lastT = new Date().getTime();
				//清空位移
				disP = 0;
				//处理滚动条区域
				if(callback&&callback['start']){
					callback['start']();
				};
				//每次start之后置回
				isFirst = true;
			    isY = true;
			})
			
			//内容区touchmove事件
			content.addEventListener('touchmove',function(ev){
				//防抖动 看门狗，当isY为false时不执行后面的逻辑
				if(!isY){
					return;
				}
				//获取元素当前位置
				var touch = ev.changedTouches[0];
				var nowY = touch.clientY;
				var disY = nowY - startY;
				//防抖动
				var nowX = touch.clientX;
				var disX = nowX - startX;
				//判断是不是第一次，是的话设置isFirst = false;
				if(isFirst){
					isFirst = false;
					//判断横向移动距离是否大于竖向
					if(Math.abs(disX)>Math.abs(disY)){
						isY = false;
					}
				}
				//元素当前位置＝初始位置＋位移
				var translateY = eleY + disY;
				//模拟越来越难拖的效果
				var scale = 0;
				//临界点的值
				var minHeight = document.documentElement.clientHeight - content.offsetHeight;
				//位置限定
				if(translateY > 0){
					scale = 0.8 - translateY/document.documentElement.clientHeight;
					translateY = translateY * scale;
				}else if(translateY < minHeight){
					var over = minHeight - translateY;//负值
					scale = 0.8 - over/document.documentElement.clientHeight;
					translateY = minHeight - (over * scale);
				}
				//设置元素当前位置
				transformCss(content,'translateY',translateY);
				//获取元素当前位置，时间以及位移和时间差
				nowP = translateY;
				nowT = new Date().getTime();
				disP = nowP - lastP;
				disT = nowT - lastT;
				//设置滚动条的显示与隐藏
				if(callback&&callback['move']){
					callback['move']();
				};
			})
			
			//内容区touchmove事件
			content.addEventListener('touchend',function(ev){
				var touch = ev.changedTouches[0];
				//获取速度
				//没有使用disT而是(nowT-lastT)是为了防止页面刷新后第一次点击事件导致disT=0,speed成为NaN值
				//导致之后的点击拖动不生效
				var speed = disP/(nowT-lastT);
				//定义元素的位置为当前位置＋位移
				var target = transformCss(content,'translateY') + speed*100; 
				//位置限定
				var minHeight = document.documentElement.clientHeight - content.offsetHeight;
				//定义Tween的类型，默认是匀速Linear
				var type = 'Linear';
				//特定位置后，设置回弹效果
				if(target>0){
					target = 0;
					type = 'easeOut';
				}else if(target < minHeight ){
					target = minHeight;
					type = 'easeOut';
				};
				//定义一次move函数执行需要的总时间
				var time = 1;
				move(target,type,time);
			});
			
			//move函数，用来实现即点即停的效果
			//target:目标位置
			//type:类型
			//time:执行的时间
			function move(target,type,time){
				//t:当前一开始的的次数
				//b:初始位置
				//c:初始位置与目标位置的差值
				//d:总次数
				//s:回弹效果（s越大，回弹越远）
				//返回值：点击时元素的位置
				var t = 0;
				var b = transformCss(content,'translateY')
				var c = target - b;
				var d = time/0.02;
				//每一次执行前，清除定时器
				clearInterval(content.timer);
				//开启定时器，为content添加timer属性
				content.timer = setInterval(function(){
					//每执行一次t＋1
					t++;
					//限定t的范围，当前次数>总次数时关闭定时器
					//此时touchend事件结束，设置滚动条的显示与隐藏
					if(t>d){
						clearInterval(content.timer);
						if(callback&&callback['end']){
						callback['end']();
						};
					}else{
						//Tween[type](t,b,c,d)的返回值是点击时元素的位置
						var point = Tween[type](t,b,c,d)
						//设置元素的当前位置
						transformCss(content,'translateY',point);
					}
				},20);
			}
			}
})(window)
