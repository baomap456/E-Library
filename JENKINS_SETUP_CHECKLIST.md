# Jenkins Setup Checklist

## Muc tieu

Tai lieu nay la checklist ngan de cau hinh Jenkins cho project `E-Library`.

Sau khi hoan thanh cac buoc duoi day, Jenkins se co the:

1. pull code tu GitLab
2. build image `backend` va `frontend`
3. push image len Harbor
4. SSH vao EC2
5. deploy bang `docker compose`

## 1. Chuan bi may Jenkins

Jenkins agent can co:

- Git
- Docker
- quyen chay Docker
- OpenSSH client

Neu Jenkins chay tren Windows, kiem tra:

```powershell
git --version
docker --version
ssh -V
scp
```

Neu `scp` chua co, cai OpenSSH Client trong Windows Features.

## 2. Cai plugin can thiet trong Jenkins

Vao `Manage Jenkins -> Plugins` va dam bao da co:

- `Pipeline`
- `Git`
- `Credentials`
- `Credentials Binding`
- `SSH Agent` hoac plugin ho tro SSH credentials
- `Docker Pipeline`

## 3. Tao credentials trong Jenkins

Vao `Manage Jenkins -> Credentials` va tao cac credential sau.

## 4. Tao credential Harbor

ID:

```text
harbor-credentials
```

Loai:

```text
Username with password
```

Gia tri:

- Username: tai khoan Harbor
- Password: mat khau Harbor

## 5. Tao credential SSH cho EC2

ID:

```text
ec2-ssh-key
```

Loai:

```text
SSH Username with private key
```

Gia tri:

- Username: user dang nhap EC2, vi du `ubuntu`
- Private Key: private key cua EC2

## 6. Tao cac Secret text credentials

Tao tung credential voi loai:

```text
Secret text
```

Va dung dung cac ID sau:

```text
harbor-registry
harbor-project
vite-api-base-url
vite-ws-base-url
ec2-host
ec2-user
ec2-deploy-path
frontend-published-port
backend-published-port
db-published-port
mysql-root-password
mysql-database
mysql-user
mysql-password
db-app-username
db-app-password
spring-jpa-hibernate-ddl-auto
spring-flyway-enabled
spring-mail-host
spring-mail-port
spring-mail-username
spring-mail-password
spring-mail-smtp-auth
spring-mail-smtp-starttls-enable
spring-mail-smtp-starttls-required
app-notification-email-enabled
app-notification-frontend-base-url
app-jwt-secret-key
app-jwt-expiration-ms
```

## 7. Gia tri mau cho credentials

### Harbor

```text
harbor-registry=harbor.example.com
harbor-project=elibrary
```

### Frontend

```text
vite-api-base-url=http://YOUR_EC2_PUBLIC_IP:8080
vite-ws-base-url=http://YOUR_EC2_PUBLIC_IP:8080
```

### EC2

```text
ec2-host=3.25.100.10
ec2-user=ubuntu
ec2-deploy-path=/home/ubuntu/elibrary
frontend-published-port=80
backend-published-port=8080
db-published-port=3307
```

### Database

```text
mysql-root-password=super_secret_root
mysql-database=elibrary
mysql-user=elibrary
mysql-password=super_secret_app
db-app-username=root
db-app-password=super_secret_root
```

### Backend app

```text
spring-jpa-hibernate-ddl-auto=update
spring-flyway-enabled=false
spring-mail-host=sandbox.smtp.mailtrap.io
spring-mail-port=2525
spring-mail-username=your_mail_user
spring-mail-password=your_mail_password
spring-mail-smtp-auth=true
spring-mail-smtp-starttls-enable=true
spring-mail-smtp-starttls-required=true
app-notification-email-enabled=true
app-notification-frontend-base-url=http://YOUR_EC2_PUBLIC_IP
app-jwt-secret-key=your_base64_secret
app-jwt-expiration-ms=86400000
```

## 7.1 Bang mapping credential

Bang duoi day giup ban doi chieu nhanh:

- `Credential ID`
- vi du gia tri
- stage nao trong Jenkins dang dung no

| Credential ID | Vi du gia tri | Loai | Dung o stage |
|---|---|---|---|
| `harbor-credentials` | username=`admin`, password=`your_password` | Username with password | `Push Images To Harbor`, `Deploy To EC2` |
| `ec2-ssh-key` | private key cua EC2, username=`ubuntu` | SSH Username with private key | `Deploy To EC2` |
| `harbor-registry` | `harbor.example.com` | Secret text | `Prepare Variables`, `Push Images To Harbor`, `Deploy To EC2` |
| `harbor-project` | `elibrary` | Secret text | `Prepare Variables` |
| `vite-api-base-url` | `http://YOUR_EC2_PUBLIC_IP:8080` | Secret text | `Build Frontend Image` |
| `vite-ws-base-url` | `http://YOUR_EC2_PUBLIC_IP:8080` | Secret text | `Build Frontend Image` |
| `ec2-host` | `3.25.100.10` | Secret text | `Deploy To EC2` |
| `ec2-user` | `ubuntu` | Secret text | `Deploy To EC2` |
| `ec2-deploy-path` | `/home/ubuntu/elibrary` | Secret text | `Deploy To EC2` |
| `frontend-published-port` | `80` | Secret text | `Deploy To EC2` |
| `backend-published-port` | `8080` | Secret text | `Deploy To EC2` |
| `db-published-port` | `3307` | Secret text | `Deploy To EC2` |
| `mysql-root-password` | `super_secret_root` | Secret text | `Deploy To EC2` |
| `mysql-database` | `elibrary` | Secret text | `Deploy To EC2` |
| `mysql-user` | `elibrary` | Secret text | `Deploy To EC2` |
| `mysql-password` | `super_secret_app` | Secret text | `Deploy To EC2` |
| `db-app-username` | `root` | Secret text | `Deploy To EC2` |
| `db-app-password` | `super_secret_root` | Secret text | `Deploy To EC2` |
| `spring-jpa-hibernate-ddl-auto` | `update` | Secret text | `Deploy To EC2` |
| `spring-flyway-enabled` | `false` | Secret text | `Deploy To EC2` |
| `spring-mail-host` | `sandbox.smtp.mailtrap.io` | Secret text | `Deploy To EC2` |
| `spring-mail-port` | `2525` | Secret text | `Deploy To EC2` |
| `spring-mail-username` | `your_mail_user` | Secret text | `Deploy To EC2` |
| `spring-mail-password` | `your_mail_password` | Secret text | `Deploy To EC2` |
| `spring-mail-smtp-auth` | `true` | Secret text | `Deploy To EC2` |
| `spring-mail-smtp-starttls-enable` | `true` | Secret text | `Deploy To EC2` |
| `spring-mail-smtp-starttls-required` | `true` | Secret text | `Deploy To EC2` |
| `app-notification-email-enabled` | `true` | Secret text | `Deploy To EC2` |
| `app-notification-frontend-base-url` | `http://YOUR_EC2_PUBLIC_IP` | Secret text | `Deploy To EC2` |
| `app-jwt-secret-key` | `your_base64_secret` | Secret text | `Deploy To EC2` |
| `app-jwt-expiration-ms` | `86400000` | Secret text | `Deploy To EC2` |

Luu y:

- `harbor-credentials` khac `harbor-registry`
- `harbor-credentials` la tai khoan dang nhap Harbor
- `harbor-registry` la domain registry, vi du `harbor.example.com`
- `ec2-ssh-key` la private key SSH
- `ec2-user` la username dang nhap vao EC2, vi du `ubuntu`

## 8. Tao Jenkins job

1. Vao `New Item`
2. Dat ten, vi du `e-library-deploy`
3. Chon `Pipeline`
4. Bam `OK`

## 9. Cau hinh SCM cho job

Trong job:

- chon `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: repo GitLab cua ban
- Credentials: credential de Jenkins clone repo GitLab
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

## 10. Cau hinh GitLab webhook

Trong GitLab:

1. vao `Settings -> Webhooks`
2. them webhook URL cua Jenkins
3. bat `Push events`

Neu chua muon dung webhook, co the build tay hoac bat `Poll SCM`.

## 11. Chuan bi EC2

EC2 can:

- da cai Docker
- da cai Docker Compose plugin
- tao san thu muc deploy, vi du:

```bash
mkdir -p ~/elibrary
```

Kiem tra tren EC2:

```bash
docker --version
docker compose version
```

## 12. Kiem tra Harbor login tren Jenkins

Truoc khi chay full pipeline, nen test:

- Jenkins co Docker khong
- Jenkins co login Harbor duoc khong

Neu can, tao mot pipeline test nho hoac build tay tren may Jenkins:

```powershell
docker login harbor.example.com
```

## 13. Kiem tra SSH tu Jenkins sang EC2

Tren may Jenkins, test:

```powershell
ssh ubuntu@YOUR_EC2_PUBLIC_IP
```

Neu Jenkins khong vao duoc EC2 thi pipeline deploy se fail.

## 14. Chay build dau tien

Sau khi cau hinh xong:

1. push code len GitLab
2. vao Jenkins
3. bam `Build Now`

## 15. Kiem tra sau khi build

Tren Jenkins:

- xem console output
- dam bao stage build, push, deploy deu xanh

Tren EC2:

```bash
cd ~/elibrary
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f
```

## 16. Loi thuong gap

### Jenkins khong build duoc Docker

Nguyen nhan thuong la Jenkins user khong co quyen dung Docker.

### Jenkins push Harbor that bai

Kiem tra:

- `harbor-credentials`
- `harbor-registry`
- `harbor-project`

### Jenkins SSH sang EC2 that bai

Kiem tra:

- `ec2-ssh-key`
- `ec2-host`
- `ec2-user`
- security group mo cong `22`

### Frontend deploy xong nhung goi API sai

Kiem tra:

- `vite-api-base-url`
- `vite-ws-base-url`

## 17. File can doi chieu

- [`Jenkinsfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/Jenkinsfile)
- [`docker-compose.prod.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/docker-compose.prod.yml)
- [`.env.prod.example`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.env.prod.example)
- [`DEPLOY_PIPELINE_GUIDE.md`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/DEPLOY_PIPELINE_GUIDE.md)

## Tom tat nhanh

Ban chi can nho 5 viec:

1. Jenkins co Docker + SSH
2. Tao dung credentials ID nhu trong `Jenkinsfile`
3. Jenkins clone duoc repo GitLab
4. Jenkins login duoc Harbor
5. Jenkins SSH duoc vao EC2

Dat dung 5 phan nay thi pipeline se chay duoc.
