"use server"

import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const isMobileDevice = (): boolean => {
  if (typeof process === 'undefined') {
    throw new Error('[Server method] you are importing a server-only module outside of server');
  }

  const { get } = headers();
  const ua: string | null = get('user-agent');

  const device: UAParser.IDevice = new UAParser(ua || '').getDevice();

  return device.type === 'mobile';
};