from supabase import create_client, Client
from os import getenv
from dotenv import load_dotenv

load_dotenv()

class SupabaseConfig:
    SUPABASE_URL: str = getenv("SUPABASE_URL")
    SUPABASE_KEY: str = getenv("SUPABASE_KEY")
    SUPABASE_JWT_SECRET: str = getenv("SUPABASE_JWT_SECRET")
    
    @staticmethod
    def get_client() -> Client:
        return create_client(
            SupabaseConfig.SUPABASE_URL,
            SupabaseConfig.SUPABASE_KEY
        )