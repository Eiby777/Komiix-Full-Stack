import domain from "../../../../../../../../hooks/domain";
import axios from "axios";
import { supabase } from "../../../../../../../../lib/supabaseClient";

/**
 * Represents a single cropped image (recorte) with its associated data.
 */
class Recorte {
  constructor(image, id) {
    this.image = image;
    this.id = id; // Keeping id for debugging purposes
  }

  /**
   * Converts the image data to a base64 string, handling various input types.
   * @returns {Promise<string>} - The base64 representation of the image.
   */
  async toBase64() {
    if (typeof this.image === 'string' && this.image.startsWith('data:')) {
      // If already a data URL, extract just the base64 part
      return this.image.split(',')[1];
    } else if (typeof this.image === 'string') {
      // If already a plain base64 string
      return this.image;
    } else if (this.image instanceof File || this.image instanceof Blob) {
      // Convert File or Blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove data:image/...;base64, prefix if present
          const base64String = reader.result.split(',')[1] || reader.result;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(this.image);
      });
    }
    throw new Error('Unsupported image format provided for recorte.');
  }
}

/**
 * Handles the OCR processing for groups of cropped images.
 */
class OcrService {
  constructor(onProgress = () => {}) {
    this.onProgress = onProgress;
    this.processedRectangles = 0;
    this.totalRecortes = 0;
  }

  /**
   * Fetches the authentication token from Supabase.
   * @returns {Promise<string>} - The access token.
   * @throws {Error} - If the authentication token cannot be obtained.
   */
  async _getAccessToken() {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) {
      throw new Error('No se pudo obtener el token de autenticación.');
    }
    return accessToken;
  }

  /**
   * Calls the external OCR endpoint with the image data.
   * @param {string} imageBase64 - The base64 string of the image.
   * @param {string} accessToken - The authentication token.
   * @returns {Promise<Object>} - The response data from the OCR endpoint.
   * @private
   */
  async _callOcrApi(imageBase64, accessToken, language) {
    const response = await axios({
      method: 'post',
      url: `${domain}/api/ocr`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        image: imageBase64,
        language: language
      }
    });
    return response.data;
  }

  /**
   * Formats the raw OCR results into the desired structure.
   * @param {Object} ocrResults - The raw results from the OCR API.
   * @param {Object} originalRecorte - The original recorte object.
   * @returns {Object} - The formatted OCR result.
   * @private
   */
  _formatOcrResult(ocrResults, originalRecorte) {
    const combinedText = ocrResults.map((result) => result.text).join("\n");
    const confidence =
      ocrResults.length > 0
        ? ocrResults.reduce((sum, result) => sum + result.confidence, 0) / ocrResults.length
        : 0;

    const boundingBoxes = ocrResults.map((result) => ({
      text: result.text,
      confidence: result.confidence,
      bbox: result.bounding_box
    }));

    return {
      id: originalRecorte.id,
      text: combinedText,
      confidence,
      boundingBoxes
    };
  }

  /**
   * Processes a single cropped image (recorte) through the OCR endpoint.
   * @param {Recorte} recorte - The Recorte object to process.
   * @param {string} accessToken - The authentication token.
   * @returns {Promise<Object>} - The formatted OCR result for the recorte.
   * @private
   */
  async _processSingleRecorte(recorte, accessToken, language) {
    try {
      this.onProgress({ status: "recognizing text", progress: 0 }); // Simulate Tesseract-like progress

      const imageBase64 = await recorte.toBase64();
      
      const { results: ocrResults } = await this._callOcrApi(imageBase64, accessToken, language);
      
      return this._formatOcrResult(ocrResults, recorte);
    } catch (error) {
      console.error(`Error processing recorte ${recorte.id}:`, error);
      return {
        id: recorte.id,
        text: "",
        confidence: 0,
        boundingBoxes: []
      };
    } finally {
      this.processedRectangles += 1;
      this.onProgress({
        status: "recognizing text",
        progress: 1,
        recorteProgress: { current: this.processedRectangles, total: this.totalRecortes },
      });
    }
  }

  /**
   * Calls the OCR endpoint to process a group of cropped images and formats the response.
   * @param {Array<Array<Object>>} recorteGroups - Array of groups of cropped images,
   * each with an `image` (base64), `id`, `coords`, and `color`.
   * @returns {Promise<Array<Array<Object>>>} - Array of groups with formatted OCR results.
   * @throws {Error} - If the endpoint call fails or processing encounters an error.
   */
  async callOcrEndpoint(recorteGroups, language) {
    try {
      this.processedRectangles = 0; // Reset for a new call
      this.totalRecortes = recorteGroups.reduce((sum, group) => sum + group.length, 0);

      const accessToken = await this._getAccessToken();
      const allGroupResults = [];

      for (const group of recorteGroups) {
        const groupRecortes = group.map(r => new Recorte(r.image, r.id));
        const results = await Promise.all(
          groupRecortes.map(recorte => this._processSingleRecorte(recorte, accessToken, language))
        );
        allGroupResults.push(results);
      }

      return allGroupResults;
    } catch (error) {
      console.error("Error in OcrService.callOcrEndpoint:", error);
      throw error;
    }
  }
}

export default OcrService;