import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ApplicationStatusUpdateEmailProps {
  applicantName: string
  jobTitle: string
  companyName: string
  oldStatus: string
  newStatus: string
  statusMessage?: string
  applicationUrl: string
  jobUrl: string
}

export function ApplicationStatusUpdateEmail({
  applicantName,
  jobTitle,
  companyName,
  oldStatus,
  newStatus,
  statusMessage,
  applicationUrl,
  jobUrl,
}: ApplicationStatusUpdateEmailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      case "viewed":
        return "#3b82f6"
      default:
        return "#6b7280"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "contacted":
        return "Great news! The employer is interested in your application."
      case "rejected":
        return "Unfortunately, your application wasn't selected for this position."
      case "viewed":
        return "Your application has been reviewed by the employer."
      default:
        return "Your application status has been updated."
    }
  }

  return (
    <Html>
      <Head />
      <Preview>Application status update for {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img src="/placeholder.svg?height=40&width=120" width="120" height="40" alt="JobBoard" style={logo} />
          </Section>

          <Heading style={h1}>Application Status Update</Heading>

          <Text style={text}>Hi {applicantName},</Text>

          <Text style={text}>We have an update on your application for:</Text>

          <Section style={jobSection}>
            <Text style={jobTitle}>{jobTitle}</Text>
            <Text style={companyName}>at {companyName}</Text>
          </Section>

          <Section style={statusSection}>
            <Text style={statusLabel}>Status Update:</Text>
            <Text style={{ ...statusText, color: getStatusColor(newStatus) }}>
              {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
            </Text>
          </Section>

          <Text style={text}>{statusMessage || getStatusMessage(newStatus)}</Text>

          <Section style={buttonContainer}>
            <Button style={button} href={applicationUrl}>
              View Application Details
            </Button>
          </Section>

          <Text style={text}>
            You can also{" "}
            <Link href={jobUrl} style={link}>
              view the job posting
            </Link>{" "}
            or check all your applications in your dashboard.
          </Text>

          <Text style={footer}>
            Best of luck with your job search!
            <br />
            The JobBoard Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
}

const logo = {
  margin: "0 auto",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
}

const jobSection = {
  backgroundColor: "#f6f9fc",
  borderRadius: "4px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
}

const jobTitle = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
}

const companyName = {
  color: "#666",
  fontSize: "16px",
  margin: "0",
}

const statusSection = {
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
}

const statusLabel = {
  color: "#666",
  fontSize: "14px",
  margin: "0 0 8px 0",
}

const statusText = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
}

const link = {
  color: "#007ee6",
  textDecoration: "underline",
}

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "32px",
}
