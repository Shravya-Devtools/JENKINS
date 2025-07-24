pipeline {
    agent any

    tools {
        nodejs 'nodejs'  // Ensure Node.js is configured in Jenkins global tools
    }

    environment {
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
        // GIT_COMMIT is a default Jenkins env variable for the current commit SHA
    }

    stages {

        // stage('Docker Build Image') {
        //     steps {
        //         sh "docker build -t shravya2315/solar-system:$GIT_COMMIT ."
        //     }
        // }

        // stage('Trivy Security Scanner') {
        //     steps {
        //         sh """
        //             trivy image shravya2315/solar-system:$GIT_COMMIT \
        //                 --severity LOW,MEDIUM \
        //                 --exit-code 0 \
        //                 --quiet \
        //                 --format json -o trivy-image-MEDIUM-results.json

        //             trivy image shravya2315/solar-system:$GIT_COMMIT \
        //                 --severity CRITICAL \
        //                 --exit-code 0 \
        //                 --quiet \
        //                 --format json -o trivy-image-CRITICAL-results.json
        //         """
        //     }
        // }

        stage('Docker Build Image') {
            steps {
                sh "docker build -t shravya2315/solar-system:$GIT_COMMIT ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push shravya2315/solar-system:$GIT_COMMIT
                    """
                }
            }
        }

        stage('Deploy - AWS EC2') {
            when {
                expression { return env.BRANCH_NAME ==~ /feature\/.*/ }
            }
            steps {
                sshagent(['aws-dev-deploy-ec2-instance']) {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'mongo-db-credentials',  // <-- use your existing mongo creds here
                            usernameVariable: 'MONGO_USERNAME',
                            passwordVariable: 'MONGO_PASSWORD'
                        )
                    ]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@3.140.244.8 '
                                if sudo docker ps -a | grep -q "solar-system"; then
                                    echo "Container found. Stopping..."
                                    sudo docker stop solar-system
                                    sudo docker rm solar-system
                                fi
                                echo "Starting new container..."
                                sudo docker run --name solar-system \\
                                    -e MONGO_URI=$MONGO_URI \\
                                    -e MONGO_USERNAME=$MONGO_USERNAME \\
                                    -e MONGO_PASSWORD=$MONGO_PASSWORD \\
                                    -p 3000:3000 -d shravya2315/solar-system:$GIT_COMMIT
                            '
                        """
                    }
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

