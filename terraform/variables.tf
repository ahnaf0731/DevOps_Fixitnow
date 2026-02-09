variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"
}

variable "backend_image_tag" {
  description = "Docker image tag for backend"
  type        = string
  default     = "backend"
}

variable "frontend_image_tag" {
  description = "Docker image tag for frontend"
  type        = string
  default     = "frontend"
}
