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

### 2.2. Cài Đặt Git (Nếu Chưa Có)

```bash
sudo apt update
sudo apt install git -y
git --version
```

### 2.3. Tạo Thư Mục và Clone Repository

```bash
# Tạo thư mục
sudo mkdir -p /var/www/Mkt_RS10
cd /var/www/Mkt_RS10

# Clone repository từ GitHub
sudo git clone https://github.com/Nguyen15idhue/LandingPageMKT.git .

# Phân quyền cho Nginx
sudo chown -R www-data:www-data /var/www/Mkt_RS10
sudo chmod -R 755 /var/www/Mkt_RS10
```

**Lưu ý**: Dấu `.` ở cuối lệnh `git clone` để clone nội dung vào thư mục hiện tại.

---

## BƯỚC 3: Cấu Hình Nginx

### 3.1. Tạo File Cấu Hình

```bash
sudo nano /etc/nginx/sites-available/mkt_rs10
```

### 3.2. Nội Dung File Cấu Hình

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

**Lưu file**: `Ctrl + O`, `Enter`, `Ctrl + X`

### 3.3. Kích Hoạt Cấu Hình

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/mkt_rs10 /etc/nginx/sites-enabled/

# Xóa cấu hình mặc định (nếu cần)
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

## CÀI ĐẶT SSL/HTTPS (TÙY CHỌN)

Nếu có domain, nên cài SSL miễn phí với Let's Encrypt:

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx -y

# Lấy SSL certificate
sudo certbot --nginx -d your_domain.com -d www.your_domain.com

# Certbot sẽ tự động cấu hình Nginx và chuyển HTTP sang HTTPS
```

SSL sẽ tự động gia hạn. Kiểm tra:
```bash
sudo certbot renew --dry-run
```

---

## XỬ LÝ SỰ CỐ

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

- [ ] Code đã push lên GitHub
- [ ] SSH vào VPS thành công
- [ ] Git đã cài trên VPS
- [ ] Clone repository vào `/var/www/Mkt_RS10`
- [ ] Phân quyền thư mục đúng
- [ ] File cấu hình Nginx đã tạo
- [ ] Nginx reload thành công
- [ ] Website hiển thị đúng khi truy cập
- [ ] (Tùy chọn) SSL đã cài đặt

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
