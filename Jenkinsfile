def baseRepoUrl = 'https://github.com/MeetingTeam'
def mainBranch = 'main'

def appRepoName = 'frontend-service'
def appRepoUrl = "${baseRepoUrl}/${appRepoName}.git"

def k8SRepoName = 'k8s-repo'
def helmPath = "${k8SRepoName}/application/${appRepoName}"
def helmValueFile = "values.test.yaml"

def dockerhubAccount = 'dockerhub'
def githubAccount = 'github'

def dockerImageName = 'hungtran679/mt_user-service'
def dockerfilePath = '.'

def dockerFlywayImageName = 'hungtran679/mt_flyway-user-service'


def version = "v2.${BUILD_NUMBER}"

pipeline{
         agent {
                    kubernetes {
                              inheritFrom 'nodejs'
                    }
          }
          
          environment {
                    DOCKER_REGISTRY = 'registry-1.docker.io'       

                    GIT_PREVIOUS_COMMIT = sh(script: 'git rev-parse HEAD~1', returnStdout: true).trim()
                    GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()    
          }
          
          stages{
                      stage('Install stage'){
                              steps{
                                        container('nodejs'){
                                              sh 'npm install'                                       
                                        }
                              }
                    }
                  stage('Test stage'){
                              steps{
                                        container('nodejs'){
                                                  sh 'npm run test -- --coverage'
                                        }
                              }
                  }
                  stage('Build Stage'){
                              when{ branch mainBranch }
                              steps{
                                        container('nodejs'){
                                                  sh 'npm run build'
                                        }
                              }
                  }
                    stage('Build and push docker image'){
                              when{ branch mainBranch }
                              steps{
                                        container('kaniko'){
                                                   withCredentials([
                                                            string(credentialsId: kanikoAccount, variable: 'KANIKO_AUTH')
                                                  ]) {
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
                                                              --context=${dockerfilePath} \
                                                              --dockerfile=${dockerfilePath}/Dockerfile \
                                                              --destination=${DOCKER_REGISTRY}/${dockerImageName}:${version}
                                                          """
                                                      }
                                                  }
                                        }
                              }
                    }
                  stage('Scan built image'){
                              when{ branch mainBranch }
                              steps{
                                        container('trivy'){
                                                  sh "trivy image --timeout 15m --scanners vuln \${DOCKER_REGISTRY}/${dockerImageName}:${version}"
                                                  //sh "trivy image --timeout 15m --scanners vuln --severity HIGH,CRITICAL --exit-code 1 \${DOCKER_REGISTRY}/${dockerImageName}:${version}"
                                        }
                              }
                  }
                    stage('Update k8s repo'){
                              when{ branch mainBranch }
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
                                                      sed -i 's|  tag: .*|  tag: "${version}"|' ${helmValueFile}

                                                      git config --global user.email "jenkins@gmail.com"
                                                      git config --global user.name "Jenkins"
                                                      git add .
                                                      git commit -m "feat: update application image of helm chart '${appRepoName}' to version ${version}"
                                                      git push origin ${mainBranch}
                                                """		
				            }				
                              }
                    }
          }
          post {
                failure {
                      script {
                          try{
                              emailext(
                                    subject: "Build Failed: ${currentBuild.fullDisplayName}",
                                    body: "The build has failed. Please check the logs for more information.",
                                    to: '$DEFAULT_RECIPIENTS'
                              )
                          } catch (Exception e) {
                                echo "SMTP email configuration is not found or failed: ${e.getMessage()}. Skipping email notification."
                          }
                      }
                }
          }
}