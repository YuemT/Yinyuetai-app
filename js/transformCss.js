//为避免污染全局命名空间，将函数封装到自调函数中
//变换函数

(function (w){
	w.transformCss = function(node,name,value){
	//检测node上面有没有transform属性，没有的话，添加进去
	if(!node.transform){
		node.transform = {};
	}
	//根据实参的数量判断读／写操作
	if(arguments.length>2){
		//写操作
		//写入操作，把对应的name和value添加到对象中
		node.transform[name]=value;
		//创建一个空串,里面保存name和value的拼串代码
		var result = '';
		//遍历transform中的属性，根据不同的属性，添加不同的属性值：数值／px／deg
		for(var item in node.transform){
			//根据name，写出相应的执行代码
			switch(item){
				//数值
				case 'scale':
				case 'scaleX':
				case 'scaleY':
					result += item+'('+node.transform[item]+')';
					break;
				//deg
				case 'rotate':
				case 'rotateX':
				case 'rotateY':
					result += item+'('+node.transform[item]+'deg)';
					break;
				//px
				case 'translate':
				case 'translateX':
				case 'translateY':
				case 'translateZ':
					result += item+'('+node.transform[item]+'px)';
					break;	
			}
			//给node添加style样式
			node.style.transform = result;	
		}
	　}else{
		//读
		//判断当前元素知否含有某属性,若没有则设置其默认值,倍数值默认1,数值默认0
		if(typeof node.transform[name] == 'undefined'){
			//只有scale等倍数时默认1,其他默认0
			if(name == 'scale'|| name == 'scaleX' || name == 'scaleY'){
				value = 1;
			}else{
				value = 0;
			}
		}else{
			//若存在则执行读取操作
			value = node.transform[name];	
		}
		//最后把结果返回
		return value;	
	}
	}
})(window)
