pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0'  // make sure this matches your Jenkins config
    }

    // Remove incomplete MONGO_URI from global environment
    // We'll set it dynamically with creds below

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
                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true

                        junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
            }
        }

        stage('Unit Testing') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mongo-db-credentials', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                    sh '''
                        export MONGO_URI="mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@supercluster.d83jj.mongodb.net/superData?retryWrites=true&w=majority"
                        echo "Using Mongo URI: $MONGO_URI"
                        npm test
                    '''
                }
                junit allowEmptyResults: true, testResults: 'test-results.xml'
            }
        }
    }
}

