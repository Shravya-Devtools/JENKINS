pipeline {
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        MONGO_DB_CREDENTIALS = credentials('mongo-db-credentials')
        MONGO_USERNAME = credentials('mongo-db-username')
        MONGO_PASSWORD = credentials('mongo-db-password')
    }
    stages {
        stage('Installing Dependencies') {
            options { timestamps() }
	    steps {
                sh 'npm install --no-audit'
            }
        }
 
        stage('Dependency Scanning') {
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
                            --scan './'
                            --out './'
                            --format 'ALL'
                            --prettyPrint
                        ''', odcInstallation: 'OWASP-DepCheck-10'
                    }
                }
            }
        }
 
        stage('Unit test') {
            options { retry(2) }
            steps {
                sh 'echo colon separated creds: $MONGO_DB_CREDS'
                sh 'echo Mongodb-username: $MONGO_DB_CREDS_USR'
                sh 'echo Mongodb-password: $MONGO_DB_CREDS_PSW'
                sh 'npm test'
                junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'
            }
        }
	    stage('code coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Oops! it will be fixed in the future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
                //publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
                            // reportDir: 'coverage/lcov-report',
                           //  reportFiles: 'index.html',
                           //  reportName: 'Code Coverage HTML Report',
                           //  reportTitles: '',
                            // useWrapperFileDirectly: true])
            }
        }
    }
}
    

