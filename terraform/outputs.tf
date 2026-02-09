output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.main.dns_name}"
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint"
  value       = aws_db_instance.mysql.endpoint
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = aws_ecs_cluster.main.name
}

output "backend_service_name" {
  description = "Backend ECS Service name"
  value       = aws_ecs_service.backend.name
}

output "frontend_service_name" {
  description = "Frontend ECS Service name"
  value       = aws_ecs_service.frontend.name
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for application logs"
  value       = aws_cloudwatch_log_group.app.name
}
