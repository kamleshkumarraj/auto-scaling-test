pipeline {
  agent {label "asg-test"}

  environment {
    AWS_REGION = "ap-south-1"
    ECR_ACCOUNT_ID = "123456789012"
    ECR_REPO = "asg-stress-app"
    IMAGE_TAG = "${BUILD_NUMBER}"
    ECR_URI = "${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  stages {

    /* ============================
       1. Clone Code (Public Repo)
    ============================ */
    stage('Clone Source Code') {
      steps {
        echo "📥 Cloning source code"
        git branch: 'main',
            url: 'https://github.com/your-org/asg-stress-app.git'
      }
    }

    /* ============================
       2. Docker Build (Local Image)
    ============================ */
    stage('Build Docker Image') {
      steps {
        echo "🐳 Building Docker image"
        sh """
          docker build \
            -t ${ECR_REPO}:${IMAGE_TAG} \
            .
        """
      }
    }

    /* ============================
       3. Login to ECR
    ============================ */
    stage('Login to Amazon ECR') {
      steps {
        echo "🔐 Logging into ECR"
        sh """
          aws ecr get-login-password \
            --region ${AWS_REGION} \
          | docker login \
            --username AWS \
            --password-stdin ${ECR_URI}
        """
      }
    }

    /* ============================
       4. Tag Image for ECR
    ============================ */
    stage('Tag Image') {
      steps {
        echo "🏷️ Tagging image for ECR"
        sh """
          docker tag \
            ${ECR_REPO}:${IMAGE_TAG} \
            ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}

          docker tag \
            ${ECR_REPO}:${IMAGE_TAG} \
            ${ECR_URI}/${ECR_REPO}:latest
        """
      }
    }

    /* ============================
       5. Push Image to ECR
    ============================ */
    stage('Push Image to ECR') {
      steps {
        echo "📤 Pushing image to ECR"
        sh """
          docker push ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}
          docker push ${ECR_URI}/${ECR_REPO}:latest
        """
      }
    }

    /* ============================
       6. Deploy (Best Practice)
    ============================ */
    stage('Deploy Application') {
      steps {
        echo "🚀 Deploying application"

        sh """
          docker compose down || true
          docker compose pull
          docker compose up -d
        """
      }
    }
  }

  post {
    success {
      echo "✅ Deployment completed successfully"
    }
    failure {
      echo "❌ Pipeline failed"
    }
    cleanup {
      echo "🧹 Cleaning unused Docker resources"
      sh "docker system prune -f || true"
    }
  }
}
