pipeline {
    agent { 
           docker { 
                  image 'node:20-alpine3.16'
                  args '-p 3000:3000'
         }
    }
stages {
stage('Build') {
        steps {
            sh 'npm install'
             sh 'npm run dev'
      }
 }
}
}