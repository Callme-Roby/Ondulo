import React from 'react';

/**
 * Native: the app already fills the device screen, so the frame is a no-op.
 * The web version lives in WebFrame.web.tsx.
 */
export default function WebFrame({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
