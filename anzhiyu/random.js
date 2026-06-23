var posts=["2026/01/17/2026-01-16-Disboundia-开发日志/","2026/01/17/2026-01-17-Disboundia-开发日志/","2026/01/18/2026-01-18-Disboundia-开发日志/","2026/06/23/2026-06-23-Disboundia-开发日志/","2026/04/29/2026-04-29-music-gallery-dev-log/","2026/06/20/Linux虚拟机配置/","2025/11/07/hello-world/","2026/01/24/深广小记/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };