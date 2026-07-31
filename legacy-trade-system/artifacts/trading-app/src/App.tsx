import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TemplateLayout } from "@/components/custom/template-layout";
import { LogoSrcProvider } from "@/components/custom/logo-src-provider";
import NotFound from "@/pages/not-found";
import DigitsPage from "@/pages/digits";
import ReportsPage from "@/pages/reports";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={DigitsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LogoSrcProvider logoSrc={null}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <TemplateLayout>
            <Router />
          </TemplateLayout>
        </WouterRouter>
      </LogoSrcProvider>
    </QueryClientProvider>
  );
}

export default App;
