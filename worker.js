const hostname = 'yhchat.us.kg' // 这里填入你的域名
const jumpUrl = 'https://github.com/jibukeshi/yunhu_bot_php' // 这里填入当用户直接访问你的主域名时的重定向URL

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 获取子域名
  const subdomain = url.hostname.split('.')[0]
  
  // 如果没有子域名，则重定向到指定页面
  if (url.hostname === hostname) {
    return Response.redirect(jumpUrl, 302)
  }
  
  // 构造新的目标URL
  const targetUrl = `https://${subdomain}.jwznb.com${url.pathname}`

  // 克隆请求对象并修改Referer头
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: new Headers({
      ...Object.fromEntries(request.headers),
      'Referer': 'http://myapp.jwznb.com/',
    }),
    body: request.body,
    redirect: 'follow'
  })
  
  // 发起到目标URL的请求并返回响应
  return fetch(modifiedRequest)
}
