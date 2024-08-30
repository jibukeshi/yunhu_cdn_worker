# 使用 Cloudflare Worker 获取云湖资源

由于云湖的视频、音频、文件 CDN 有 referer 限制，且海外访问速度不佳，本项目通过 Cloudflare Worker 的反代，帮助云湖机器人开发者快速获取云湖的视频、音频、文件等资源。

## 准备

- 一个 Cloudflare 账号
- 一个托管到 Cloudflare 的域名（不建议使用 `workers.dev` 域名）

## 创建 Worker

1. 打开 Cloudflare 仪表盘 `https://dash.cloudflare.com/`，登录自己的账号，添加域名
2. 打开侧边栏，点击 `Workers 和 Pages`
3. 点击 `创建`，新建一个 Worker
4. 给你的 Worker 取一个名字，然后点击 `部署`

## 绑定域名

1. 创建完成后，返回到 Workers 页面，点击你刚刚创建的 Worker
2. 点击 `设置`，选择 `触发器`
3. 点击 `添加自定义域`，添加你的域名和你的域名的泛子域
    > 假设你的域名为 `sub.example.com`，则你应该添加 `sub.example.com` 和 `*.sub.example.com`
4. 点击 `添加路由`，填入 `*.你的域名/*`，区域选择你的域名
    > 假设你的域名为 `sub.example.com`，则你应该填入 `*.sub.example.com/*`

## 编辑代码

1. 点击 `编辑代码`（在标签页最右边，手机需要滑动才能看到）
2. 复制本项目的 `worker.js` 并粘贴到代码编辑器中
3. 修改 `hostname` 变量为你的域名，`jumpUrl` 为当用户访问你的主域名的时候的跳转链接
4. 点击 `部署` 

## 调用反代

只需要将原链接中的 `jwznb.com` 替换为你的域名即可使用，无需添加 referer。

> 假设你的域名为 `sub.example.com`，源文件 URL 为 `https://chat-file.jwznb.com/b74da22159ced816e663f73bb9874a98.mp3`，则你应该使用 `https://chat-file.sub.example.com/b74da22159ced816e663f73bb9874a98.mp3` 来访问这个文件

推荐搭配[使用 PHP 编写的云湖机器人 SDK](https://github.com/jibukeshi/yunhu_bot_php)一起使用