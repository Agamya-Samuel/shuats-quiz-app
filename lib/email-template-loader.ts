/**
 * Utility function to load email templates that works in both development and production
 */
export async function loadEmailTemplate(
  templateName: string,
  data: Record<string, string | number>,
): Promise<string> {
  try {
    console.log(`Loading email template: ${templateName} - via @lib/email-template-loader.ts`);
    // Dynamic import of the template
    const template = await import(`@/email-templates/${templateName}.html`);

    // Get the content from the default export
    let content = template.default;

    // Replace all variables in the template
    Object.entries(data).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    return content;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}
