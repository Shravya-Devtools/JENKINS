pipeline {
    agent any

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

