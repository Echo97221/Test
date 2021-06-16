// call,第一个参数是绑定对象，后面的是传入函数的参数
Function.prototype.defineCall = function(context) {
  context = context || window;
  context.fn = this; // this是调用defineCall的那个方法
  let args = Array.from(arguments).slice(1);
  let result =arguments.length > 1 ? context.fn(...args) : context.fn(); 
  delete context.fn; // 执行后删除新增属性
  return result;
}

//测试用例：
obj={c:2};
function aaa(x,y) {console.log(this,x,y)}
aaa.call(obj,1,2)//{c:2} 1 2
aaa.defineCall(obj,1,2)//{c:2,func:[function aaa]} 1 2

// apply，第一个参数是绑定对象，第二个参数是传参数组
Function.prototype.defineApply = function (context) {
  context = context || window;
  context.fn = this;
  let result = arguments[1] ? context.fn(...arguments[1]) : context.fn()
  delete context.fn;
  return result;
}
aaa.apply(obj,[1,2])//{c:2} 1 2
aaa.defineApply(obj,[1,2])//{c:2,func:[function aaa]} 1 2

// bind 传入参数和call一样。但不会立即执行。返回的是已绑定的新函数
// 1. 通过call实现
Function.prototype.defineBind = function(...arr) {
  let that = this;
  return function () {
    that.call(...arr);
  }
}

obja = {
  a: 1
};

function say(a, b, c) {
  console.log(this);
  console.log(a, b, c);
}
say.defineBind(obja, 1, 2, 3)();
//{ a: 1 }
//1 2 3

