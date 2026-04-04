# E-Library CI/CD Pipeline Guide

## Muc tieu

Tai lieu nay huong dan quy trinh deploy cho project `E-Library` theo flow:

1. Push code len GitLab
2. GitLab trigger file `.gitlab-ci.yml`
3. GitLab build 2 Docker image:
   - `frontend`
   - `backend`
4. GitLab push 2 image len Harbor
5. GitLab SSH vao EC2
6. EC2rbor pull image moi tu Ha
7. EC2 chay `docker compose up -d` de cap nhat he thong

Database van duoc chay bang service rieng trong `docker-compose.prod.yml`.

## Kien truc deploy

Production gom 3 service:

- `frontend`: image build tu thu muc `frontend`
- `backend`: image build tu thu muc `demo`
- `db`: MySQL container

Tren EC2, project duoc chay bang file `docker-compose.prod.yml`.

## Cac file lien quan trong repo

- [`.gitlab-ci.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.gitlab-ci.yml)
- [`docker-compose.prod.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/docker-compose.prod.yml)
- [`.env.prod.example`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.env.prod.example)
- [`frontend/Dockerfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/frontend/Dockerfile)
- [`demo/Dockerfile`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/demo/Dockerfile)

## Luong chay tong quat

### 1. Developer push code len GitLab

Ban push code len branch duoc cau hinh deploy, thuong la branch mac dinh nhu `main` hoac `master`.

### 2. GitLab build image

Pipeline se:

- build image backend tu `demo/Dockerfile`
- build image frontend tu `frontend/Dockerfile`
- gan tag theo `CI_COMMIT_SHORT_SHA`
- neu dang o default branch thi push them tag `latest`

### 3. GitLab push image len Harbor

Hai image se duoc push len Harbor:

- `harbor/.../backend:<tag>`
- `harbor/.../frontend:<tag>`

### 4. GitLab SSH vao EC2

Job deploy se:

- tao thu muc deploy tren EC2 neu chua co
- copy `docker-compose.prod.yml` len EC2
- tao file `.env.prod` tren EC2 tu GitLab variables
- login Harbor tren EC2
- chay `docker compose pull`
- chay `docker compose up -d`

## Phan viec can lam tay 1 lan tren EC2

Pipeline khong tu cai Docker cho EC2, vi vay ban can setup may EC2 truoc.

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

Thu muc nay se la noi pipeline copy file `docker-compose.prod.yml` va `.env.prod` vao.

### 3. Mo security group

Can mo cac cong phu hop tren AWS Security Group:

- `80` cho frontend
- `8080` cho backend neu ban muon goi truc tiep backend
- `22` cho SSH
- `3307` chi mo neu ban thuc su can truy cap MySQL tu ben ngoai

Khuyen nghi:

- mo `80` va `22`
- han che mo `3307`
- `8080` co the mo tam de test, sau nay nen cho qua reverse proxy

## Bien moi truong can them trong GitLab

Vao `GitLab Project -> Settings -> CI/CD -> Variables` va them cac bien sau.

### Nhom Harbor

- `HARBOR_REGISTRY`
- `HARBOR_PROJECT`
- `HARBOR_USERNAME`
- `HARBOR_PASSWORD`

Vi du:

```text
HARBOR_REGISTRY=harbor.example.com
HARBOR_PROJECT=elibrary
HARBOR_USERNAME=admin
HARBOR_PASSWORD=your_password
```

### Nhom frontend build

- `VITE_API_BASE_URL`
- `VITE_WS_BASE_URL`

Vi du neu frontend chay tren browser va backend expose cong `8080` tren EC2:

```text
VITE_API_BASE_URL=http://YOUR_EC2_PUBLIC_IP:8080
VITE_WS_BASE_URL=http://YOUR_EC2_PUBLIC_IP:8080
```

Neu ban co domain thi thay bang domain:

```text
VITE_API_BASE_URL=https://api.your-domain.com
VITE_WS_BASE_URL=https://api.your-domain.com
```

### Nhom SSH deploy

- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_PRIVATE_KEY`
- `EC2_DEPLOY_PATH`

Vi du:

```text
EC2_HOST=3.25.100.10
EC2_USER=ubuntu
EC2_DEPLOY_PATH=/home/ubuntu/elibrary
```

`EC2_SSH_PRIVATE_KEY` la private key dung de SSH vao EC2. Dan toan bo noi dung key vao variable nay.

### Nhom database

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `DB_APP_USERNAME`
- `DB_APP_PASSWORD`

Vi du:

```text
MYSQL_ROOT_PASSWORD=super_secret_root
MYSQL_DATABASE=elibrary
MYSQL_USER=elibrary
MYSQL_PASSWORD=super_secret_app
DB_APP_USERNAME=root
DB_APP_PASSWORD=super_secret_root
```

Luu y:

- trong file `docker-compose.prod.yml` hien tai backend dang dung `DB_APP_USERNAME` va `DB_APP_PASSWORD`
- neu backend dung root de ket noi MySQL thi `DB_APP_USERNAME=root`

### Nhom backend app

- `SPRING_MAIL_HOST`
- `SPRING_MAIL_PORT`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `SPRING_MAIL_SMTP_AUTH`
- `SPRING_MAIL_SMTP_STARTTLS_ENABLE`
- `SPRING_MAIL_SMTP_STARTTLS_REQUIRED`
- `APP_NOTIFICATION_EMAIL_ENABLED`
- `APP_NOTIFICATION_FRONTEND_BASE_URL`
- `APP_JWT_SECRET_KEY`
- `APP_JWT_EXPIRATION_MS`

Vi du:

```text
SPRING_MAIL_HOST=sandbox.smtp.mailtrap.io
SPRING_MAIL_PORT=2525
SPRING_MAIL_USERNAME=your_mail_user
SPRING_MAIL_PASSWORD=your_mail_password
SPRING_MAIL_SMTP_AUTH=true
SPRING_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_SMTP_STARTTLS_REQUIRED=true
APP_NOTIFICATION_EMAIL_ENABLED=true
APP_NOTIFICATION_FRONTEND_BASE_URL=http://YOUR_EC2_PUBLIC_IP
APP_JWT_SECRET_KEY=your_base64_secret
APP_JWT_EXPIRATION_MS=86400000
```

### Nhom port tuy chon

- `FRONTEND_PUBLISHED_PORT`
- `BACKEND_PUBLISHED_PORT`
- `DB_PUBLISHED_PORT`

Vi du:

```text
FRONTEND_PUBLISHED_PORT=80
BACKEND_PUBLISHED_PORT=8080
DB_PUBLISHED_PORT=3307
```

## File compose production dung de lam gi

File [`docker-compose.prod.yml`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/docker-compose.prod.yml) la file ma EC2 se dung de chay service.

No khac voi file `docker-compose.yml` local o cho:

- production dung `image:` thay vi `build:`
- gia tri config duoc lay tu `.env.prod`
- phu hop voi flow pull image tu Harbor

Ban khong can build source code tren EC2.

EC2 chi can:

1. pull image da co san
2. chay compose

## Cac buoc deploy tay lan dau de test

Neu ban muon test thu cong truoc khi dua vao pipeline, co the lam theo cac buoc sau.

### 1. SSH vao EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 2. Tao thu muc deploy

```bash
mkdir -p ~/elibrary
cd ~/elibrary
```

### 3. Paste file compose production

Tao file:

```bash
nano docker-compose.prod.yml
```

Dan noi dung file `docker-compose.prod.yml` trong repo vao.

### 4. Tao file `.env.prod`

```bash
nano .env.prod
```

Co the bat dau tu file [`.env.prod.example`](/c:/Users/nguye/OneDrive/Máy tính/E_LB/E-Library/.env.prod.example), sau do thay bang gia tri that.

### 5. Login Harbor

```bash
docker login harbor.example.com
```

### 6. Pull va chay compose

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

### 7. Kiem tra container

```bash
docker ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f
```

## Pipeline dang tu dong hoa nhung gi

Sau khi ban da setup GitLab variables va EC2 xong, moi lan push len branch deploy:

- GitLab tu build image
- GitLab tu push len Harbor
- GitLab tu SSH vao EC2
- GitLab tu cap nhat `docker-compose.prod.yml`
- GitLab tu tao `.env.prod`
- GitLab tu pull image moi
- GitLab tu restart service

Nghia la ve sau ban khong can SSH len EC2 de paste compose moi moi lan deploy.

## Lenh pipeline dang chay tren EC2

Ve mat y tuong, pipeline se chay logic tuong duong:

```bash
docker login <harbor>
cd /path/to/deploy
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

## Khi nao can file `docker-compose.prod.yml` tren EC2

Can. EC2 can file nay de biet:

- service nao can chay
- image nao can pull
- map cong nao
- env nao truyen vao backend
- volume nao dung cho MySQL

Pipeline hien tai se copy file nay len EC2 giup ban.

## Vi sao frontend khong nen hardcode localhost

Khi frontend duoc build thanh static file va mo tren may nguoi dung:

- neu frontend goi `http://localhost:8080`
- browser se hieu `localhost` la may cua nguoi dung, khong phai EC2

Vi vay frontend da duoc doi sang doc:

- `VITE_API_BASE_URL`
- `VITE_WS_BASE_URL`

Hai gia tri nay duoc truyen vao luc GitLab build image frontend.

## Goi y branch strategy

Ban co the dung cach don gian:

- push len branch `main`
- `main` se build va deploy production

Hoac tach ro hon:

- branch `develop`: chi build image
- branch `main`: build + deploy production

Neu muon tach staging va production, co the nang cap `.gitlab-ci.yml` sau.

## Cac loi thuong gap

### 1. Frontend vao duoc nhung goi API that bai

Nguyen nhan thuong la:

- `VITE_API_BASE_URL` dang de sai IP/domain
- backend chua mo cong `8080`
- CORS hoac security group AWS chua mo dung

### 2. Backend len nhung ket noi DB that bai

Kiem tra:

- `MYSQL_ROOT_PASSWORD`
- `DB_APP_USERNAME`
- `DB_APP_PASSWORD`
- MySQL healthcheck
- log container backend

### 3. Pipeline build duoc nhung deploy that bai

Kiem tra:

- `EC2_HOST`, `EC2_USER`, `EC2_DEPLOY_PATH`
- `EC2_SSH_PRIVATE_KEY`
- EC2 co cai Docker chua
- EC2 co login duoc Harbor khong

### 4. Pull image tu Harbor bi fail

Kiem tra:

- Harbor credentials
- project/image name
- tag image
- EC2 co truy cap mang toi Harbor khong

## Kiem tra nhanh sau deploy

Sau khi deploy thanh cong, test theo thu tu:

1. Mo frontend:

```text
http://YOUR_EC2_PUBLIC_IP
```

2. Test backend:

```text
http://YOUR_EC2_PUBLIC_IP:8080/swagger-ui/index.html
```

3. Kiem tra container:

```bash
docker ps
```

4. Kiem tra log:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f db
```

## Khuyen nghi cho production that

Ban co the deploy theo cau hinh hien tai de demo hoac do an. Tuy nhien neu muon on dinh hon:

- dung AWS RDS thay vi MySQL container
- dung Nginx reverse proxy va SSL
- dung domain thay vi IP
- dua secrets vao GitLab masked variables
- backup volume MySQL dinh ky

## Tom tat ngan

Ban dang di dung huong voi mo hinh:

1. Push code len GitLab
2. GitLab build frontend/backend
3. GitLab push image len Harbor
4. GitLab SSH vao EC2
5. EC2 pull image va chay `docker compose`

EC2 van can `docker-compose.prod.yml`, nhung pipeline da duoc viet de copy file do len tu dong cho ban.
