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

        stage('NPM Dependency Scanning') {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
			    --scan \'./\' 
                            --out  \'./\'
                            --format \'ALL\'
                            --prettyPrint''', odcInstallation: 'OWASP-DepCheck-10'
                    }
                }
            }
        }
    }
}
