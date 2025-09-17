// Configurable data for each node 


export interface SendMessageNodeData {
    account:string;
    to: string;
    subject: string;
    message: string;
    textType: 'html' | 'markdown';
}


type SchemaField =
  | {
      type: 'string';
      required: boolean;
      label: string;
      inputType?: 'text' | 'textarea' | 'dropdown';
      options?: string[]; // For dropdowns
    }
  | {
      type: 'enum';
      required: boolean;
      label: string;
      options: string[]; // Enum options
    }

    export type SendEmailSchema = Record<keyof SendMessageNodeData, SchemaField>;

// Frontend schema for the Send Email node
export const sendEmailSchema: SendEmailSchema = {
  account: {
    type: 'string',
    required: true,
    label: 'Email Account',
    inputType: 'dropdown',
    options: [], // dynamically populated with connected accounts
  },
  to: {
    type: 'string',
    required: true,
    label: 'Recipient Email',
    inputType: 'text',
  },
  subject: {
    type: 'string',
    required: true,
    label: 'Subject',
    inputType: 'text',
  },
  body: {
    type: 'string',
    required: true,
    label: 'Body',
    inputType: 'textarea',
  },
  bodyType: {
    type: 'enum',
    required: true,
    label: 'Body Type',
    options: ['html', 'markdown'],
  },
};