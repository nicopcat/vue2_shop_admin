// 封装的一个 js 对象递归合并函数
export default function mergeObj(target, sources) {
  const obj = target
  if (typeof target !== 'object' || typeof sources !== 'object') {
    return sources // 如果其中一个不是对象 就返回sources
  }
  for (const key in sources) {
    // 如果target也存在 那就再次合并
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      obj[key] = mergeObj(target[key], sources[key])
    } else {
      // 不存在就直接添加
      obj[key] = sources[key]
    }
  }
  return obj
}
