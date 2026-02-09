# Terraform AWS Deployment Guide

This guide explains how to deploy the FixItNow application to AWS using Terraform Infrastructure as Code.

## Architecture Overview

The infrastructure includes:
- **VPC**: Custom VPC with public and private subnets across 2 availability zones
- **RDS MySQL**: Managed database in private subnets
- **ECS Fargate**: Serverless container orchestration for backend and frontend
- **Application Load Balancer**: Routes traffic to frontend and backend services
- **CloudWatch**: Centralized logging for containers

## Prerequisites

### 1. Terraform Installation
Verify Terraform is installed in WSL:
```bash
wsl terraform --version
```

Expected output: `Terraform v1.7.0` (or higher)

### 2. AWS Account Setup
You need an AWS account with programmatic access credentials.

#### Create AWS IAM User:
1. Go to AWS Console → IAM → Users → Create User
2. User name: `terraform-deployer`
3. Attach policies:
   - AmazonEC2FullAccess
   - AmazonECSFullAccess
   - AmazonRDSFullAccess
   - AmazonVPCFullAccess
   - ElasticLoadBalancingFullAccess
   - IAMFullAccess
   - CloudWatchLogsFullAccess
4. Create access key → Select "Command Line Interface (CLI)"
5. Save Access Key ID and Secret Access Key

#### Configure AWS Credentials in WSL:
```bash
wsl bash
aws configure
```

Enter when prompted:
- AWS Access Key ID: `YOUR_ACCESS_KEY_ID`
- AWS Secret Access Key: `YOUR_SECRET_ACCESS_KEY`
- Default region: `us-east-1`
- Default output format: `json`

Verify configuration:
```bash
wsl aws sts get-caller-identity
```

Should return your AWS account details.

### 3. Docker Images on DockerHub
Ensure your images are pushed to DockerHub:
- `ahnaf4920/devops_fixitnow:backend`
- `ahnaf4920/devops_fixitnow:frontend`

Check Jenkins pipeline or run manually:
```bash
wsl docker push ahnaf4920/devops_fixitnow:backend
wsl docker push ahnaf4920/devops_fixitnow:frontend
```

## Configuration

### Create terraform.tfvars
Copy the example file and configure:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region = "us-east-1"

db_username = "admin"
db_password = "MySecurePassword123!"  # Change to strong password

db_instance_class = "db.t3.micro"  # Free tier eligible

backend_image_tag  = "backend"
frontend_image_tag = "frontend"
```

**IMPORTANT**: Never commit `terraform.tfvars` to Git (already in `.gitignore`)

## Deployment Steps

### 1. Initialize Terraform
Navigate to terraform directory and initialize:
```bash
cd terraform
wsl terraform init
```

This downloads AWS provider plugins and sets up backend.

### 2. Validate Configuration
Check for syntax errors:
```bash
wsl terraform validate
```

Expected output: `Success! The configuration is valid.`

### 3. Preview Changes
See what resources will be created:
```bash
wsl terraform plan
```

Review the plan carefully. You should see:
- 30+ resources to be created
- VPC, subnets, security groups
- RDS MySQL instance
- ECS cluster, task definitions, services
- Application Load Balancer

### 4. Deploy Infrastructure
Apply the configuration:
```bash
wsl terraform apply
```

Type `yes` when prompted to confirm.

**Deployment time**: 10-15 minutes (RDS takes longest)

### 5. Get Outputs
After successful deployment:
```bash
wsl terraform output
```

You'll see:
```
alb_url = "http://fixitnow-alb-1234567890.us-east-1.elb.amazonaws.com"
rds_endpoint = "fixitnow-db.xxxxx.us-east-1.rds.amazonaws.com:3306"
ecs_cluster_name = "fixitnow-cluster"
backend_service_name = "fixitnow-backend-service"
frontend_service_name = "fixitnow-frontend-service"
```

### 6. Access Application
Open the `alb_url` in your browser. Wait 2-3 minutes for services to become healthy.

Check service health:
```bash
wsl aws ecs describe-services --cluster fixitnow-cluster --services fixitnow-backend-service fixitnow-frontend-service
```

## Post-Deployment Verification

### Check ECS Tasks
```bash
# List running tasks
wsl aws ecs list-tasks --cluster fixitnow-cluster

# Describe tasks
wsl aws ecs describe-tasks --cluster fixitnow-cluster --tasks <task-arn>
```

### View Logs
```bash
# Backend logs
wsl aws logs tail /ecs/fixitnow --follow --filter-pattern "backend"

# Frontend logs
wsl aws logs tail /ecs/fixitnow --follow --filter-pattern "frontend"
```

### Test Endpoints
```bash
# Get ALB URL
ALB_URL=$(wsl terraform output -raw alb_url)

# Test frontend
curl $ALB_URL

# Test backend API
curl $ALB_URL/api/categories
```

## Updating Infrastructure

### Update Container Images
After Jenkins builds new images:

1. Update task definitions to use new tags in `main.tf`:
```hcl
image = "ahnaf4920/devops_fixitnow:backend-7"  # New build number
```

2. Apply changes:
```bash
wsl terraform apply
```

ECS will perform rolling update with zero downtime.

### Scale Services
Increase desired task count in `main.tf`:
```hcl
resource "aws_ecs_service" "backend" {
  desired_count = 2  # Scale to 2 instances
}
```

Apply:
```bash
wsl terraform apply
```

### Change Instance Types
For better performance, update `terraform.tfvars`:
```hcl
db_instance_class = "db.t3.small"
```

Apply:
```bash
wsl terraform apply
```

## Cost Estimation

Approximate monthly costs (us-east-1):
- **RDS db.t3.micro**: $13-15/month
- **ECS Fargate**: $15-20/month (2 tasks running 24/7)
- **Application Load Balancer**: $16/month + data transfer
- **Data Transfer**: $5-10/month (varies by usage)
- **CloudWatch Logs**: $1-3/month

**Total**: ~$50-65/month

Use AWS Free Tier for first 12 months (750 hours RDS, limited Fargate)

## Cleanup / Destroy Infrastructure

**WARNING**: This deletes all resources and data!

```bash
wsl terraform destroy
```

Type `yes` to confirm deletion.

Takes 5-10 minutes. Verifies all resources deleted:
```bash
wsl aws ecs list-clusters
wsl aws rds describe-db-instances
wsl aws ec2 describe-vpcs --filters "Name=tag:Name,Values=fixitnow-vpc"
```

## Troubleshooting

### Issue: "Error creating RDS instance: InvalidParameterValue"
**Solution**: RDS requires 2+ subnets in different AZs. Configuration already handles this.

### Issue: Backend service unhealthy
**Check**:
1. RDS security group allows connections from ECS tasks
2. Database credentials match in `terraform.tfvars` and Spring Boot
3. View logs: `wsl aws logs tail /ecs/fixitnow --follow --filter-pattern "backend"`

### Issue: "Error: error configuring Terraform AWS Provider: no valid credential sources"
**Solution**: Configure AWS credentials:
```bash
wsl aws configure
```

### Issue: Tasks failing with "CannotPullContainerError"
**Solution**: Verify Docker images exist on DockerHub:
```bash
wsl docker pull ahnaf4920/devops_fixitnow:backend
wsl docker pull ahnaf4920/devops_fixitnow:frontend
```

### Issue: High costs
**Solution**:
1. Stop unused services: `desired_count = 0` in `main.tf`
2. Use smaller instance types: `db.t3.micro` instead of `db.t3.small`
3. Enable RDS auto-pause for development
4. Destroy when not needed: `terraform destroy`

### Issue: Timeout during apply
**Solution**: Increase timeout in `main.tf` health checks:
```hcl
health_check {
  timeout  = 60
  interval = 120
}
```

## CI/CD Integration

### Automate with Jenkins
Add Terraform stage to `Jenkinsfile`:

```groovy
stage('Deploy to AWS') {
    steps {
        script {
            // Terraform deployment
            sh """
                cd terraform
                terraform init
                terraform plan -out=tfplan
                terraform apply tfplan
            """
        }
    }
}
```

Configure AWS credentials in Jenkins:
1. Manage Jenkins → Credentials
2. Add AWS Access Key ID and Secret Key
3. Use in Jenkinsfile with `withCredentials` block

## Next Steps

1. **Add HTTPS**: Configure ACM certificate and update ALB listener to port 443
2. **Custom Domain**: Route53 hosted zone pointing to ALB
3. **Auto Scaling**: Configure ECS service auto-scaling based on CPU/memory
4. **Monitoring**: Set up CloudWatch alarms for service health
5. **Backups**: Enable automated RDS snapshots (already configured: 7 days retention)
6. **Multi-Environment**: Create `dev`, `staging`, `prod` workspaces

## Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [Terraform CLI Commands](https://developer.hashicorp.com/terraform/cli/commands)
