# E-Library Jenkins CI/CD Guide

## Muc tieu

Tai lieu nay huong dan quy trinh deploy project `E-Library` theo mo hinh:

1. Push code len GitLab de luu tru source
2. Jenkins pull code tu GitLab
3. Jenkins build 2 Docker image:
   - `frontend`
   - `backend`
4. Jenkins push 2 image len Harbor
5. Jenkins SSH vao EC2
6. EC2 pull image moi tu Harbor
7. EC2 chay `docker compose up -d`

GitLab trong flow nay chi dong vai tro source repository. Toan bo CI/CD duoc xu ly boi Jenkins.

## Cac file lien quan

- [`Jenkinsfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/Jenkinsfile)
- [`docker-compose.prod.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/docker-compose.prod.yml)
- [`.env.prod.example`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.env.prod.example)
- [`frontend/Dockerfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/frontend/Dockerfile)
- [`demo/Dockerfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/demo/Dockerfile)

## Kien truc deploy

Production gom 3 service:

- `frontend`: image build tu thu muc `frontend`
- `backend`: image build tu thu muc `demo`
- `db`: MySQL container

Tren EC2, he thong duoc chay bang `docker-compose.prod.yml`.

## Luong chay tong quat

### 1. Push code len GitLab

Ban push code len branch ma Jenkins dang theo doi, thuong la `main`.

### 2. Jenkins checkout source

Jenkins lay source tu GitLab thong qua webhook hoac poll SCM.

### 3. Jenkins build Docker image

Jenkins se:

- build image backend tu `demo/Dockerfile`
- build image frontend tu `frontend/Dockerfile`
- gan tag theo `BUILD_NUMBER`
- push them tag `latest`

### 4. Jenkins push image len Harbor

Hai image se duoc push len Harbor:

- `harbor/.../backend:<build-number>`
- `harbor/.../frontend:<build-number>`
- `harbor/.../backend:latest`
- `harbor/.../frontend:latest`

### 5. Jenkins deploy len EC2

Jenkins se:

- tao file `.env.prod` tam thoi
- copy `docker-compose.prod.yml` len EC2
- copy `.env.prod` len EC2
- login Harbor tren EC2
- chay `docker compose pull`
- chay `docker compose up -d`

## Jenkins can gi tren may build

May Jenkins agent can co:

- Git
- Docker
- quyen chay Docker
- `ssh`, `scp`

Neu Jenkins chay tren Windows, can co:

- Docker Desktop hoac Docker Engine
- OpenSSH client

## Phan viec can lam tay 1 lan tren EC2

### 1. Cai Docker va Docker Compose

Vi du tren Ubuntu:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Sau do dang xuat va dang nhap lai, hoac chay:

```bash
newgrp docker
```

Kiem tra:

```bash
docker --version
docker compose version
```

### 2. Tao thu muc deploy

Vi du:

```bash
mkdir -p ~/elibrary
```

Thu muc nay se la noi Jenkins copy:

- `docker-compose.prod.yml`
- `.env.prod`

### 3. Mo security group

Can mo cac cong can thiet:

- `80` cho frontend
- `8080` cho backend neu can test truc tiep
- `22` cho SSH
- `3307` chi mo neu ban that su muon truy cap MySQL tu ngoai

Khuyen nghi:

- mo `80` va `22`
- han che mo `3307`

## Jenkins credentials nen tao

Trong Jenkins, vao `Manage Jenkins -> Credentials` va tao cac credential sau.

### Bat buoc

- `harbor-credentials`
  - loai: Username with password
  - dung de login Harbor

- `ec2-ssh-key`
  - loai: SSH Username with private key
  - dung de SSH va SCP sang EC2

### Dung dang Secret text

- `harbor-registry`
- `harbor-project`
- `vite-api-base-url`
- `vite-ws-base-url`
- `ec2-host`
- `ec2-user`
- `ec2-deploy-path`
- `frontend-published-port`
- `backend-published-port`
- `db-published-port`
- `mysql-root-password`
- `mysql-database`
- `mysql-user`
- `mysql-password`
- `db-app-username`
- `db-app-password`
- `spring-jpa-hibernate-ddl-auto`
- `spring-flyway-enabled`
- `spring-mail-host`
- `spring-mail-port`
- `spring-mail-username`
- `spring-mail-password`
- `spring-mail-smtp-auth`
- `spring-mail-smtp-starttls-enable`
- `spring-mail-smtp-starttls-required`
- `app-notification-email-enabled`
- `app-notification-frontend-base-url`
- `app-jwt-secret-key`
- `app-jwt-expiration-ms`

## Gia tri goi y cho Jenkins credentials

### Harbor

```text
harbor-registry=harbor.example.com
harbor-project=elibrary
```

### Frontend build

```text
vite-api-base-url=http://YOUR_EC2_PUBLIC_IP:8080
vite-ws-base-url=http://YOUR_EC2_PUBLIC_IP:8080
```

Neu co domain:

```text
vite-api-base-url=https://api.your-domain.com
vite-ws-base-url=https://api.your-domain.com
```

### EC2 deploy

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

## Cach tao Jenkins pipeline

### 1. Tao job moi

Trong Jenkins:

1. Chon `New Item`
2. Dat ten, vi du `e-library-deploy`
3. Chon `Pipeline`
4. Bam `OK`

### 2. Cau hinh SCM

Trong phan pipeline:

- chon `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: URL repo GitLab cua ban
- Credentials: chon credential de Jenkins pull source tu GitLab
- Branch: `*/main`
- Script Path: `Jenkinsfile`

### 3. Neu dung webhook GitLab

Trong GitLab:

1. vao `Settings -> Webhooks`
2. them URL webhook cua Jenkins
3. bat su kien `Push events`

Neu chua dung webhook, ban co the dung `Poll SCM` tam thoi.

## File compose production dung de lam gi

File [`docker-compose.prod.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/docker-compose.prod.yml) la file ma EC2 dung de chay service.

No duoc thiet ke cho deploy:

- dung `image:` thay vi `build:`
- nhan gia tri tu `.env.prod`
- phu hop voi flow pull image tu Harbor

EC2 khong can build source.

## Cac buoc test tay truoc khi noi vao Jenkins

Neu muon test deploy tay truoc, lam theo cac buoc sau.

### 1. SSH vao EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 2. Tao thu muc deploy

```bash
mkdir -p ~/elibrary
cd ~/elibrary
```

### 3. Copy file compose production

```bash
nano docker-compose.prod.yml
```

Dan noi dung file `docker-compose.prod.yml` vao.

### 4. Tao file `.env.prod`

```bash
nano .env.prod
```

Co the bat dau tu [`.env.prod.example`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.env.prod.example), sau do thay thanh gia tri that.

### 5. Login Harbor

```bash
docker login harbor.example.com
```

### 6. Pull va chay compose

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

### 7. Kiem tra

```bash
docker ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f
```

## Lenh Jenkins dang thuc hien ve y tuong

Jenkins dang thuc hien logic tuong duong:

```bash
docker build -t <backend-image> -f demo/Dockerfile demo
docker build --build-arg VITE_API_BASE_URL=<api-url> --build-arg VITE_WS_BASE_URL=<ws-url> -t <frontend-image> -f frontend/Dockerfile frontend
docker login <harbor>
docker push <backend-image>
docker push <frontend-image>
scp docker-compose.prod.yml <ec2>
scp .env.prod <ec2>
ssh <ec2> "docker compose pull && docker compose up -d"
```

## Vi sao frontend khong nen hardcode localhost

Frontend production duoc mo trong browser cua nguoi dung. Neu hardcode `http://localhost:8080`, browser se goi ve may nguoi dung thay vi EC2.

Vi vay frontend da duoc doi sang doc:

- `VITE_API_BASE_URL`
- `VITE_WS_BASE_URL`

Hai bien nay duoc truyen vao luc Jenkins build image frontend.

## Loi thuong gap

### 1. Jenkins build duoc nhung push Harbor that bai

Kiem tra:

- `harbor-credentials`
- `harbor-registry`
- `harbor-project`

### 2. Jenkins push xong nhung deploy EC2 that bai

Kiem tra:

- `ec2-ssh-key`
- `ec2-host`
- `ec2-user`
- `ec2-deploy-path`
- EC2 da cai Docker chua

### 3. Frontend vao duoc nhung goi API that bai

Kiem tra:

- `vite-api-base-url`
- `vite-ws-base-url`
- security group AWS
- backend co mo cong `8080` khong

### 4. Backend len nhung khong ket noi duoc MySQL

Kiem tra:

- `mysql-root-password`
- `db-app-username`
- `db-app-password`
- log service `db`
- log service `backend`

## Kiem tra nhanh sau deploy

1. Frontend:

```text
http://YOUR_EC2_PUBLIC_IP
```

2. Backend:

```text
http://YOUR_EC2_PUBLIC_IP:8080/swagger-ui/index.html
```

3. Logs:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f db
```

## Tom tat ngan

Flow moi cua ban la:

1. Push code len GitLab
2. GitLab luu source
3. Jenkins build frontend/backend
4. Jenkins push image len Harbor
5. Jenkins SSH vao EC2
6. EC2 pull image va chay `docker compose`

Mo hinh nay phu hop hon neu ban muon GitLab chi de luu tru source code.
