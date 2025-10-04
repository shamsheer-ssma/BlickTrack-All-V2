// Custom hook
import { useState } from 'react';

export function useThreatModel() {
  const [model, setModel] = useState<any>(null);
  return { model, setModel };
}