export const SKILLS_BY_CATEGORY = {
  Frontend: ["React", "Angular", "Vue.js", "TypeScript", "JavaScript", "Next.js", "Redux", "GraphQL"],
  Backend: ["Java", "Python", "Node.js", "Go", ".NET", "Spring Boot", "FastAPI", "Express.js", "Microservices"],
  Cloud: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "Serverless", "CloudFormation"],
  Data: ["Apache Spark", "Kafka", "Airflow", "dbt", "Snowflake", "BigQuery", "Databricks", "Pandas", "SQL"],
  QA: ["Selenium", "JMeter", "Cypress", "Jest", "Playwright", "Appium", "LoadRunner"],
  DevOps: ["CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD", "Ansible", "Helm", "Prometheus"],
  Management: ["Agile", "Scrum", "Kanban", "PMP", "JIRA", "Confluence", "SAFe", "Prince2"],
  Security: ["SAST", "Penetration Testing", "OWASP", "IAM", "Zero Trust", "SOC2"],
};

export const ALL_SKILLS = Object.values(SKILLS_BY_CATEGORY).flat();

export const CERTIFICATIONS = [
  "AWS Solutions Architect",
  "AWS Developer Associate",
  "Google Cloud Professional",
  "Azure Solutions Architect",
  "Kubernetes Administrator (CKA)",
  "Certified Scrum Master",
  "PMP",
  "CISSP",
  "Oracle Java SE",
  "Databricks Certified",
  "Snowflake SnowPro",
  "Terraform Associate",
];
