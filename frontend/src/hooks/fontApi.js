import { supabase } from '../lib/supabaseClient';
import domain from './domain';

export const fetchFontList = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const accesToken = session.access_token;
    const response = await fetch(domain + '/api/font-list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch font list: ${response.statusText}`);
    }
  
    return await response.json();
  };
  
  export const fetchFontFile = async (fontName) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accesToken = session.access_token;
    const response = await fetch(`${domain}/api/get-font/${encodeURIComponent(fontName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch font file: ${response.statusText}`);
    }
  
    return await response.arrayBuffer();
  };