# n8n Automation Workflows

This directory contains n8n workflow configurations for automating various processes in the ERP system.

## Available Workflows

### 1. Fee Receipt Generation (`fee-receipt-generation.json`)
**Purpose**: Automatically generates and emails fee receipts when payments are processed.

**Trigger**: Webhook endpoint for payment processing
**Process**:
1. Receives payment data via webhook
2. Processes payment information and generates receipt number
3. Calls backend API to generate PDF receipt
4. Sends receipt via email to student
5. Returns confirmation response

**Webhook URL**: `http://localhost:5678/webhook/fee-payment`

### 2. Payment Reminder System
**Purpose**: Sends automated reminders for pending fee payments.

**Features**:
- Daily check for overdue payments
- Email and SMS notifications
- Escalation levels (1st reminder, 2nd reminder, final notice)

### 3. Monthly Report Generation
**Purpose**: Automatically generates and distributes monthly reports.

**Features**:
- Student enrollment reports
- Fee collection summaries
- Hostel occupancy reports
- Email distribution to administrators

## Setup Instructions

### Prerequisites
- n8n installed and running (default port: 5678)
- Backend API server running (port: 5000)
- Email server configured in n8n credentials

### Installation Steps

1. **Start n8n**
   ```bash
   npx n8n
   ```

2. **Access n8n Interface**
   - Open browser: `http://localhost:5678`
   - Create admin account if first time

3. **Import Workflows**
   - Go to "Workflows" in n8n interface
   - Click "Import from File"
   - Select workflow JSON files from this directory

4. **Configure Credentials**
   - Set up email credentials for notifications
   - Configure webhook URLs
   - Set API endpoints for backend communication

5. **Activate Workflows**
   - Open each workflow
   - Click "Active" toggle to enable
   - Test webhook endpoints

## Workflow Configuration

### Environment Variables
Set these in your n8n environment:

```bash
# Backend API
API_BASE_URL=http://localhost:5000/api

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-app-password

# SMS Configuration (optional)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=ERPSYS
```

### Webhook Security
- Use webhook authentication tokens
- Implement IP whitelisting if needed
- Add request validation in workflows

## Testing Workflows

### Fee Receipt Generation Test
```bash
curl -X POST http://localhost:5678/webhook/fee-payment \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "studentId": "STU001",
    "studentEmail": "john@example.com",
    "amount": 15000,
    "paymentMethod": "online",
    "semester": 1,
    "academicYear": "2024-25"
  }'
```

## Troubleshooting

### Common Issues
1. **Webhook not triggering**: Check n8n is running and webhook URL is correct
2. **Email not sending**: Verify email credentials and SMTP settings
3. **API connection failed**: Ensure backend server is running and accessible

### Logs
- Check n8n execution logs in the interface
- Monitor backend API logs for webhook calls
- Verify email delivery in email service logs

## Customization

### Adding New Workflows
1. Create workflow in n8n interface
2. Export as JSON
3. Save in this directory
4. Update documentation

### Modifying Existing Workflows
1. Import workflow to n8n
2. Make changes in interface
3. Test thoroughly
4. Export updated JSON
5. Replace file in this directory

## Best Practices
- Always test workflows in development environment
- Use error handling nodes for robust automation
- Implement logging for debugging
- Keep sensitive data in environment variables
- Regular backup of workflow configurations