pipeline {
    agent any
    
    tools {
        nodejs 'nodejs-22-6-0'
    }

    stages {
        stage('VM Node Version') {
            steps {
                echo 'Checking Node.js and npm versions on the Jenkins agent...'
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }
}

