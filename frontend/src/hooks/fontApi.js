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
  
export const fetchFontFile = async (fontName) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const accesToken = session?.access_token;
        
        if (!accesToken) {
            throw new Error('No hay sesión activa');
        }
        
        if (!fontName) {
            throw new Error('No se especificó el nombre de la fuente');
        }

        const response = await fetch(`${domain}/api/get-font/${encodeURIComponent(fontName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accesToken}`
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