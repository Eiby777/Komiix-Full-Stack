import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';

const CTA = ({ setShowAuthModal }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription?.unsubscribe();
    }, []);

    const handleButtonClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            setShowAuthModal(true);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/50 dark:to-indigo-900/50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">¿Listo para revolucionar tu flujo de trabajo?</h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Únete a la comunidad de scanlators que ya están ahorrando horas de trabajo tedioso
                </p>
                <button
                    onClick={handleButtonClick}
                    className="relative inline-flex items-center px-8 py-4 overflow-hidden text-lg font-bold group bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                >
                    <span className="absolute w-full h-full transition-all duration-300 ease-out -translate-x-full bg-gradient-to-r from-blue-500 to-indigo-700 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-white transition-colors duration-300 ease-in-out group-hover:text-white flex items-center justify-center">
                        <span>Comienza Gratis Hoy</span>
                        <ChevronRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </button>
            </div>
        </section>
    );
};

export default CTA;