pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'ahnaf4920'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/devops_fixitnow"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/devops_fixitnow"
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
                        sh 'docker build -t ${BACKEND_IMAGE}:backend-${BUILD_NUMBER} .'
                        sh 'docker tag ${BACKEND_IMAGE}:backend-${BUILD_NUMBER} ${BACKEND_IMAGE}:backend'
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                dir('fixitnow') {
                    script {
                        sh 'docker build -t ${FRONTEND_IMAGE}:frontend-${BUILD_NUMBER} .'
                        sh 'docker tag ${FRONTEND_IMAGE}:frontend-${BUILD_NUMBER} ${FRONTEND_IMAGE}:frontend'
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
                        docker run --rm ${BACKEND_IMAGE}:backend-${BUILD_NUMBER} java -version
                    '''
                    
                    // Test frontend image (check nginx)
                    sh '''
                        docker run --rm ${FRONTEND_IMAGE}:frontend-${BUILD_NUMBER} nginx -v
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
                sh 'docker push ${BACKEND_IMAGE}:backend-${BUILD_NUMBER}'
                sh 'docker push ${BACKEND_IMAGE}:backend'
                
                echo 'Pushing Frontend Image...'
                sh 'docker push ${FRONTEND_IMAGE}:frontend-${BUILD_NUMBER}'
                sh 'docker push ${FRONTEND_IMAGE}:frontend'
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
            echo "Backend Image: ${BACKEND_IMAGE}:backend-${BUILD_NUMBER}"
            echo "Frontend Image: ${FRONTEND_IMAGE}:frontend-${BUILD_NUMBER}"
        }
        
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
