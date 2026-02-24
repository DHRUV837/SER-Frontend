import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api, { API_URL } from "../api";

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);

    // UI State
    const [showWelcome, setShowWelcome] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);

    // Checklist State (Derived)
    const [checklist, setChecklist] = useState([]);
    const [progress, setProgress] = useState(0);

    // Initial Load Logic
    useEffect(() => {
        if (auth?.user) {
            checkOnboardingStatus();
        }
    }, [auth?.user]);

    const checkOnboardingStatus = async () => {
        try {
            setLoading(true);
            const isFirstLogin = !localStorage.getItem(`onboarding_seen_${auth.user.id}`);

            if (auth.user.role === "ADMIN") {
                // Fetch Counts Parallelly
                const [policiesRes, dealsRes, usersRes] = await Promise.allSettled([
                    api.get("/api/policy"),
                    api.get("/api/deals"),
                    api.get("/api/users")
                ]);

                const hasPolicies = policiesRes.status === 'fulfilled' && Array.isArray(policiesRes.value.data) && policiesRes.value.data.length > 0;
                const hasDeals = dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value.data) && dealsRes.value.data.length > 0;
                const userCount = usersRes.status === 'fulfilled' && Array.isArray(usersRes.value.data) ? usersRes.value.data.length : 0;

                // Proxy: If we have > 1 user (Admin + Sales), assume inviting is done. Targets logic pending backend support.
                const hasTeam = userCount > 1;

                const steps = [
                    { id: 'profile', label: 'Setup Company Profile', completed: true },
                    { id: 'invite', label: 'Invite Sales Team', completed: hasTeam, link: '/admin/users' },
                    { id: 'deal', label: 'Create First Deal', completed: hasDeals, link: '/admin/deals/create' },
                    { id: 'policy', label: 'Define Incentive Rules', completed: hasPolicies, link: '/admin/policies' },
                ];

                setChecklist(steps);
                calculateProgress(steps);

                if (isFirstLogin && steps.filter(s => s.completed).length < steps.length) {
                    setShowWelcome(true);
                    localStorage.setItem(`onboarding_seen_${auth.user.id}`, 'true');
                }
                // show checklist if incomplete
                setShowChecklist(steps.filter(s => s.completed).length < steps.length);

            } else if (auth.user.role === "SALES") {
                // Sales Logic
                const [dealsRes, payoutsRes] = await Promise.allSettled([
                    api.get(`/api/sales/my-deals/${auth.user.id}`),
                    api.get(`/api/sales/payouts/${auth.user.id}`)
                ]);

                const hasDeals = dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value.data) && dealsRes.value.data.length > 0;
                const hasPayouts = payoutsRes.status === 'fulfilled' && Array.isArray(payoutsRes.value.data) && payoutsRes.value.data.length > 0;

                const steps = [
                    { id: 'profile', label: 'Complete Profile', completed: true },
                    { id: 'deals', label: 'View Assigned Deals', completed: hasDeals, link: '/sales/my-deals' },
                    { id: 'earnings', label: 'Check Earnings', completed: hasPayouts, link: '/sales/payouts' }
                ];

                setChecklist(steps);
                calculateProgress(steps);

                if (isFirstLogin) {
                    setShowWelcome(true);
                    localStorage.setItem(`onboarding_seen_${auth.user.id}`, 'true');
                }
                setShowChecklist(steps.filter(s => s.completed).length < steps.length);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const calculateProgress = (steps) => {
        if (!steps || steps.length === 0) {
            setProgress(0);
            return;
        }
        const completed = steps.filter(s => s.completed).length;
        setProgress(Math.round((completed / steps.length) * 100));
    };

    const updateStep = (stepId, isCompleted) => {
        const newChecklist = checklist.map(step =>
            step.id === stepId ? { ...step, completed: isCompleted } : step
        );
        setChecklist(newChecklist);
        calculateProgress(newChecklist);
    };

    const dismissWelcome = () => setShowWelcome(false);
    const toggleChecklist = () => setShowChecklist(prev => !prev);

    return (
        <OnboardingContext.Provider value={{
            loading,
            showWelcome,
            showChecklist,
            checklist,
            progress,
            dismissWelcome,
            toggleChecklist,
            updateStep
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};
