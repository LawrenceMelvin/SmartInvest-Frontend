import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Plan from "./components/plan";
import Results from "./components/results";
import HomeLoanAdvisor from "./components/HomeLoanAdvisor";
import Dashboard from "./components/Dashboard";
import AddGoal from "./components/AddGoal";
import GoalInsights from "./components/GoalInsights";
import SmartSIPAdjuster from "./components/SmartSIPAdjuster";
import SuggestionsView from "./components/SuggestionsView";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/results" element={<Results />} />
          <Route path="/home-loan" element={<HomeLoanAdvisor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-goal" element={<AddGoal />} />
          <Route path="/goal-insights" element={<GoalInsights />} />
          <Route path="/goal-insights/:id" element={<GoalInsights />} />
          <Route path="/smart-sip-adjuster" element={<SmartSIPAdjuster />} />
          <Route path="/suggestions" element={<SuggestionsView />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
