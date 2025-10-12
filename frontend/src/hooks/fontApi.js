import { supabase } from '../lib/supabaseClient';
import domain from './domain';
import fontManager from '../lib/fontManager';

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

        // Try to get font from cache first
        try {
            const isCached = await fontManager.isFontCached(fontId);
            if (isCached) {
                // Return blob URL for cached font
                const blobUrl = await fontManager.getFontBlobUrl(fontId);
                console.info(`Using cached font for ${fontId}`);
                return blobUrl;
            }
        } catch (cacheError) {
            console.warn(`Cache check failed for font ${fontId}, falling back to network:`, cacheError);
        }

        // Fallback to network URL
        return `${domain}/api/font-url/${fontId}?token=${encodeURIComponent(accessToken)}`;
    } catch (error) {
        console.error('Error en getFontUrl:', error);
        throw error;
    }
};

/**
 * Load font using FontManager (preferred method)
 * This ensures fonts are cached and loaded efficiently
 */
export const loadFont = async (fontId) => {
    try {
        return await fontManager.loadFont(fontId);
    } catch (error) {
        console.error(`Error loading font ${fontId}:`, error);
        throw error;
    }
};

/**
 * Load multiple fonts in parallel
 */
export const loadFonts = async (fontIds) => {
    try {
        const results = await fontManager.loadFonts(fontIds);
        return results;
    } catch (error) {
        console.error('Error loading fonts:', error);
        throw error;
    }
};

/**
 * Preload fonts for a project
 */
export const preloadProjectFonts = async (fontIds) => {
    if (!fontIds || fontIds.length === 0) {
        console.log('No fonts to preload');
        return;
    }

    console.log('Preloading fonts:', fontIds);
    try {
        await loadFonts(fontIds);
        console.log('All project fonts preloaded successfully');
    } catch (error) {
        console.error('Error preloading project fonts:', error);
        // Don't throw - allow project to load with missing fonts
    }
};

/**
 * Get font cache status
 */
export const getFontCacheStatus = async (fontId) => {
    try {
        return await fontManager.getFontStatus(fontId);
    } catch (error) {
        console.error(`Error getting cache status for font ${fontId}:`, error);
        return { cached: false, loaded: false, blobUrl: null };
    }
};

/**
 * Clear font cache
 */
export const clearFontCache = async () => {
    try {
        await fontManager.clearCache();
        console.info('Font cache cleared');
    } catch (error) {
        console.error('Error clearing font cache:', error);
        throw error;
    }
};

/**
 * Get font storage statistics
 */
export const getFontStorageStats = async () => {
    try {
        return await fontManager.getStorageStats();
    } catch (error) {
        console.error('Error getting font storage stats:', error);
        return null;
    }
};

// Legacy function for backward compatibility - now returns blob from cache or network
export const fetchFontFile = async (fontId) => {
    try {
        // Try to get from cache first
        const isCached = await fontManager.isFontCached(fontId);
        if (isCached) {
            const cachedFont = await fontManager.getFont(fontId);
            return cachedFont.blob;
        }

        // Fallback to network
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