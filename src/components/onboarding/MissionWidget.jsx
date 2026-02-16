import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Map, Rocket, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MissionWidget = () => {
    const { showChecklist, checklist, progress, toggleChecklist } = useOnboarding();
    const { auth } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);

    if (!showChecklist) return null;

    const role = auth?.user?.role || "SALES";

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
            <div className="bg-surface-1 border border-border-subtle rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Header */}
                <div
                    className="p-4 bg-gradient-to-r from-primary-900/80 to-surface-1 flex items-center justify-between cursor-pointer border-b border-border-subtle group"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <svg className="w-8 h-8 transform -rotate-90">
                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-surface-3" />
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray={88}
                                    strokeDashoffset={Number.isFinite(progress) ? 88 - (88 * progress) / 100 : 88}
                                    className="text-emerald-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-primary">
                                {Number.isFinite(progress) ? progress : 0}%
                            </span>
                        </div>
                        {isExpanded && <span className="text-sm font-semibold text-text-primary">Getting Started</span>}
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" /> : <ChevronUp className="w-4 h-4 text-text-muted" />}
                </div>

                {/* Content */}
                {isExpanded && (
                    <div className="p-4 space-y-1 bg-surface-1/50 backdrop-blur-sm">
                        <div className="text-xs text-text-muted mb-3 uppercase tracking-wider font-bold pl-1">
                            {role === 'ADMIN' ? 'Setup Workspace' : 'Your First Steps'}
                        </div>

                        {checklist.map((step) => {
                            const ItemWrapper = !step.completed && step.link ? Link : 'div';
                            const wrapperProps = !step.completed && step.link ? { to: step.link } : {};

                            return (
                                <ItemWrapper
                                    key={step.id}
                                    {...wrapperProps}
                                    className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent
                                    ${step.completed
                                            ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10'
                                            : 'bg-surface-2/50 hover:bg-surface-2 hover:border-primary-500/30 text-text-secondary hover:text-text-primary cursor-pointer hover:shadow-lg hover:translate-x-1'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {step.completed ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-text-muted flex-shrink-0 group-hover:border-primary-500 group-hover:bg-primary-500/10 transition-colors" />
                                        )}
                                        <span className={`text-sm font-medium ${step.completed ? 'opacity-70 line-through decoration-emerald-500/50' : ''}`}>
                                            {step.label}
                                        </span>
                                    </div>

                                    {!step.completed && (
                                        <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
                                    )}
                                </ItemWrapper>
                            );
                        })}

                        <div className="mt-3 pt-3 border-t border-border-subtle">
                            <p className="text-xs text-text-muted text-center">
                                Complete setup to unlock specific features.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionWidget;
