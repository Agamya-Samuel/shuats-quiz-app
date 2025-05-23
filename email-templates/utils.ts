import fs from 'fs';
import path from 'path';

export interface EmailTemplateData {
  [key: string]: string | number;
}

export function loadEmailTemplate(templateName: string, data: EmailTemplateData): string {
  const templatePath = path.join(process.cwd(), 'lib', 'email-templates', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace all variables in the template
  Object.entries(data).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });

  return template;
} 