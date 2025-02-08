const hostname = 'yhchat.us.kg'; // 你的 Cloudflare Workers 运行的主域名
const jumpUrl = 'https://github.com/jibukeshi/yunhu_cdn_worker/tree/main'; // 直接访问主域名时的重定向目标

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // **处理 CORS 预检（OPTIONS 请求）**
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400' // 预检缓存 24 小时
      }
    });
  }

  // **如果直接访问 Workers 绑定的主域名，跳转到Github**
  if (url.hostname === hostname) {
    return Response.redirect(jumpUrl, 302);
  }

  // **提取子域名**
  let subdomain = url.hostname.replace(`.${hostname}`, ''); // 移除主域名，保留子域名
  
  // **目标服务器的真实地址**
  const targetUrl = `https://${subdomain}.jwznb.com${url.pathname}${url.search}`;

  // **修改请求头**
  const modifiedHeaders = new Headers(request.headers);

  // **删除浏览器发给 Workers 的原始 Referer，防止泄露**
  modifiedHeaders.delete("Referer");

  // **伪造 Referer**（确保和目标服务器匹配）
  modifiedHeaders.set("Referer", `https://myapp.jwznb.com/`);

  // **移除 Origin，防止跨域拦截**
  modifiedHeaders.delete("Origin");

  // **伪造 User-Agent 以避免反爬**
  modifiedHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36");

  // **构造新的请求**
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: modifiedHeaders,
    body: request.body,
    redirect: "follow"
  });

  // **发起请求**
  let response = await fetch(modifiedRequest);

  // **手动添加 CORS 头**
  response = new Response(response.body, response);
  response.headers.set('Access-Control-Allow-Origin', '*'); // 允许所有网站访问
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Expose-Headers', '*'); // 允许前端访问所有响应头
  response.headers.set('Vary', 'Origin'); // 适配多个跨域请求

  return response;
}
