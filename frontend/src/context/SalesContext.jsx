import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const { auth } = useAuth();
  const [deals, setDeals] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(100000);

  const userId = auth?.user?.id || auth?.id;

  useEffect(() => {
    if (userId) {
      fetchDeals(userId);
      fetchPerformance(userId);
    } else {
      setDeals([]);
    }
  }, [userId]);

  const fetchPerformance = async (targetUserId) => {
    try {
      const res = await api.get(`/performance?userId=${targetUserId}`);
      if (res.data && res.data.currentMonthTarget) {
        setMonthlyTarget(res.data.currentMonthTarget);
      }
    } catch (err) {
      console.error("Failed to fetch performance", err);
    }
  };

  const fetchDeals = async (targetUserId) => {
    // If targetUserId is provided, we fetch deals for THAT user (e.g. My Deals)
    // If NOT provided, we might be an Admin fetching ALL deals.

    let url = "/api/deals";
    const params = new URLSearchParams();

    // 1. If we want a SPECIFIC user's deals
    if (targetUserId) {
      params.append("userId", targetUserId);
    }

    // 2. ALWAYS pass the CURRENT USER ID as the Requestor for Security Context
    if (userId) {
      params.append("requestorId", userId);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await api.get(url);
      setDeals(res.data);
    } catch (err) {
      console.error("Failed to fetch deals", err);
      setDeals([]);
    }
  };

  const addDeal = async (deal) => {
    if (!userId) {
      alert("Please login again to save deals.");
      return;
    }

    try {
      const payload = { ...deal, user: { id: userId } };
      const res = await api.post("/api/deals", payload);
      setDeals([...deals, res.data]);
      fetchPerformance(userId); // Refresh performance data to update targets/tier
    } catch (err) {
      console.error("Failed to save deal", err);
      // Alert user if the error is likely due to stale session (User not found)
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to save deal. Please try logging out and in again.";
      alert("Error: " + msg);

      if (msg.includes("not found")) {
        // Optional: Could logout automatically here
      }
    }
  };

  const deleteDeal = (index) => {
    // Backend doesn't have delete endpoint yet!
    // For now, filter local state to simulate helper
    alert("Delete not supported on backend yet");
  };

  const updateDealStatus = async (id, newStatus) => {
    // Optimistic Update
    setDeals(deals.map(deal =>
      deal.id === id ? { ...deal, status: newStatus } : deal
    ));

    try {
      await api.patch(`/api/deals/${id}/status`, { status: newStatus });
      fetchPerformance(userId); // Refresh performance data
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure? For MVP, we just log.
    }
  };

  const updateMonthlyTarget = async (target) => {
    setMonthlyTarget(target);
    localStorage.setItem("monthlyTarget", target.toString());

    if (userId) {
      try {
        await api.put("/performance/target", { userId, target });
      } catch (err) {
        console.error("Failed to save target", err);
      }
    }
  };

  return (
    <SalesContext.Provider value={{
      deals,
      addDeal,
      deleteDeal,
      updateDealStatus,
      monthlyTarget,
      updateMonthlyTarget
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
