import { supabase } from '../lib/supabaseClient';
import domain from './domain';

export const fetchFontList = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const accesToken = session?.access_token;
        
        if (!accesToken) {
            throw new Error('No hay sesión activa');
        }

        const url = `${domain}/api/font-list`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la lista de fuentes: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en fetchFontList:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servicio de backend esté en ejecución.');
        }
        throw error;
    }
};
  
// Validate font data to ensure it's a valid font file
const validateFontData = async (blob) => {
  try {
    // Basic validation - check if the blob has content
    if (!blob || blob.size === 0) {
      throw new Error('El archivo de fuente está vacío');
    }

    // Check if the blob is a valid font file
    const arrayBuffer = await blob.arrayBuffer();
    const header = new Uint8Array(arrayBuffer, 0, 4);
    const signature = String.fromCharCode.apply(null, header);
    
    // Check for common font file signatures
    const validSignatures = [
      'wOFF', // WOFF
      'OTTO', // OTF with CFF
      'ttcf', // TrueType Collection
      '\x00\x01\x00\x00', // TrueType
      'true', // Apple TrueType
      'typ1' // PostScript Type 1
    ];

    if (!validSignatures.some(sig => signature.includes(sig))) {
      console.warn('El archivo puede no ser un archivo de fuente válido');
      // We'll still try to use it as it might be a valid font with an unknown signature
    }

    return blob;
  } catch (error) {
    console.error('Error validando la fuente:', error);
    throw new Error('El archivo de fuente no es válido');
  }
};

export const fetchFontFile = async (fontName) => {
    if (!fontName) {
        throw new Error('No se especificó el nombre de la fuente');
    }
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const accesToken = session?.access_token;
        
        if (!accesToken) {
            throw new Error('No hay sesión activa');
        }

        // Add cache busting to prevent stale cache issues
        const cacheBuster = new Date().getTime();
        const url = new URL(`${domain}/api/get-font/${encodeURIComponent(fontName)}`);
        url.searchParams.append('_', cacheBuster);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'font/woff2,font/woff,application/font-woff2,application/font-woff,application/font-sfnt',
                'Authorization': `Bearer ${accesToken}`
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error ${response.status} al obtener la fuente ${fontName}:`, errorText);
            throw new Error(`Error al obtener la fuente: ${response.statusText}`);
        }

        const blob = await response.blob();
        return await validateFontData(blob);
        
    } catch (error) {
        console.error('Error en fetchFontFile:', error);
        
        if (error.name === 'AbortError') {
            throw new Error('La solicitud de fuente ha excedido el tiempo de espera');
        } else if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
        } else if (error.message.includes('NetworkError')) {
            throw new Error('Error de red. Por favor, verifica tu conexión a internet.');
        }
        
        throw error;
    }
};