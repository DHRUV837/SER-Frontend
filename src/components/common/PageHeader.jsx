import React from 'react';

/**
 * PageHeader Component
 * 
 * Enterprise-grade page header with heading and subtitle
 * Designed for professional SaaS UI with full light/dark mode support
 * 
 * @param {string} heading - Main page heading (communicates value/purpose)
 * @param {string} subtitle - Brief explanation of what user can do
 * @param {React.ReactNode} icon - Optional icon element
 * @param {React.ReactNode} actions - Optional action buttons/components
 */
const PageHeader = ({ heading, subtitle, icon, actions }) => {
    return (
        <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {/* Heading Section */}
                    <div className="flex items-center gap-3 mb-2">
                        {icon && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
                                {icon}
                            </div>
                        )}
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                            {heading}
                        </h1>
                    </div>

                    {/* Subtitle Section */}
                    {subtitle && (
                        <p className="text-base text-text-muted leading-relaxed mt-1 max-w-3xl">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Actions Section */}
                {actions && (
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
