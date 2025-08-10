pipeline {
    agent none

    environment {
        DEPLOY_PATH = '/var/www/html/goldman-sachs'
    }

    tools {
        nodejs 'NodeJS 18.19.0'
    }

    stages {
        stage('Build Vue.js with Vite') {
            agent { label 'built-in' } 
            steps {
                updateGitlabCommitStatus name: 'pre-build', state: 'pending'
                echo 'Clonage du dépôt GitLab...'
                sh 'pwd'
                checkout scm 
                // Installation des dépendances et build du projet Vue.js
                sh '''
                node -v
                npm install --legacy-peer-deps
                npm run build
                '''

                stash includes: 'dist/**', name: 'dist'
            }
            // Archive le dossier dist comme artefact pour qu'il soit accessible à d'autres étapes
            post {
                success {
                    updateGitlabCommitStatus name: 'pre-build', state: 'success'
                    archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: false
                }
            }
        }

        stage('Deploy dist to remote server') {
            agent { label 'self-agent' } // Utilisation de l'agent distant pour le déploiement
            steps {
                updateGitlabCommitStatus name: 'deploy', state: 'pending'
                
                unstash 'dist'
                // Copie du dossier dist vers le répertoire souhaité sur le serveur distant
                sh """
                    mkdir -p $DEPLOY_PATH
                    sudo /bin/cp -rf dist/* $DEPLOY_PATH/
                """

                echo 'Ajustement des permissions...'
                sh """
                    sudo chmod -R 755 $DEPLOY_PATH
                    sudo chown -R apache:apache $DEPLOY_PATH
                """

                echo "Liste des fichiers dans $DEPLOY_PATH"
                sh "ls -la $DEPLOY_PATH"
            }
        }
    }

    post {
        // always {
        //     cleanWs() // Nettoyer l'espace de travail après chaque exécution
        // }
        success {
            echo 'Déploiement réussi !'
            updateGitlabCommitStatus name: 'deploy', state: 'success'
        }
        failure {
            echo 'Le déploiement a échoué.'
            updateGitlabCommitStatus name: 'deploy', state: 'failed'
        }
    }
}
