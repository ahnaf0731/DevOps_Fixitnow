# Jenkins CI/CD Setup Guide

## Overview
This guide sets up Jenkins to automatically build and push Docker images to DockerHub whenever you push code to GitHub.

---

## Part 1: Install Jenkins with Docker

### Step 1: Run Jenkins Container

Open WSL terminal and run:

```bash
# Create Jenkins home directory
mkdir -p ~/jenkins_home

# Run Jenkins in Docker
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v ~/jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Step 2: Install Docker Inside Jenkins Container

```bash
# Access Jenkins container
docker exec -it -u root jenkins bash

# Install Docker CLI
apt-get update
apt-get install -y docker.io

# Give Jenkins user permission to use Docker
usermod -aG docker jenkins

# Exit container
exit

# Restart Jenkins
docker restart jenkins
```

### Step 3: Get Initial Admin Password

```bash
# Get the password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Copy the password that appears.

---

## Part 2: Configure Jenkins

### Step 1: Access Jenkins

1. Open browser: http://localhost:8080
2. Paste the initial admin password
3. Click **"Install suggested plugins"**
4. Wait for plugins to install

### Step 2: Create Admin User

1. Fill in your details:
   - Username: `admin`
   - Password: (choose a password)
   - Full name: Your name
   - Email: Your email
2. Click **Save and Continue**
3. Keep default Jenkins URL → **Save and Finish**
4. Click **Start using Jenkins**

---

## Part 3: Configure Credentials

### Step 1: Add DockerHub Credentials

1. Go to: **Dashboard → Manage Jenkins → Credentials**
2. Click **(global)** → **Add Credentials**
3. Fill in:
   - **Kind**: Username with password
   - **Username**: `ahnaf4920`
   - **Password**: Your DockerHub password or access token
   - **ID**: `dockerhub-credentials`
   - **Description**: DockerHub Login
4. Click **Create**

### Step 2: Add GitHub Credentials (if private repo)

1. Click **Add Credentials** again
2. Fill in:
   - **Kind**: Username with password
   - **Username**: `ahnaf0731`
   - **Password**: Your GitHub Personal Access Token
   - **ID**: `github-credentials`
   - **Description**: GitHub Access
3. Click **Create**

---

## Part 4: Create Jenkins Pipeline

### Step 1: Create New Pipeline Job

1. Click **New Item**
2. Enter name: `FixItNow-Pipeline`
3. Select **Pipeline**
4. Click **OK**

### Step 2: Configure Pipeline

1. **General Section:**
   - Check ✅ **GitHub project**
   - Project url: `https://github.com/ahnaf0731/DevOps_Fixitnow/`

2. **Build Triggers:**
   - Check ✅ **GitHub hook trigger for GITScm polling**
   - (This will trigger builds when you push to GitHub)

3. **Pipeline Section:**
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/ahnaf0731/DevOps_Fixitnow.git`
   - **Credentials**: Select github-credentials (if private repo)
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

4. Click **Save**

---

## Part 5: Configure GitHub Webhook

### Step 1: Get Jenkins URL

If running locally, you need to expose Jenkins to the internet:

**Option A: Using ngrok (Recommended for testing)**
```bash
# Install ngrok from https://ngrok.com/download

# Expose Jenkins port
ngrok http 8080
```

Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)

**Option B: Use your server's public IP**
If Jenkins is on a server: `http://YOUR_SERVER_IP:8080`

### Step 2: Add Webhook to GitHub

1. Go to: https://github.com/ahnaf0731/DevOps_Fixitnow/settings/hooks
2. Click **Add webhook**
3. Fill in:
   - **Payload URL**: `YOUR_JENKINS_URL/github-webhook/`
     - Example: `https://abc123.ngrok.io/github-webhook/`
   - **Content type**: `application/json`
   - **Which events**: Just the push event
   - Check ✅ **Active**
4. Click **Add webhook**

---

## Part 6: Test the Pipeline

### Manual Test

1. Go to Jenkins Dashboard
2. Click on **FixItNow-Pipeline**
3. Click **Build Now**
4. Watch the build progress in **Build History**
5. Click on build #1 → **Console Output** to see logs

### Automatic Test (After Webhook Setup)

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test Jenkins pipeline"
   git push origin main
   ```
3. Jenkins should automatically start a new build
4. Check DockerHub for new images with build numbers

---

## Pipeline Stages Explained

1. **Checkout**: Pulls code from GitHub
2. **Build Backend Image**: Builds Spring Boot Docker image
3. **Build Frontend Image**: Builds React Docker image
4. **Test Images**: Verifies images work correctly
5. **Push to DockerHub**: Uploads images with build number and latest tag
6. **Clean Up**: Removes old images to save space

---

## Monitoring Builds

### View Console Output
- Dashboard → FixItNow-Pipeline → Build #X → Console Output

### View Build Status
- Green checkmark ✅ = Success
- Red X ❌ = Failed

### Email Notifications (Optional)

Configure in: **Manage Jenkins → Configure System → E-mail Notification**

---

## Troubleshooting

### Docker Permission Denied
```bash
docker exec -it -u root jenkins bash
usermod -aG docker jenkins
exit
docker restart jenkins
```

### Build Fails: Docker Command Not Found
Install Docker CLI inside Jenkins container (see Step 2 of Part 1)

### GitHub Webhook Not Triggering
- Verify webhook URL ends with `/github-webhook/`
- Check webhook delivery in GitHub settings
- Ensure Jenkins is accessible from internet

### Images Not Pushing
- Verify DockerHub credentials in Jenkins
- Check credential ID matches Jenkinsfile: `dockerhub-credentials`

---

## Stopping Jenkins

```bash
# Stop Jenkins container
docker stop jenkins

# Start Jenkins again
docker start jenkins

# Remove Jenkins completely
docker rm -f jenkins
```

---

## Next Steps

1. **Add Automated Tests**: Include unit tests in the pipeline
2. **Deploy to Server**: Add deployment stage to push to production
3. **Slack Notifications**: Get notified when builds complete
4. **Multi-branch Pipeline**: Separate pipelines for dev/staging/production

---

## Quick Reference

**Jenkins URL**: http://localhost:8080  
**Jenkins Credentials**: dockerhub-credentials, github-credentials  
**Pipeline Name**: FixItNow-Pipeline  
**Jenkinsfile Location**: Root of repository  
**DockerHub Images**: 
- `ahnaf4920/devops_fixitnow:backend-<build_number>`
- `ahnaf4920/devops_fixitnow:frontend-<build_number>`
