#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/aes.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
unsigned char* reconstruct_model(
    unsigned char** fragments,
    int* fragment_lengths,
    int num_fragments,
    int encrypted_fragment_index,
    unsigned char* encryption_key,
    int key_length,
    int* output_length
) {
    // Calcular tamaño total
    int total_length = 0;
    for (int i = 0; i < num_fragments; i++) {
        total_length += fragment_lengths[i];
    }

    // Reservar memoria para el modelo reconstruido
    unsigned char* reconstructed = (unsigned char*)malloc(total_length);
    if (!reconstructed) {
        return NULL;
    }

    // Copiar fragmentos no encriptados
    int offset = 0;
    for (int i = 0; i < num_fragments; i++) {
        if (i != encrypted_fragment_index) {
            memcpy(reconstructed + offset, fragments[i], fragment_lengths[i]);
            offset += fragment_lengths[i];
        }
    }

    // Desencriptar el fragmento encriptado
    if (encrypted_fragment_index >= 0 && encrypted_fragment_index < num_fragments) {
        unsigned char* encrypted_data = fragments[encrypted_fragment_index];
        int encrypted_length = fragment_lengths[encrypted_fragment_index];

        // Extraer IV (primeros 16 bytes)
        unsigned char iv[AES_BLOCK_SIZE];
        if (encrypted_length < AES_BLOCK_SIZE) {
            free(reconstructed);
            return NULL;
        }
        memcpy(iv, encrypted_data, AES_BLOCK_SIZE);
        encrypted_data += AES_BLOCK_SIZE;
        encrypted_length -= AES_BLOCK_SIZE;

        // Inicializar AES
        AES_KEY dec_key;
        if (AES_set_decrypt_key(encryption_key, key_length * 8, &dec_key) < 0) {
            free(reconstructed);
            return NULL;
        }

        // Desencriptar
        unsigned char* decrypted = (unsigned char*)malloc(encrypted_length);
        if (!decrypted) {
            free(reconstructed);
            return NULL;
        }
        AES_cbc_encrypt(
            encrypted_data,
            decrypted,
            encrypted_length,
            &dec_key,
            iv,
            AES_DECRYPT
        );

        // Remover padding PKCS7
        int padding = decrypted[encrypted_length - 1];
        int decrypted_length = encrypted_length - padding;
        if (padding < 1 || padding > AES_BLOCK_SIZE || decrypted_length < 0) {
            free(decrypted);
            free(reconstructed);
            return NULL;
        }

        // Copiar fragmento desencriptado
        memcpy(reconstructed + offset, decrypted, decrypted_length);
        offset += decrypted_length;
        free(decrypted);
    }

    *output_length = offset;
    return reconstructed;
}

EMSCRIPTEN_KEEPALIVE
void free_model(unsigned char* model) {
    if (model) {
        free(model);
    }
}
