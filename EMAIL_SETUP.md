# Email Setup with Resend

This application uses [Resend](https://resend.com) for sending transactional emails. Here's how to set it up:

## 1. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the sandbox domain for testing)
3. Go to the API Keys section and create a new API key

## 2. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Required: Your Resend API key
RESEND_API_KEY=re_xxxxxxxxxx

# Optional: Custom email addresses (defaults provided)
EMAIL_FROM_ADDRESS="JobBoard <noreply@yourdomain.com>"
EMAIL_REPLY_TO="support@yourdomain.com"

# Required for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Domain Setup (Production)

For production use, you'll need to:

1. **Verify your domain** in Resend dashboard
2. **Add DNS records** as provided by Resend
3. **Update EMAIL_FROM_ADDRESS** to use your verified domain

## 4. Testing Email Functionality

### Test via API Endpoint

You can test if emails are working by using the test endpoint:

```bash
# Send a test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

### Test via Application

1. Create a job posting with email application method
2. Apply for the job using the application modal
3. Check the console logs for email sending status
4. Check your email inbox for:
   - Application confirmation (to applicant)
   - Application received notification (to employer)

## 5. Email Types

The application sends these types of emails:

### Application Received (to Employer)
- **When**: Someone applies for a job
- **Contains**: Applicant details, cover letter, links to review application
- **Template**: `components/emails/application-received.tsx`

### Application Confirmation (to Applicant)
- **When**: Application is successfully submitted
- **Contains**: Job details, application status, dashboard link
- **Template**: `components/emails/application-confirmation.tsx`

### Application Status Update (to Applicant)
- **When**: Employer updates application status
- **Contains**: Status change notification, next steps
- **Template**: `components/emails/application-status-update.tsx`

## 6. Customization

### Email Templates

Email templates are React components located in `components/emails/`. You can customize:
- Styling and layout
- Content and messaging
- Branding and logos

### Email Configuration

Update `lib/email/config.ts` to modify:
- From address
- Reply-to address
- Default settings

## 7. Debugging

### Console Logs

The email service includes detailed logging:
- 📧 Sending email attempts
- ✅ Successful sends
- ❌ Failed sends with error details

### Common Issues

1. **"Domain not verified"**: Add your domain in Resend dashboard
2. **API key invalid**: Check your RESEND_API_KEY in .env.local
3. **Emails not received**: Check spam folder, verify email addresses

## 8. Production Checklist

- [ ] Domain verified in Resend
- [ ] DNS records configured
- [ ] Production API key set
- [ ] Email addresses updated to use verified domain
- [ ] Test email sending in production environment
- [ ] Monitor email delivery rates and bounces

## 9. Rate Limits

Resend has usage limits based on your plan:
- **Free**: 100 emails/day, 3,000 emails/month
- **Pro**: Higher limits available

Monitor your usage in the Resend dashboard.

## 10. Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Status Page](https://status.resend.com)
- Check console logs for detailed error messages 