pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0' // Ensure this matches the name in Jenkins global tool config
    }

    stages {
        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
    }
}

