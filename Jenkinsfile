pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0'
    }

    environment {
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-610'
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
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            sh 'npm audit --audit-level=critical || true'
                        }
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan './' \
                            --out './' \
                            --format 'ALL' \
                            --disableYarnAudit \
                            --prettyPrint
                        ''', odcInstallation: 'OWASP-DepCheck-10'
                    }
                }
            }
        }

        stage('Unit Test') {
            options { retry(2) }
            environment {
                MONGO_DB_CREDENTIALS = credentials('mongo-db-credentials')
                MONGO_USERNAME = credentials('mongo-db-username')
                MONGO_PASSWORD = credentials('mongo-db-password')
            }
            steps {
                sh 'echo MONGODB URI: $MONGO_URI'
                sh 'echo MONGODB Username: $MONGO_USERNAME'
                sh 'echo MONGODB Password: $MONGO_PASSWORD'
                sh 'npm test -- --reporter mocha-junit-reporter --reporter-options mochaFile=test-results.xml'
            }
        }

        stage('Code Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Oops! it will be fixed in the future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
            }
        }

        stage('SAST - SonarQube') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    withSonarQubeEnv('sonar-qube-server') {
                        sh 'echo Using Sonar Scanner at: $SONAR_SCANNER_HOME'
                        sh """
                            $SONAR_SCANNER_HOME/bin/sonar-scanner \
                                -Dsonar.projectKey=Solar-System-Project \
                                -Dsonar.sources=. \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.ws.timeout=180 \
                                -Dsonar.verbose=true
                        """
                        // ✅ Now inside timeout block
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'printenv'
                sh 'docker build -t shravya2315/solar-system:$GIT_COMMIT .'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Code Coverage HTML Report',
                useWrapperFileDirectly: true
            ])
        }
    }
}

