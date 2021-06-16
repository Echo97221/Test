// 浅拷贝与深拷贝
// --------------------------------------浅拷贝------------------------------------------------
// 浅拷贝，只拷贝对象。仅拷贝对象的一层属性，若第一层属性的value是一个对象，则拷贝这个对象的地址。
// 1.手写实现
function shallowCopy(obj) {
  // 只拷贝对象
  if (!obj || typeof obj !== 'object') return obj
  // 根据obj的类型判断是新建一个数组还是对象
  let newObj = Array.isArray(obj) ? [] : {}
  // 遍历obj，判断是obj的属性才拷贝
  // Object.keys可以直接获得可枚举的实例属性，而用for in获取的是原型属性和实例属性，还需要加判断hasOwnProperty
  Object.keys(obj).forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj
}
// 原对象
var obj = {
  name: 'Jack',
  age: 20,
  home: {
    hubei: 'wuhan'
  },
  habit: ['sing', 'dance', 'basketball']
}
// 新建拷贝对象
//var newObj = shallowCopy(obj) // 进行浅拷贝
// console.log(newObj)
//newObj.home.hubei = 'xiangyang'
//console.log(newObj) // 改变拷贝对象的值
//console.log(obj) // 由于拷贝的是地址，原对象对应的属性值也会改变
// 2.Object.assign实现
// Object.assign ⽅法⽤于对象的合并，将源对象（source）的所有可枚举属性，复制到⽬标对象（target）
const target = { a: 1 }
const source1 = { b: 2 }
const source2 = { c: 3 }
Object.assign(target, source1, source2)
console.log(target)

// ----------------------------------------深拷贝--------------------------------------------------
// 深拷贝主要要考虑数据类型的多样，如String、Number、Boolean、null、undefined、Object、Array、Date、RegExp，Error
// 首先，如果是引用类型，要判断一下type；写一个判断函数
IsType = function(type,value) {
  if (Object.prototype.toString.call(value) === `[object ${type}]`) {
  return true
}};
// 写主函数
const DeepCopy = arg => {
  const newValue =
  // 判断是哪一种数据类型。注意用Object.prototype.toString.call，都是大写！！！！
  IsType("Object", arg) ? {} :   
  IsType("Array", arg) ? [] :
  IsType("Date", arg) ? new arg.constructor(arg.getTime()) :  // 新建一个Date实例
  IsType("RegExp", arg) || IsType("Error", arg) ? new arg.constructor(arg):
  arg;
  // 若是数组和对象，遍历一下
  if (IsType("Object", arg) || IsType("Array", arg)) {
    Object.keys(arg).forEach ( key => {
      newValue[key] = DeepCopy(arg[key]);
    });
    }
  
  return newValue
}
// 原对象
var now = new Date()

var obj1 = {
  name: 'Jack',
  age: 20,
  home: {
    hubei: 'wuhan'
  },
  habit: ['sing', 'dance', 'basketball'],
  time: now
}
// 新建拷贝对象
console.log(obj1);
var newObjDeep = DeepCopy(obj1) ;// 进行深拷贝
newObjDeep.home.hubei = 'xiangyang';
newObjDeep.time = new Date(1234567890);
console.log(obj1); // 深拷贝新建了对象存储原对象的拷贝值，因此原对象不变
console.log(newObjDeep) ;// 拷贝对象对应属性会变
