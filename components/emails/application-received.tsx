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

interface ApplicationReceivedEmailProps {
  employerName: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  applicationUrl: string
  jobUrl: string
}

export function ApplicationReceivedEmail({
  employerName,
  jobTitle,
  applicantName,
  applicantEmail,
  coverLetter,
  applicationUrl,
  jobUrl,
}: ApplicationReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New application received for {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img src="/placeholder.svg?height=40&width=120" width="120" height="40" alt="JobBoard" style={logo} />
          </Section>

          <Heading style={h1}>New Application Received!</Heading>

          <Text style={text}>Hi {employerName},</Text>

          <Text style={text}>Great news! You've received a new application for your job posting:</Text>

          <Section style={jobSection}>
            <Text style={jobTitle}>{jobTitle}</Text>
          </Section>

          <Section style={applicantSection}>
            <Text style={sectionTitle}>Applicant Details:</Text>
            <Text style={text}>
              <strong>Name:</strong> {applicantName}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {applicantEmail}
            </Text>
          </Section>

          {coverLetter && (
            <Section style={coverLetterSection}>
              <Text style={sectionTitle}>Cover Letter:</Text>
              <Text style={coverLetterText}>{coverLetter}</Text>
            </Section>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href={applicationUrl}>
              View Application
            </Button>
          </Section>

          <Text style={text}>
            You can also{" "}
            <Link href={jobUrl} style={link}>
              view the job posting
            </Link>{" "}
            or manage all your applications from your dashboard.
          </Text>

          <Text style={footer}>
            Best regards,
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
  padding: "16px",
  margin: "24px 0",
}

const jobTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
}

const applicantSection = {
  margin: "24px 0",
}

const coverLetterSection = {
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  padding: "16px",
  margin: "24px 0",
}

const sectionTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const coverLetterText = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  fontStyle: "italic",
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
