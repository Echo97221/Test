// 用类实现一个简单的Promise,只实现了异步功能，没有实现链式调用等
const PENDING = 'pending';
const SUCCESS = 'fulfilled';
const FAIL = 'rejected';

class MyPromise {

    constructor(executor){
        this.status = PENDING;
        this.value;
        this.reason;

        // 用来存储 订阅的内容的
        this.onSuccessCallbacks = [];
        this.onFailCallbacks = [];

        let resolve = (value)=>{
            if(this.status === PENDING) {
                this.status = SUCCESS;
                this.value = value;
                this.onSuccessCallbacks.forEach(fn => fn());
            }
        };
        let reject = (reason)=>{
            if(this.status === PENDING) {
                this.status = FAIL;
                this.reason = reason;
                this.onFailCallbacks.forEach(fn => fn());
            }
        };
        // 若执行过程中有错误，执行reject函数
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        
        let promise2 = new MyPromise((resolve,reject) => {
          // 当Promise里直接同步控制状态改变时，状态为SUCCESS或FAIL
          // 此时状态落定了，可以立即向任务队列添加then()中的处理程序
          // 为了简化流程，这里直接用宏任务setTimeout代表异步添加处理程序的过程。实际应该用微任务
          if(this.status === SUCCESS){
            setTimeout(() => {
              try {
                let x = onFulfilled(this.value); // x是then处理函数的返回值
                this.resolvePromise(promise2, x, resolve, reject); // 根据x来确定返回的promise2的值和状态
              } catch(e) {
                reject(e)
              }
            })
            
          }
          if(this.status === FAIL){
            setTimeout(() => {
              try {
                let x = onRejected(this.reason);
                this.resolvePromise(promise2, x, resolve, reject);
              } catch(e) {
                reject(e)
              }
            });
          }
          // 当Promise里面有异步请求控制状态改变时，Promise的状态为PENDING
          // 此时状态没有落定，因此先将then的处理程序分别放进成功、失败的队列
          // 待promise状态落定才将处理程序加入异步任务队列
          if(this.status === PENDING) {
            this.onSuccessCallbacks.push(()=>{
              setTimeout(() => {
                try {
                  let x = onFulfilled(this.value);
                  this.resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                  reject(e)
                }
              })
            });
            this.onFailCallbacks.push(()=>{
              setTimeout(() => {
                try {
                  let x = onRejected(this.reason);
                  this.resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                  reject(e)
                }
              });
            });
          }
        });
        return promise2;
        
    }
    // Promise解决程序 2.3  
    // promise2是then返回的期约实例；x是then处理程序的结果.Promise2的状态和值与x有关
    resolvePromise(promise2, x, resolve, reject) {
      // promise的then处理程序不能返回promise2，否则循环引用，会造成死循环
      if (promise2 === x) {
        reject(new TypeError('chaining cycle'))
      }
      // 判断x类型，是不是引用类型
      // 若是普通值直接返回resolve包裹
      if (x && typeof x === 'object' || typeof x === 'function' ) {
        let used;  // 由于第三方thenable接口对象可能可以同时运行then的成功和失败处理程序，所以加一个标示符，确保resolve或者reject后的状态不会再次发生变更
        try {
          // x是引用类型也有多种情况，只有在x有then方法，且then方法为函数时才是一个thenable对象
          let then = x.then;  // x有then方法
          if (typeof then === 'function') {   // 且x的then方法是一个函数（另一种可能是返回了一个对象里面有then属性，而不是then方法，那就只是一个普通对象）
            // 此时，认为x是个promise（这里更好的理解是thenable接口对象）
            // 如果promise是成功的，那么结果向下传递，如果失败了就传到下一个失败里面去
            then.call(x, r => {
              if (used) return;
              used = true;
               // 这里做一个递归，因为可能x的then方法返回值也是promise
              this.resolvePromise(promise2, r, resolve, reject)
            }, e => {
              if (used) return;
              used = true;
              reject(e)
            });
          } else {  // x是普通对象，直接返回即可
              if (used) return;
              used = true;
              resolve(x)
          }
        } catch(e) {
          if (used) return;
          used = true;
          reject(e)
        }
      } else {
        // x不是一个promise，只是一个普通数值，那直接resolve包裹就行了
        resolve(x);
      }
    }

    // 其他原型方法:
    // catch,直接调用then
    catch(onRejected) {
      return this.then(null, onRejected);
    }
    // finally。不接受任何参数，无论解决还是拒绝都会执行处理函数cb，传递父期约
    finally(callback) {
      return this.then(
        // finally主要用于传递父期约，当父期约为解决状态，cb()返回值不为决绝或待定的promise时，传递解决值
        // 当父期约为拒绝状态，cb()返回值不为决绝或待定的promise时，传递决绝值
        // ---
        // resolve(cb())，是因为cb()若返回一个promise，会对finally返回的promise状态产生影响
        // 比如，若cb()返回一个拒绝的promise，则finally最后返回的也是拒绝的期约,决绝值为cb()返回的promise的值
        // 若cb()返回一个待定的promise，finally最后也会返回一个待定的promise
        value=> Promise.resolve(callback()).then(()=>value),
        reason=>Promise.resolve(callback()).then(()=>{throw new Error(reason)})
      )
    }

    // 其他静态方法
    // MyPromise.resolve和MyPromise.reject,返回一个解决或拒绝的实例即可
    static resolve(value) {
      return new MyPromise((resolve,reject) => {
        resolve(value);
      })
    }
    static reject(reason) {
      return new MyPromise((resolve,reject) => {
        reject(reason);
      })
    }
    // MyPromise.all：等待参数数组中所有promise解决后才返回结果
    static all(promises) {
      return new Promise((resolve, reject) => {
        let index = 0;
        let result = [];
        // 空的可迭代对象等于Promise.resolve
        if (promises.length === 0) {
            resolve(result);
        } else {
            // 判断是否全部fulfilled，不是则继续向结果中增添数据，是则返回解决值为结果数组的期约
            function processValue(i, data) {
                result[i] = data;
                if (++index === promises.length) {
                    resolve(result);
                }
            }
            // 遍历可迭代对象
            for (let i = 0; i < promises.length; i++) {
                    // promises[i] 可能是普通值,需要加一层resolve
                    // promises[i]状态落定后，processValue函数将其值加入result数组
                    Promise.resolve(promises[i]).then((data) => {
                    processValue(i, data);
                }, (err) => {
                    // 若promises[i]状态为拒绝，直接return第一个落定的拒绝期约
                    reject(err);
                    return;
                });
            }
        }
    });
    }
    
    // MyPromise.race：返回最快落定的那个promise。
    static race(promises) {
      return new Promise((resolve, reject) => {
        // 如果传入参数为空，则一直等待
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
              // 无论期约落定后的状态是什么，一律返回最先落定的期约
                Promise.resolve(promises[i]).then((data) => {
                    resolve(data);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        }
      });
    }

}

// 测试一下
let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
      resolve(222);
      // reject(333);
  }, 1000);
}).then(
  (value) => {
      console.log('then1' + value);
      return 111;
  },
  (reason) => {
      console.log(reason);
  }
).then((value) => {
  console.log('then2' + value);
  return 999;
}).finally(() => {
  console.log('finally SUCCESS');
})

let arr = [MyPromise.resolve(1), 
           MyPromise.resolve(2),
           new MyPromise((resolve, reject) => {
                setTimeout(() => {
                  resolve(33);
              }, 3000);
           }) ];
let arr1 = [MyPromise.resolve(1), MyPromise.resolve(2),MyPromise.reject('miao')];
MyPromise.all(arr).then((r)=> console.log(r));
MyPromise.all(arr1).catch((r)=> console.log(r));
MyPromise.race(arr).then((r)=> console.log(r));

// setTimeout(() => {
//    console.log(p);
//  }, 2000);
