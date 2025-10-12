```text
docker run --name nginx --restart=always -p 443:443 -p 80:80 -d -v /usr/local/nginx/nginx.conf:/etc/nginx/nginx.conf -v /usr/local/web:/usr/local/web -v /usr/local/upload:/usr/local/upload nginx


docker build -t watoukuang-front:latest .
docker run --name watoukuang-front --restart=always -p 3000:3000 watoukuang-front:latest
```
154.204.34.183
root
qDTAc7L04sgM