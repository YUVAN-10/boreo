import { createContext, useContext, useMemo } from "react";

const PointsContext = createContext({ monthlyPoints: [], loading: false });

export function PointsProvider({ children }) {
  const value = useMemo(() => ({ monthlyPoints: [], loading: false }), []);
  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  return useContext(PointsContext);
}
