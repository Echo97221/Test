// 快速排序
// 分治：取⼀个基准值，⽐基准值⼩的在左边，⼤的在右边；左右在继续这样的操作，最后合并
// 时间复杂度O(nlog2n),空间复杂度O(nlog2n)
function quickSort(arr) {
  if(arr.length < 2) {
    return arr;
  }
  let pivotIndex = Math.floor(arr.length/2);
  let pivot = arr.splice(pivotIndex,1)[0];
  let left = [];
  let right = [];
  arr.forEach(item => {
    item > pivot ? right.push(item) : left.push(item);
  });
  return quickSort(left).concat([pivot], quickSort(right));
}
a = [1, 4, 6, 8, 32, 9, 34, 78, 3, 54];
console.log(quickSort(a, 0, a.length - 1));


var sortArray = function(nums) {
  quicksort2(0,nums.length-1,nums); //这里代入的是待排数组的第一个和最后一个元素的index
  return nums;
};

function quicksort2(l,r,a) {
  if (l >= r) return; //why用>=，白天讲过了
  var p = a[l+r>>1]; //选主元，取中间元素策略，位运算最佳。(l+r)/2，l+(r-l)/2
  var i = l-1, j = r+1; //while中先自增/减后再判断，提前预留偏移量
  while (i < j) {
      while (a[++i] < p); //找>=p的元素
      while (a[--j] > p); //找<=p的元素
      if(i < j) { //找到一组后，若i、j未相遇，则交换两个元素
          var m = a[i];
          a[i] = a[j];
          a[j] = m;
      }
  }//退出时有i==j或i==j+1
  quicksort2(l,j,a);
  quicksort2(j+1,r,a);
}
console.log(sortArray(a));