def baseRepoUrl = 'https://github.com/MeetingTeam'
def mainBranch = 'main'

def appRepoName = 'frontend-service'
def appRepoUrl = "${baseRepoUrl}/${appRepoName}.git"
def appVersion = "1.0"

def k8SRepoName = 'k8s-repo'
def helmPath = "${k8SRepoName}/application/${appRepoName}"
def helmValueFile = "values.dev.yaml"

def githubAccount = 'github'
def kanikoAccount = 'kaniko'

def trivyReportFile = 'report_trivy.html'

def sonarOrg = 'meetingteam'

pipeline {
    agent {
        kubernetes {
            inheritFrom 'nodejs'
        }
    }

    environment {
        DOCKER_REGISTRY = 'registry-1.docker.io'
        DOCKER_IMAGE_NAME = 'hungtran679/mt_frontend-service'
        IMAGE_VERSION = "${appVersion}-${GIT_COMMIT.take(7)}-${BUILD_NUMBER}"
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${IMAGE_VERSION}"
    }

    stages {
        stage('Install dependencies') {
            steps {
                container('nodejs') {
                    sh 'npm install'
                }
            }
        }

        stage('Run tests') {
            steps {
                container('nodejs') {
                    sh 'npm run test'
                }
            }
        }

        stage('Code analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv('SonarServer') {
                        sh """
                            sonar-scanner \
                                -Dsonar.sources=src \
                                -Dsonar.projectKey=${appRepoName} \
                                -Dsonar.organization=${sonarOrg}
                        """
                    }
                }
            }
        }

        stage('Quality gate check') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate(abortPipeline: true)
                }
            }
        }

        stage('Build frontend') {
            when { branch mainBranch }
            steps {
                container('nodejs') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build and push Docker image') {
            when { branch mainBranch }
            steps {
                container('kaniko') {
                    withCredentials([string(credentialsId: kanikoAccount, variable: 'KANIKO_AUTH')]) {
                        script {
                            def dockerConfig = """
                                {
                                  "auths": {
                                    "${DOCKER_REGISTRY}": {
                                      "auth": "${KANIKO_AUTH}"
                                    }
                                  }
                                }
                            """
                            writeFile file: 'config.json', text: dockerConfig.trim()

                            sh """
                                mv config.json /kaniko/.docker/config.json
                                /kaniko/executor \
                                    --context=. \
                                    --dockerfile=Dockerfile \
                                    --destination=${DOCKER_IMAGE}
                            """
                        }
                    }
                }
            }
        }

        stage('Scan built image') {
            when { branch mainBranch }
            steps {
                container('trivy') {
                    sh """
                        wget -O html.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
                        trivy image \
                            --format template \
                            --template "@html.tpl" \
                            -o ${trivyReportFile} \
                            --timeout 15m \
                            --scanners vuln \
                            ${DOCKER_IMAGE}
                    """
                }
            }
        }

        stage('Update k8s repo') {
            when { branch mainBranch }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: githubAccount,
                        passwordVariable: 'GIT_PASS',
                        usernameVariable: 'GIT_USER'
                    )
                ]) {
                    sh """
                        git clone https://\${GIT_USER}:\${GIT_PASS}@github.com/MeetingTeam/${k8SRepoName}.git --branch ${mainBranch}
                        cd ${helmPath}
                        sed -i "/imageTag:/s/:.*/: ${IMAGE_VERSION}/" ${helmValueFile}

                        git config --global user.email "jenkins@gmail.com"
                        git config --global user.name "Jenkins"
                        git add .
                        git commit -m "feat: update application image of helm chart '${appRepoName}' to version ${IMAGE_VERSION}"
                        git push origin ${mainBranch}
                    """
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: trivyReportFile, allowEmptyArchive: true, fingerprint: true
        }
    }
}