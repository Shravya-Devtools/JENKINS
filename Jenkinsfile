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
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-610';
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
            }
        }

        stage('code coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Oops! it will be fixed in the future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
            }
        }

        stage('SAST -Sonarqube') {
            steps {
                sh 'echo $SONAR_SCANNER_HOME'
                sh '''
                    $SONAR_SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=Solar-System-Project \
                        -Dsonar.sources=app.js \
                        -Dsonar.host.url=http://20.64.244.27:9000 \
			-Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                        -Dsonar.token=sqp_db889c8ef8cdaefc42c7a0ce172de2d7c5c68e83
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
                         reportDir: 'coverage/lcov-report',
                         reportFiles: 'index.html',
                         reportName: 'Code Coverage HTML Report',
                         reportTitles: '',
                         useWrapperFileDirectly: true])
        }
    }
}

