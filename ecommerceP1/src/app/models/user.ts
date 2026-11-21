export interface User {
  id: string;
  /** código do cliente na API (/api/cliente/{codigo}) */
  codigo?: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password?: string;
  documento?: string;
  checkout?: boolean;
  dialogId?: string;
}

export type SignInParams = Omit<SignUpParams, 'name' | 'documento'>;
