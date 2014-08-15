server {
  listen 80;
  listen 443 ssl;
  server_name bargain-dev.paytm.com bargain.paytm.com;
  root /var/www/marketplace-bargain-panel/releases/current/public/;
  index index.html index.htm;

  access_log /var/log/nginx/marketplace-bargain-panel.access.log;
  error_log  /var/log/nginx/marketplace-bargain-panel.error.log;

  error_page 503 @maintenance;

  if (-f $document_root/system/maintenance.html) {
    return 503;
  }

  location / {
    try_files $uri $uri/index.html @proxy;
  }

  location @proxy {
    proxy_pass   http://127.0.0.1:4199;
    add_header Strict-Transport-Security max-age=31536000;
  }
}
