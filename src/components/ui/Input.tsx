import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
export { Select } from './Select';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`form-control ${props.className ?? ''}`.trim()} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`form-control textarea ${props.className ?? ''}`.trim()} />;
}
