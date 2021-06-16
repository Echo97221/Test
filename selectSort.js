// 选择排序
// 选择排序是从数组的开头开始，将第一个元素和其他元素作比较，检查完所有的元素后，最小 (大) 的放在第一个位置，接下来再开始从第二个元素开始，重复以上一直到最后。
// 编程思路：两个循环，外循环不断递减至结尾，内循环负责找出最小的值给外层循环交换位置
// 时间复杂度O(n^2),空间复杂度O(1)
function selectSort(arr) {
  let len = arr.length;
  let minIndex, minValue, temp;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    minValue = arr[minIndex];
    for (let j = i+1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
        minValue = arr[minIndex];
      }
    }
    // 交换位置
    temp = arr[i];
    arr[i] = minValue;
    arr[minIndex] = temp;
  }
  return arr
}
a = [1,4,6,8,32,9,34,78,3,54];
console.log(selectSort(a));
