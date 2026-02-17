import React from 'react';
import SocialLinks from './SocialLinks';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Brand */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl font-bold font-varela text-primary tracking-wide">AURA VERDE</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 max-w-xs">
                        Llevando la naturaleza a tu hogar con las mejores suculentas.
                    </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Síguenos</span>
                    <SocialLinks />
                </div>

                {/* Copyright */}
                <div className="text-center md:text-right">
                    <p className="text-xs text-slate-400 dark:text-gray-500">
                        &copy; {new Date().getFullYear()} Aura Verde.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                        Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </footer>
    );
}
