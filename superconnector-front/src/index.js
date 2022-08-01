import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { Suspense } from "react";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </RecoilRoot>
);
