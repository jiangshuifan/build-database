// post文件下载
export function downloadBlobFile(blob: any, fileName: string) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}
// get文件下载
export function downloadFileByUrl(url: string, fileName: string) {
  if (!url) return
  const link = document.createElement('a') // 创建a标签
  link.style.display = 'none' // 使其隐藏
  link.href = url // 赋予文件下载地址
  link.setAttribute('download', fileName) // 设置下载属性 以及文件名
  document.body.appendChild(link) // a标签插至页面中
  link.click() // 强制触发a标签事件
  document.body.removeChild(link)
}
