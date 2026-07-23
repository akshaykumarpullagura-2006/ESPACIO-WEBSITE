export const leadConfirmationHTML = (lead) => {
  return `
    <div style="font-family: 'Georgia', serif; background-color: #F6EFE3; color: #4A433D; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #ECF4F0;">
      <h2 style="color: #6F5642; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 20px;">ESPACIO Interiors</h2>
      <hr style="border: 0; border-top: 1px solid #6F5642; margin-bottom: 30px;" />
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${lead.name},</p>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for reaching out to ESPACIO. We have received your consultation request and our design team is already reviewing your requirements.</p>
      
      <div style="background-color: #ECF4F0; padding: 20px; border-radius: 6px; border: 1px solid #6F5642; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #6F5642; font-size: 16px; text-transform: uppercase;">Request Summary</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 40%;">Reference ID:</td>
            <td style="padding: 6px 0;">${lead.leadId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Service Selected:</td>
            <td style="padding: 6px 0; text-transform: capitalize;">${lead.serviceType.replace('_', ' ')}</td>
          </tr>
          ${
            lead.propertyDetails?.location
              ? `<tr><td style="padding: 6px 0; font-weight: bold;">Project Location:</td><td style="padding: 6px 0;">${lead.propertyDetails.location}</td></tr>`
              : ''
          }
          ${
            lead.projectDetails?.timeline
              ? `<tr><td style="padding: 6px 0; font-weight: bold;">Preferred Timeline:</td><td style="padding: 6px 0;">${lead.projectDetails.timeline}</td></tr>`
              : ''
          }
        </table>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">One of our design experts will contact you within the next 24 business hours to set up your free initial consultation.</p>
      
      <p style="font-size: 14px; color: #6F5642; margin-top: 40px; text-align: center;">
        Your Home, Designed With Intention.<br />
        <a href="https://www.instagram.com/theespacio.in" style="color: #F2B455; text-decoration: none; font-weight: bold;">Follow us on Instagram</a>
      </p>
    </div>
  `;
};

export const adminNotificationHTML = (lead) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 45px; max-width: 650px; border-top: 4px solid #F2B455; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 0 auto;">
      <h2 style="color: #4A433D; margin-top: 0; font-size: 22px;">New Lead Received</h2>
      <p style="font-size: 15px; color: #666666;">A new quotation enquiry has been submitted through the ESPACIO website.</p>
      
      <h3 style="border-bottom: 1px solid #eeeeee; padding-bottom: 8px; color: #6F5642; font-size: 16px; text-transform: uppercase; margin-top: 30px;">Lead Info</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 30%; border-bottom: 1px solid #f9f9f9;">Name:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Phone:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Service Requested:</td>
          <td style="padding: 8px 0; text-transform: capitalize; border-bottom: 1px solid #f9f9f9;">${lead.serviceType.replace('_', ' ')}</td>
        </tr>
      </table>

      ${
        lead.serviceType !== 'materials'
          ? `
        <h3 style="border-bottom: 1px solid #eeeeee; padding-bottom: 8px; color: #6F5642; font-size: 16px; text-transform: uppercase; margin-top: 30px;">Property Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%; border-bottom: 1px solid #f9f9f9;">Property Type:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.propertyDetails?.propertyType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Spaces:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.propertyDetails?.spaces?.join(', ') || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Location:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.propertyDetails?.location || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Size:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.propertyDetails?.size || 'N/A'}</td>
          </tr>
        </table>
        
        <h3 style="border-bottom: 1px solid #eeeeee; padding-bottom: 8px; color: #6F5642; font-size: 16px; text-transform: uppercase; margin-top: 30px;">Project Scope</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%; border-bottom: 1px solid #f9f9f9;">Stage:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.projectDetails?.stage || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Timeline:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.projectDetails?.timeline || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Budget Target:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.projectDetails?.budget || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Client Notes:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.projectDetails?.notes || 'None'}</td>
          </tr>
        </table>
      `
          : `
        <h3 style="border-bottom: 1px solid #eeeeee; padding-bottom: 8px; color: #6F5642; font-size: 16px; text-transform: uppercase; margin-top: 30px;">Materials Enquiry Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%; border-bottom: 1px solid #f9f9f9;">Categories:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.materialDetails?.categories?.join(', ') || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Quantity:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.materialDetails?.quantity || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f9f9f9;">Location:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f9f9f9;">${lead.materialDetails?.location || 'N/A'}</td>
          </tr>
        </table>
      `
      }
      
      <p style="margin-top: 40px; text-align: center;">
        <a href="http://localhost:5173/admin" style="background-color: #F2B455; color: #4A433D; padding: 12px 25px; text-decoration: none; border-radius: 20px; font-weight: bold; font-size: 14px;">Open Admin Dashboard</a>
      </p>
    </div>
  `;
};
