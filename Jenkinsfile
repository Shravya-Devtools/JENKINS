pipeline {
    agent any
    tools {
        nodejs 'nodejs'  // Make sure this is configured in Jenkins global tools
    }
    environment {
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
        // GIT_COMMIT is a default Jenkins env variable for the current commit SHA
    }
    stages {
        /*
        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('Dependency Scanning') {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=critical || true'
                    }
                }
                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan './'
                            --out './'
                            --format 'ALL'
                            --prettyPrint
                        ''', odcInstallation: 'OWASP-depcheck-12'
                    }
                }
            }
        }

        stage('Unit test') {
            options { retry(2) }
            steps {
                withCredentials([usernamePassword(credentialsId: 'mongo-db-credentials', usernameVariable: 'MONGO_USER', passwordVariable: 'MONGO_PASS')]) {
                    sh '''
                        echo "Using Mongo URI: $MONGO_URI"
                        echo "MongoDB Username: $MONGO_USER"
                        echo "MongoDB Password: $MONGO_PASS"
                        npm test
                    '''
                }
            }
        }

        stage('Code Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Coverage step failed, continuing', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
            }
        }

        stage('SAST Sonarqube') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh """
                        echo "Sonar Scanner Path: $SONAR_SCANNER_HOME"
                        $SONAR_SCANNER_HOME/bin/sonar-scanner \
                            -Dsonar.projectKey=Solar-System-Project \
                            -Dsonar.sources=app.js \
                            -Dsonar.host.url=http://20.64.244.27:9000 \
                            -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                            -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }
        */

        stage('Docker Build Image') {
            steps {
                sh "docker build -t shravya2315/solar-system:$GIT_COMMIT ."
            }
        }

        stage('Trivy Security Scanner') {
            steps {
                sh """
                    trivy image shravya2315/solar-system:$GIT_COMMIT \
                        --severity LOW,MEDIUM \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    trivy image shravya2315/solar-system:$GIT_COMMIT \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push shravya2315/solar-system:$GIT_COMMIT
                    """
                }
            }
        }
    }

    /*
    post {
        always {
            script {
                node('') {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Code Coverage HTML Report',
                        useWrapperFileDirectly: true
                    ])
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }
    }
    */
}

