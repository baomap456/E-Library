pipeline {
    agent any

    environment {
        HARBOR_REGISTRY = credentials('harbor-registry')
        HARBOR_PROJECT = credentials('harbor-project')
        VITE_API_BASE_URL = credentials('vite-api-base-url')
        VITE_WS_BASE_URL = credentials('vite-ws-base-url')
        EC2_HOST = credentials('ec2-host')
        EC2_USER = credentials('ec2-user')
        EC2_DEPLOY_PATH = credentials('ec2-deploy-path')
        FRONTEND_PUBLISHED_PORT = credentials('frontend-published-port')
        BACKEND_PUBLISHED_PORT = credentials('backend-published-port')
        DB_PUBLISHED_PORT = credentials('db-published-port')
        MYSQL_ROOT_PASSWORD = credentials('mysql-root-password')
        MYSQL_DATABASE = credentials('mysql-database')
        MYSQL_USER = credentials('mysql-user')
        MYSQL_PASSWORD = credentials('mysql-password')
        DB_APP_USERNAME = credentials('db-app-username')
        DB_APP_PASSWORD = credentials('db-app-password')
        SPRING_JPA_HIBERNATE_DDL_AUTO = credentials('spring-jpa-hibernate-ddl-auto')
        SPRING_FLYWAY_ENABLED = credentials('spring-flyway-enabled')
        SPRING_MAIL_HOST = credentials('spring-mail-host')
        SPRING_MAIL_PORT = credentials('spring-mail-port')
        SPRING_MAIL_USERNAME = credentials('spring-mail-username')
        SPRING_MAIL_PASSWORD = credentials('spring-mail-password')
        SPRING_MAIL_SMTP_AUTH = credentials('spring-mail-smtp-auth')
        SPRING_MAIL_SMTP_STARTTLS_ENABLE = credentials('spring-mail-smtp-starttls-enable')
        SPRING_MAIL_SMTP_STARTTLS_REQUIRED = credentials('spring-mail-smtp-starttls-required')
        APP_NOTIFICATION_EMAIL_ENABLED = credentials('app-notification-email-enabled')
        APP_NOTIFICATION_FRONTEND_BASE_URL = credentials('app-notification-frontend-base-url')
        APP_JWT_SECRET_KEY = credentials('app-jwt-secret-key')
        APP_JWT_EXPIRATION_MS = credentials('app-jwt-expiration-ms')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Variables') {
            steps {
                script {
                    env.BACKEND_IMAGE = "${env.HARBOR_REGISTRY}/${env.HARBOR_PROJECT}/backend:${env.BUILD_NUMBER}"
                    env.FRONTEND_IMAGE = "${env.HARBOR_REGISTRY}/${env.HARBOR_PROJECT}/frontend:${env.BUILD_NUMBER}"
                    env.BACKEND_LATEST = "${env.HARBOR_REGISTRY}/${env.HARBOR_PROJECT}/backend:latest"
                    env.FRONTEND_LATEST = "${env.HARBOR_REGISTRY}/${env.HARBOR_PROJECT}/frontend:latest"
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build(env.BACKEND_IMAGE, '-f demo/Dockerfile demo')
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build(
                        env.FRONTEND_IMAGE,
                        "--build-arg VITE_API_BASE_URL=${env.VITE_API_BASE_URL} --build-arg VITE_WS_BASE_URL=${env.VITE_WS_BASE_URL} -f frontend/Dockerfile frontend"
                    )
                }
            }
        }

        stage('Push Images To Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'HARBOR_USERNAME', passwordVariable: 'HARBOR_PASSWORD')]) {
                    script {
                        if (isUnix()) {
                            sh '''
                                echo "$HARBOR_PASSWORD" | docker login "$HARBOR_REGISTRY" -u "$HARBOR_USERNAME" --password-stdin
                                docker push "$BACKEND_IMAGE"
                                docker tag "$BACKEND_IMAGE" "$BACKEND_LATEST"
                                docker push "$BACKEND_LATEST"
                                docker push "$FRONTEND_IMAGE"
                                docker tag "$FRONTEND_IMAGE" "$FRONTEND_LATEST"
                                docker push "$FRONTEND_LATEST"
                            '''
                        } else {
                            powershell '''
                                $env:HARBOR_PASSWORD | docker login $env:HARBOR_REGISTRY --username $env:HARBOR_USERNAME --password-stdin
                                docker push $env:BACKEND_IMAGE
                                docker tag $env:BACKEND_IMAGE $env:BACKEND_LATEST
                                docker push $env:BACKEND_LATEST
                                docker push $env:FRONTEND_IMAGE
                                docker tag $env:FRONTEND_IMAGE $env:FRONTEND_LATEST
                                docker push $env:FRONTEND_LATEST
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'HARBOR_USERNAME', passwordVariable: 'HARBOR_PASSWORD'),
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'EC2_SSH_KEY')
                ]) {
                    script {
                        if (isUnix()) {
                            sh '''
                                cat <<EOF > .env.prod
BACKEND_IMAGE=$BACKEND_IMAGE
FRONTEND_IMAGE=$FRONTEND_IMAGE
FRONTEND_PUBLISHED_PORT=$FRONTEND_PUBLISHED_PORT
BACKEND_PUBLISHED_PORT=$BACKEND_PUBLISHED_PORT
DB_PUBLISHED_PORT=$DB_PUBLISHED_PORT
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
DB_APP_USERNAME=$DB_APP_USERNAME
DB_APP_PASSWORD=$DB_APP_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO=$SPRING_JPA_HIBERNATE_DDL_AUTO
SPRING_FLYWAY_ENABLED=$SPRING_FLYWAY_ENABLED
SPRING_MAIL_HOST=$SPRING_MAIL_HOST
SPRING_MAIL_PORT=$SPRING_MAIL_PORT
SPRING_MAIL_USERNAME=$SPRING_MAIL_USERNAME
SPRING_MAIL_PASSWORD=$SPRING_MAIL_PASSWORD
SPRING_MAIL_SMTP_AUTH=$SPRING_MAIL_SMTP_AUTH
SPRING_MAIL_SMTP_STARTTLS_ENABLE=$SPRING_MAIL_SMTP_STARTTLS_ENABLE
SPRING_MAIL_SMTP_STARTTLS_REQUIRED=$SPRING_MAIL_SMTP_STARTTLS_REQUIRED
APP_NOTIFICATION_EMAIL_ENABLED=$APP_NOTIFICATION_EMAIL_ENABLED
APP_NOTIFICATION_FRONTEND_BASE_URL=$APP_NOTIFICATION_FRONTEND_BASE_URL
APP_JWT_SECRET_KEY=$APP_JWT_SECRET_KEY
APP_JWT_EXPIRATION_MS=$APP_JWT_EXPIRATION_MS
EOF

                                ssh -i "$EC2_SSH_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "mkdir -p $EC2_DEPLOY_PATH"
                                scp -i "$EC2_SSH_KEY" -o StrictHostKeyChecking=no docker-compose.prod.yml "$EC2_USER@$EC2_HOST:$EC2_DEPLOY_PATH/docker-compose.prod.yml"
                                scp -i "$EC2_SSH_KEY" -o StrictHostKeyChecking=no .env.prod "$EC2_USER@$EC2_HOST:$EC2_DEPLOY_PATH/.env.prod"
                                ssh -i "$EC2_SSH_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "docker login $HARBOR_REGISTRY -u $HARBOR_USERNAME -p $HARBOR_PASSWORD && cd $EC2_DEPLOY_PATH && docker compose --env-file .env.prod -f docker-compose.prod.yml pull && docker compose --env-file .env.prod -f docker-compose.prod.yml up -d"
                            '''
                        } else {
                            powershell '''
                                @"
BACKEND_IMAGE=$env:BACKEND_IMAGE
FRONTEND_IMAGE=$env:FRONTEND_IMAGE
FRONTEND_PUBLISHED_PORT=$env:FRONTEND_PUBLISHED_PORT
BACKEND_PUBLISHED_PORT=$env:BACKEND_PUBLISHED_PORT
DB_PUBLISHED_PORT=$env:DB_PUBLISHED_PORT
MYSQL_ROOT_PASSWORD=$env:MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$env:MYSQL_DATABASE
MYSQL_USER=$env:MYSQL_USER
MYSQL_PASSWORD=$env:MYSQL_PASSWORD
DB_APP_USERNAME=$env:DB_APP_USERNAME
DB_APP_PASSWORD=$env:DB_APP_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO=$env:SPRING_JPA_HIBERNATE_DDL_AUTO
SPRING_FLYWAY_ENABLED=$env:SPRING_FLYWAY_ENABLED
SPRING_MAIL_HOST=$env:SPRING_MAIL_HOST
SPRING_MAIL_PORT=$env:SPRING_MAIL_PORT
SPRING_MAIL_USERNAME=$env:SPRING_MAIL_USERNAME
SPRING_MAIL_PASSWORD=$env:SPRING_MAIL_PASSWORD
SPRING_MAIL_SMTP_AUTH=$env:SPRING_MAIL_SMTP_AUTH
SPRING_MAIL_SMTP_STARTTLS_ENABLE=$env:SPRING_MAIL_SMTP_STARTTLS_ENABLE
SPRING_MAIL_SMTP_STARTTLS_REQUIRED=$env:SPRING_MAIL_SMTP_STARTTLS_REQUIRED
APP_NOTIFICATION_EMAIL_ENABLED=$env:APP_NOTIFICATION_EMAIL_ENABLED
APP_NOTIFICATION_FRONTEND_BASE_URL=$env:APP_NOTIFICATION_FRONTEND_BASE_URL
APP_JWT_SECRET_KEY=$env:APP_JWT_SECRET_KEY
APP_JWT_EXPIRATION_MS=$env:APP_JWT_EXPIRATION_MS
"@ | Set-Content -Path .env.prod

                                ssh -i $env:EC2_SSH_KEY -o StrictHostKeyChecking=no $env:EC2_USER@$env:EC2_HOST "mkdir -p $env:EC2_DEPLOY_PATH"
                                scp -i $env:EC2_SSH_KEY -o StrictHostKeyChecking=no docker-compose.prod.yml $env:EC2_USER@$env:EC2_HOST:$env:EC2_DEPLOY_PATH/docker-compose.prod.yml
                                scp -i $env:EC2_SSH_KEY -o StrictHostKeyChecking=no .env.prod $env:EC2_USER@$env:EC2_HOST:$env:EC2_DEPLOY_PATH/.env.prod
                                ssh -i $env:EC2_SSH_KEY -o StrictHostKeyChecking=no $env:EC2_USER@$env:EC2_HOST "docker login $env:HARBOR_REGISTRY -u $env:HARBOR_USERNAME -p $env:HARBOR_PASSWORD && cd $env:EC2_DEPLOY_PATH && docker compose --env-file .env.prod -f docker-compose.prod.yml pull && docker compose --env-file .env.prod -f docker-compose.prod.yml up -d"
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'rm -f .env.prod'
                } else {
                    powershell 'if (Test-Path .env.prod) { Remove-Item .env.prod -Force }'
                }
            }
        }
    }
}
