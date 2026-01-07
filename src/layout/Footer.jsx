
import { ROUTES } from "@/routes";
import React from "react";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkgray)] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <img 
                                    src="/logo.png" 
                                    alt="Trip Planner Logo" 
                                    className="h-12 w-12 object-contain"
                                />
                                <span className="text-3xl font-bold bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-info)] bg-clip-text text-transparent">
                                    Trip Planner
                                </span>
                            </div>
                            <p className="text-[var(--color-darklink)] text-lg leading-relaxed mb-6 max-w-md">
                                Your personal AI-powered travel companion. Create amazing itineraries tailored to your preferences and budget.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-[var(--color-lightinfo)] rounded-xl flex items-center justify-center hover:bg-[var(--color-info)] transition-colors duration-200 cursor-pointer">
                                    <div className="w-5 h-5 bg-[var(--color-info)] rounded-md"></div>
                                </div>
                                <div className="w-10 h-10 bg-[var(--color-lightsuccess)] rounded-xl flex items-center justify-center hover:bg-[var(--color-success)] transition-colors duration-200 cursor-pointer">
                                    <div className="w-5 h-5 bg-[var(--color-success)] rounded-md"></div>
                                </div>
                                <div className="w-10 h-10 bg-[var(--color-lightwarning)] rounded-xl flex items-center justify-center hover:bg-[var(--color-warning)] transition-colors duration-200 cursor-pointer">
                                    <div className="w-5 h-5 bg-[var(--color-warning)] rounded-md"></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a 
                                        href={ROUTES.HOME} 
                                        className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-2 h-2 bg-[var(--color-info)] rounded-full mr-3 group-hover:bg-[var(--color-secondary)] transition-colors duration-200"></span>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href={ROUTES.CREATE_TRIP} 
                                        className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-2 h-2 bg-[var(--color-info)] rounded-full mr-3 group-hover:bg-[var(--color-secondary)] transition-colors duration-200"></span>
                                        Create Trip
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href={ROUTES.MY_TRIPS} 
                                        className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-2 h-2 bg-[var(--color-info)] rounded-full mr-3 group-hover:bg-[var(--color-secondary)] transition-colors duration-200"></span>
                                        My Trips
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href={ROUTES.COMMUNITY} 
                                        className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-2 h-2 bg-[var(--color-info)] rounded-full mr-3 group-hover:bg-[var(--color-secondary)] transition-colors duration-200"></span>
                                        Community
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="#contact" 
                                        className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-2 h-2 bg-[var(--color-info)] rounded-full mr-3 group-hover:bg-[var(--color-secondary)] transition-colors duration-200"></span>
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                            <ul className="space-y-3">
                                <li>
                                    <span className="text-[var(--color-darklink)] flex items-center">
                                        <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></span>
                                        AI Trip Planning
                                    </span>
                                </li>
                                <li>
                                    <span className="text-[var(--color-darklink)] flex items-center">
                                        <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></span>
                                        Budget Optimization
                                    </span>
                                </li>
                                <li>
                                    <span className="text-[var(--color-darklink)] flex items-center">
                                        <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></span>
                                        Personalized Itinerary
                                    </span>
                                </li>
                                <li>
                                    <span className="text-[var(--color-darklink)] flex items-center">
                                        <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></span>
                                        Real-time Updates
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--color-darkborder)]"></div>

                {/* Bottom Footer */}
                <div className="py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-[var(--color-darklink)] text-sm">
                            © {currentYear} Trip Planner - Ngoc Bich. 
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a 
                                href="#privacy" 
                                className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                            >
                                Privacy Policy
                            </a>
                            <a 
                                href="#terms" 
                                className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                            >
                                Terms of Service
                            </a>
                            <a 
                                href="#support" 
                                className="text-[var(--color-darklink)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
