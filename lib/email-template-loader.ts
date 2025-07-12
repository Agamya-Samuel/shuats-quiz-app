/**
 * Utility function to load email templates that works in both development and production
 */

import fs from 'fs';
import path from 'path';

export interface EmailTemplateData {
  [key: string]: string | number;
}

export async function loadEmailTemplate(
  templateName: string,
  data: EmailTemplateData,
): Promise<string> {
  try {
    console.log(`Loading email template: ${templateName} - via @lib/email-template-loader.ts`);
    // import of the template
    const templatePath = path.join(
      process.cwd(),
      'email-templates',
      `${templateName}.html`,
    );
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace all variables in the template
    Object.entries(data).forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    return template;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}
