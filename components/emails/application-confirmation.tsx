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

interface ApplicationConfirmationEmailProps {
  applicantName: string
  jobTitle: string
  companyName: string
  applicationDate: string
  jobUrl: string
  dashboardUrl: string
}

export function ApplicationConfirmationEmail({
  applicantName,
  jobTitle,
  companyName,
  applicationDate,
  jobUrl,
  dashboardUrl,
}: ApplicationConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Application confirmed for {jobTitle} at {companyName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img src="/placeholder.svg?height=40&width=120" width="120" height="40" alt="JobBoard" style={logo} />
          </Section>

          <Heading style={h1}>Application Confirmed!</Heading>

          <Text style={text}>Hi {applicantName},</Text>

          <Text style={text}>Thank you for your application! We've successfully received your application for:</Text>

          <Section style={jobSection}>
            <Text style={jobTitle}>{jobTitle}</Text>
            <Text style={companyName}>at {companyName}</Text>
          </Section>

          <Section style={detailsSection}>
            <Text style={text}>
              <strong>Application submitted:</strong> {applicationDate}
            </Text>
            <Text style={text}>
              <strong>Status:</strong> Under Review
            </Text>
          </Section>

          <Text style={text}>
            Your application is now being reviewed by the hiring team. We'll notify you of any updates to your
            application status.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Application Status
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
            Good luck!
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

const detailsSection = {
  margin: "24px 0",
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
