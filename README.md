### 导航条
1. 用绝对定位模拟固定定位

    * 移动端的浏览器太多,有些低版本的浏览器不兼容固定定位,
        这时我们只能用绝对定位模拟固定定位(pc端上 ie6不支持).
2. css中几个较为特别的属性

    * input标签的外轮廓:
    
            input{
                outline:none;
            }
    * input text属性内的文字样式 placeholder
    
            #nav input[type='text']::-webkit-input-placeholder{
                color:#333;
                }
    * 获取焦点 :focus
    
            #nav input[type='text']:focus{
                background:#fff;
            }
    * 清除a链接默认的高亮模式
            
            -webkit-tap-highlight-color:rgba(0,0,0,0);

----------

### 拖拽中的过程(橡皮筋效果)
* 拖拽的过程需要在touchmove中实现
* 我们需要的效果是:能拖拽,但是越来越难拖
* 实现:通过scale来实现
    * 比例拖出效果,尽量满足大部分机型
    * 左边:(左边留白/屏幕的宽度)
    
            scale = 1 - translateX/document.documenElement.clientWidth;
            范围:在原有的拖拽的距离*比例,得到最终的拖拽结果
    * 右边:
    
            注意点:留白区域over
            var minWidth = document.documentElement.clientWidth - bannerList.offsetWidth;
            var over = minWidth - translateX;
                    这时我们要考虑正负方向
            translateX = minX - (over *	scale);
            
----------
### 3D效果
	
	transformCss(bannerList,'translateZ',0.01);
----------
### 快速滑屏
* 快速滑屏的效果是需要在touchend中实现的
	* 有一个速度产生:
	
            定义了7个变量
                latePoint = 0;
                lateTime = 0;
                nowPoint = 0;
                nowTime = 0;
                disPoint = 0;
                disTime = 1;
                speed = disPoint / disTime);
            var target = transformCss(bannerList,'translateX') + speed * 100;
	* 回弹效果:
        * 限定回弹的范围,产生过渡效果
        
                用贝塞尔函数cubic-bezier(0,1.57,.41,1.73)产生
                bug:手指一点一抬,disPoint = 0;disTime = 0;导致speed为NAN	所以var disTime = 1;			
                或者var speed = disPoint / (nowTime - lastTime);
                当我做一个完整的拖拽过程，然后我再去点击ul,speed = disPoint/disTime还存在，所以应该在touchstart清除

		* 可以用Tween模拟贝斯尔函数的效果		
		
----------
### 点击变色
* 方法一:
    * 给每一个li遍历,绑定监听事件touchend
    * 这时再给每一个li遍历,清除原有的样式,再给对应的li添加className
    
    * 但是,有误触的效果
        如果li上发生了touchmove,就不要触发touchend
        所有在touchmove中,给相应的li,添加isMove属性,并置为true
        只要isMove为true,就在touchmove中执行,不出发touchend
* 方法二:
    * 采用事件委托的形式(target)
        给li的父级添加监听事件touchend,通过touch.target.nodeName,改变其className样式  注意:li 和 a.
* 方法三:
    * 通过改变a的样式,也就是把li最终的样式给a添加上,className给a添加上
    方法同一

----------

### 防抖动

* 初步处理: 首次滑动时,disY > disX,禁止掉X方向上的逻辑
    
        if(Math.abs(disY) > Math.abs(disX)){
            return;
            };
* 如果多次的touchmove

            定义两个变量	
            //判断是不是第一次滑动
                var isFirst = true;
            //是否在X上滑动
                var isX = true;
        在touchmove中如果isFirst = true(证明我们是第一次进来),此时让我isFirst = false;
            并且一旦disY > disX ,就禁止掉X上面的逻辑,既isX = false;
        当我多次touchmove时,我们还要判断上一次的isX是禁止了还是没禁止
        如果isX = false;则直接return;(看门狗)
        if(!isX){
            return;
        };
        当我第二次进入到touchstart中是,我们需要清除上一次start中的isFirst和isX的状态.
        并把它们重置为true;

----------

### tab切换
1. 用js重置主体位置,-translateX;	
2. 在touchmove时,手指划过1/2时,立马跳转到下一页(loading图), 0 或 -2 * translateX
3. 在touchmove时,手指没有划过1/2时,跳转到当前页面 -translateX;

4. load什么时候出现
    * 给load做一个标识
    * 默认一开始没有
    * 当手指touchmove划过1/2,出现
5. load出现后的操作	
    * 当页面彻底切换过去之后 (过渡结束),load才出现	
    * 过渡结束:
        * 兼容处理
        
                wrap.addEventListener('transitionEnd',transitionEnd)
                wrap.addEventListener('webkittransitionEnd',transitionEnd)
        * 解绑处理
        
                wrap.removeEventListener('transitionEnd',tansitionEnd)
                wrap.removeEnentListener('webkittransitionEnd',transitionEnd)
6. 同步小绿(span)
    * 拿到a元素距离body的offsetLeft


----------
### 滚动条
* scale1滚动条的系数:

        滚动条高度/视口高度 = 视口高度/内容高度
        
        scale1 = 视口高度/内容高度

* scale2内容区与滚动条位移距离的系数

        滚动的偏移量 / (视口高度- 滚动条高度) = 内容偏移量 / (内容高度 - 视口高度)
    
        ==> 滚动条的偏移量= 内容偏移量 * ((视口高度 - 滚动条高度) / (内容高度 - 视口高度))
        
        内容偏移量= 滚动条的偏移量 / ((视口高度 - 滚动条高度)	 / (内容高度 - 视口高度))
        
        内容偏移量 = 滚动条偏移量 / scale1 
	
	

