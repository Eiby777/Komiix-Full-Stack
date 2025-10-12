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
  
export const getFontUrl = async (fontId) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
            throw new Error('No hay sesión activa');
        }

        if (!fontId) {
            throw new Error('No se especificó el ID de la fuente');
        }

        // Return the direct font URL using font ID (no encoding needed for IDs)
        return `${domain}/api/font-url/${fontId}?token=${encodeURIComponent(accessToken)}`;
    } catch (error) {
        console.error('Error en getFontUrl:', error);
        throw error;
    }
};

// Legacy function for backward compatibility - now returns blob from URL
export const fetchFontFile = async (fontId) => {
    try {
        const fontUrl = await getFontUrl(fontId);
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        // For legacy compatibility, make direct request with Authorization header
        const response = await fetch(`${domain}/api/font-url/${fontId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el archivo de la fuente: ${response.statusText}`);
        }

        return await response.blob();
    } catch (error) {
        console.error('Error en fetchFontFile:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servicio de backend esté en ejecución.');
        }
        throw error;
    }
};