# Hướng Dẫn Deploy Landing Page lên VPS Ubuntu

## Thông Tin Dự Án
- **Repository GitHub**: https://github.com/Nguyen15idhue/LandingPageMKT.git
- **Thư mục trên VPS**: `/var/www/Mkt_RS10`
- **Web Server**: Nginx

---

## BƯỚC 1: Đẩy Code Lên GitHub (Từ Windows)

Mở PowerShell trong thư mục dự án và chạy:

```powershell
cd C:\laragon\www\LandingPageMKT
git add .
git commit -m "Update landing page"
git push origin main
```

---

## BƯỚC 2: Cài Đặt Trên VPS Ubuntu

### 2.1. SSH Vào VPS

```bash
ssh username@your_vps_ip
```

Thay `username` và `your_vps_ip` bằng thông tin VPS thực tế.

### 2.2. Cài Đặt Git và Nginx

```bash
# Update hệ thống
sudo apt update

# Cài đặt Git
sudo apt install git -y
git --version

# Cài đặt Nginx
sudo apt install nginx -y
nginx -v

# Khởi động và enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

**Kiểm tra**: Truy cập `http://your_vps_ip` trong trình duyệt, bạn sẽ thấy trang "Welcome to nginx!"

### 2.3. Tạo Thư Mục và Clone Repository

```bash
# Tạo thư mục
sudo mkdir -p /var/www/Mkt_RS10
cd /var/www/Mkt_RS10

# Clone repository từ GitHub (KHÔNG có dấu . để tránh lỗi)
sudo git clone https://github.com/Nguyen15idhue/LandingPageMKT.git

# Di chuyển file từ subfolder ra ngoài
sudo mv /var/www/Mkt_RS10/LandingPageMKT/* /var/www/Mkt_RS10/
sudo mv /var/www/Mkt_RS10/LandingPageMKT/.git /var/www/Mkt_RS10/
sudo rm -rf /var/www/Mkt_RS10/LandingPageMKT

# Kiểm tra file index.html đã có chưa
ls -la /var/www/Mkt_RS10/index.html

# Phân quyền cho Nginx
sudo chown -R www-data:www-data /var/www/Mkt_RS10
sudo chmod -R 755 /var/www/Mkt_RS10
```

---

## BƯỚC 3: Cấu Hình Nginx

### 3.1. Kiểm Tra và Tạo Thư Mục (Nếu Cần)

```bash
# Kiểm tra cấu trúc Nginx
ls -la /etc/nginx/

# Tạo thư mục nếu chưa có
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled
```

### 3.2. Tạo File Cấu Hình (Cách An Toàn)

**Cách 1: Dùng cat (Khuyên dùng)**

```bash
sudo cat > /etc/nginx/sites-available/mkt_rs10 << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    # Thay đổi domain hoặc dùng IP
    server_name geotekmapping3d.com www.geotekmapping3d.com;
    # Nếu chưa có domain, dùng: server_name your_vps_ip;
    
    root /var/www/Mkt_RS10;
    index index.html index.htm;
    
    # Logging
    access_log /var/log/nginx/mkt_rs10_access.log;
    error_log /var/log/nginx/mkt_rs10_error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache cho static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Bảo mật - Ẩn thư mục .git
    location ~ /\.git {
        deny all;
        return 404;
    }
}
EOF
```

**Cách 2: Dùng nano (Nếu Cách 1 không được)**

```bash
sudo nano /etc/nginx/sites-available/mkt_rs10
```

### 3.3. Nội Dung File Cấu Hình (Nếu Dùng Nano)

Paste nội dung sau vào file:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Thay đổi domain hoặc dùng IP
    server_name your_domain.com www.your_domain.com;
    # Nếu chưa có domain, dùng: server_name your_vps_ip;
    
    root /var/www/Mkt_RS10;
    index index.html index.htm;
    
    # Logging
    access_log /var/log/nginx/mkt_rs10_access.log;
    error_log /var/log/nginx/mkt_rs10_error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache cho static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Bảo mật - Ẩn thư mục .git
    location ~ /\.git {
        deny all;
        return 404;
    }
}
```

**Lưu file nano**: `Ctrl + O`, `Enter`, `Ctrl + X`

### 3.4. Kiểm Tra File Đã Tạo

```bash
# Xem nội dung file vừa tạo
cat /etc/nginx/sites-available/mkt_rs10

# Kiểm tra quyền file
ls -la /etc/nginx/sites-available/mkt_rs10
```

### 3.5. Kích Hoạt Cấu Hình

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/mkt_rs10 /etc/nginx/sites-enabled/

# Xóa 6ấu hình mặc định (nếu cần)
sudo rm /etc/nginx/sites-enabled/default

# Kiểm tra cấu hình Nginx
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3.4. Kiểm Tra Trạng Thái Nginx

```bash
sudo systemctl status nginx
```

Nếu có lỗi:
```bash
sudo systemctl restart nginx
```
### 3.7. Kiểm Tra Nhanh

```bash
# Xem tất cả sites được enable
ls -la /etc/nginx/sites-enabled/

# Test truy cập
curl -I http://geotekmapping3d.com
# Hoặc
curl -I http://your_vps_ip
```
---

## BƯỚC 4: Cấu Hình Firewall (Nếu Cần)

```bash
# Cho phép HTTP
sudo ufw allow 'Nginx HTTP'

# Hoặc cho phép port 80
sudo ufw allow 80/tcp

# Kiểm tra firewall
sudo ufw status
```

---

## BƯỚC 5: Kiểm Tra Website

Mở trình duyệt và truy cập:
- `http://your_vps_ip` (nếu dùng IP)
- `http://your_domain.com` (nếu đã trỏ domain)

---

## CẬP NHẬT CODE SAU NÀY

### Cách 1: Cập Nhật Thủ Công

Khi có thay đổi code, làm theo:

**Trên Windows:**
```powershell
cd C:\laragon\www\LandingPageMKT
git add .
git commit -m "Update content"
git push origin main
```

**Trên VPS:**
```bash
cd /var/www/Mkt_RS10
sudo git pull origin main
```

### Cách 2: Tạo Script Tự Động

Tạo file script trên VPS:

```bash
sudo nano /var/www/update_mkt.sh
```

Nội dung:

```bash
#!/bin/bash
echo "🚀 Bắt đầu cập nhật Mkt_RS10..."
cd /var/www/Mkt_RS10
git pull origin main
chown -R www-data:www-data /var/www/Mkt_RS10
chmod -R 755 /var/www/Mkt_RS10
echo "✅ Cập nhật hoàn tất!"
```

Phân quyền:
```bash
sudo chmod +x /var/www/update_mkt.sh
```

Chạy script khi cần update:
```bash
sudo /var/www/update_mkt.sh
```

---

## CÀI ĐẶT SSL/HTTPS (QUAN TRỌNG - KHUYÊN DÙNG)

### Bước 1: Cài Đặt Certbot

```bash
# Cài Certbot và plugin Nginx
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Kiểm tra Certbot đã cài
certbot --version
```

### Bước 2: Lấy SSL Certificate

**Quan trọng**: Domain phải trỏ về IP VPS trước khi chạy lệnh này!

```bash
# Lấy SSL certificate cho domain
sudo certbot --nginx -d geotekmapping3d.com -d www.geotekmapping3d.com
```

**Trong quá trình cài đặt:**
1. Nhập email của bạn (để nhận thông báo gia hạn)
2. Đồng ý Terms of Service: `Y`
3. Có muốn nhận email marketing không: `N` (tùy chọn)
4. Chọn redirect HTTP sang HTTPS: `2` (Khuyên dùng)

### Bước 3: Kiểm Tra SSL

```bash
# Xem danh sách certificate
sudo certbot certificates

# Test gia hạn tự động
sudo certbot renew --dry-run
```

### Bước 4: Truy Cập Website

Mở trình duyệt: **https://geotekmapping3d.com**

Bạn sẽ thấy:
- 🔒 Biểu tượng ổ khóa xanh
- Certificate hợp lệ
- Kết nối được mã hóa

### Cấu Hình Nginx Sau Khi Cài SSL

Certbot sẽ tự động sửa file `/etc/nginx/sites-available/mkt_rs10` thành:

```nginx
server {
    listen 80;
    server_name geotekmapping3d.com www.geotekmapping3d.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name geotekmapping3d.com www.geotekmapping3d.com;
    
    ssl_certificate /etc/letsencrypt/live/geotekmapping3d.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/geotekmapping3d.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    root /var/www/Mkt_RS10;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location ~ /\.git {
        deny all;
        return 404;
    }
}
```

### Gia Hạn Tự Động

SSL sẽ **tự động gia hạn** mỗi 60 ngày. Certbot đã tạo cronjob/systemd timer.

Kiểm tra:
```bash
# Xem timer systemd
sudo systemctl list-timers | grep certbot

# Hoặc xem cronjob
sudo cat /etc/cron.d/certbot
```

### Gia Hạn Thủ Công (Nếu Cần)

```bash
# Gia hạn tất cả certificate
sudo certbot renew

# Gia hạn và reload Nginx
sudo certbot renew --nginx
```

### Mở Firewall Cho HTTPS

```bash
# Cho phép HTTPS (port 443)
sudo ufw allow 443/tcp

# Hoặc dùng preset
sudo ufw allow 'Nginx Full'

# Kiểm tra
sudo ufw status
```

---

## XỬ LÝ SỰ CỐ

### Lỗi 403 Forbidden

**Nguyên nhân**: File index.html không có hoặc sai quyền truy cập

```bash
# Kiểm tra file index.html có tồn tại không
ls -la /var/www/Mkt_RS10/index.html

# Nếu không có, kiểm tra có subfolder không
ls -la /var/www/Mkt_RS10/

# Di chuyển file nếu ở trong subfolder LandingPageMKT
sudo mv /var/www/Mkt_RS10/LandingPageMKT/* /var/www/Mkt_RS10/
sudo mv /var/www/Mkt_RS10/LandingPageMKT/.git /var/www/Mkt_RS10/
sudo rm -rf /var/www/Mkt_RS10/LandingPageMKT

# Phân quyền lại
sudo chown -R www-data:www-data /var/www/Mkt_RS10
sudo chmod -R 755 /var/www/Mkt_RS10
sudo chmod 644 /var/www/Mkt_RS10/index.html

# Reload Nginx
sudo systemctl reload nginx
```

### Website không hiển thị

```bash
# Kiểm tra Nginx
sudo nginx -t
sudo systemctl status nginx

# Kiểm tra quyền file
ls -la /var/www/Mkt_RS10

# Xem log lỗi
sudo tail -f /var/log/nginx/mkt_rs10_error.log
```

### Lỗi Git Pull

```bash
cd /var/www/Mkt_RS10
sudo git reset --hard origin/main
sudo git pull origin main
```

### Nginx không khởi động

```bash
# Kiểm tra port 80 có bị chiếm
sudo netstat -tulpn | grep :80

# Kiểm tra cú pháp
sudo nginx -t
```

---

## CHECKLIST HOÀN THÀNH

### Cài Đặt Cơ Bản
- [ ] Code đã push lên GitHub
- [ ] SSH vào VPS thành công
- [ ] Git và Nginx đã cài trên VPS
- [ ] Clone repository vào `/var/www/Mkt_RS10`
- [ ] Di chuyển file từ subfolder ra root
- [ ] Phân quyền thư mục đúng (www-data:www-data 755)
- [ ] File cấu hình Nginx đã tạo và kích hoạt
- [ ] Nginx test OK (`nginx -t`)
- [ ] Nginx reload thành công
- [ ] Website hiển thị đúng qua HTTP

### Cài Đặt SSL/HTTPS (Khuyên dùng)
- [ ] Domain đã trỏ về IP VPS
- [ ] Certbot đã cài đặt
- [ ] SSL certificate đã lấy thành công
- [ ] Website truy cập được qua HTTPS
- [ ] HTTP tự động redirect sang HTTPS
- [ ] Firewall đã mở port 443
- [ ] Test gia hạn SSL thành công

---

## THÔNG TIN QUAN TRỌNG

### Cấu Trúc Thư Mục Trên VPS
```
/var/www/Mkt_RS10/
├── index.html
├── assets/
│   ├── docs/
│   ├── icons/
│   └── images/
├── css/
│   └── style.css
└── js/
    └── main.js
```

### Các Lệnh Hữu Ích

```bash
# Xem log truy cập
sudo tail -f /var/log/nginx/mkt_rs10_access.log

# Xem log lỗi
sudo tail -f /var/log/nginx/mkt_rs10_error.log

# Kiểm tra dung lượng
du -sh /var/www/Mkt_RS10

# Backup thư mục
sudo tar -czf mkt_rs10_backup_$(date +%Y%m%d).tar.gz /var/www/Mkt_RS10
```

---

## HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Log Nginx: `/var/log/nginx/mkt_rs10_error.log`
2. Trạng thái Nginx: `sudo systemctl status nginx`
3. Quyền file: `ls -la /var/www/Mkt_RS10`
4. Cấu hình Nginx: `sudo nginx -t`

---

**Chúc bạn deploy thành công! 🚀**
