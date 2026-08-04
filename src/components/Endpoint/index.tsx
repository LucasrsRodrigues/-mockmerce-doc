import React from 'react';

/**
 * Cabeçalho de endpoint reutilizável (MDX):
 *   <Endpoint method="POST" path="/v1/products" auth="X-API-Key" />
 */
export default function Endpoint({
  method,
  path,
  auth,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  auth?: string;
}): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        flexWrap: 'wrap',
        margin: '1.2rem 0 0.5rem',
      }}>
      <span className={`api-method api-method--${method.toLowerCase()}`}>{method}</span>
      <code style={{ fontSize: '0.95rem' }}>{path}</code>
      {auth && (
        <span style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>
          🔒 {auth}
        </span>
      )}
    </div>
  );
}
