// 插入排序
// 适⽤与规模⼩、有序的数据3w-
// 排将数组分成两个，⼀个是已排序好的，⼀个是待排序的，将待排序的元素和已排序好的元素进⾏⽐较，插⼊适当位置。
// 时间复杂度O(n^2),空间复杂度O(1)
function insertSort(arr) {
  let len = arr.length;
  for (let i = 1; i < len; i++) { //外循环从1开始，默认arr[0]是有序段
    for(let j = i; j > 0; j--) { //j = i,将arr[j]依次插入有序段中
      if(arr[j] < arr[j-1]) {
        [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
      } else {
        break;
      }
    }
  }
  return arr;
}
a = [1, 4, 6, 8, 32, 9, 34, 78, 3, 54];
console.log(insertSort(a));

