import React from 'react';

export interface CSRFTokenInputProps {
  token: string;
}

export function CSRFTokenInput({ token }: CSRFTokenInputProps): JSX.Element {
  return (
    <input
      type="hidden"
      name="_csrf"
      value={token}
    />
  );
}
