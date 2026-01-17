var posts=["2026/01/17/2026-01-16-Disboundia-开发日志/","2026/01/17/2026-01-17-Disboundia-开发日志/","2025/11/07/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };