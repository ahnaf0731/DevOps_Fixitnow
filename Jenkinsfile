pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'ahnaf4920'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/devops_fixitnow:backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/devops_fixitnow:frontend"
        BACKEND_IMAGE_LATEST = "${BACKEND_IMAGE}-latest"
        FRONTEND_IMAGE_LATEST = "${FRONTEND_IMAGE}-latest"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                dir('backend') {
                    script {
                        sh 'docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} .'
                        sh 'docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest'
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                dir('fixitnow') {
                    script {
                        sh 'docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} .'
                        sh 'docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest'
                    }
                }
            }
        }
        
        stage('Test Images') {
            steps {
                echo 'Running basic image tests...'
                script {
                    // Verify images were created
                    sh 'docker images | grep devops_fixitnow'
                    
                    // Test backend image
                    sh '''
                        docker run --rm ${BACKEND_IMAGE}:${BUILD_NUMBER} java -version
                    '''
                    
                    // Test frontend image (check nginx)
                    sh '''
                        docker run --rm ${FRONTEND_IMAGE}:${BUILD_NUMBER} nginx -v
                    '''
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                echo 'Logging into DockerHub...'
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
                
                echo 'Pushing Backend Image...'
                sh 'docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}'
                sh 'docker push ${BACKEND_IMAGE}:latest'
                
                echo 'Pushing Frontend Image...'
                sh 'docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                sh 'docker push ${FRONTEND_IMAGE}:latest'
            }
        }
        
        stage('Clean Up') {
            steps {
                echo 'Cleaning up old images...'
                script {
                    // Remove old images to save space
                    sh '''
                        docker image prune -f
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Logging out from DockerHub...'
            sh 'docker logout'
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Backend Image: ${BACKEND_IMAGE}:${BUILD_NUMBER}"
            echo "Frontend Image: ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
        }
        
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
