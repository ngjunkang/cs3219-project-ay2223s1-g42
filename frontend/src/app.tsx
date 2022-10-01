import { Suspense, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import shallow from "zustand/shallow";

import "./styles/globals.css";
import routes from "~react-pages";
import { LoadingLayout, AppLayout, ErrorPage } from "./components";
import { useGlobalStore } from "./store";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const App = () => {
  const { user, matchSocket, roomSocket } = useGlobalStore((state) => {
    return {
      user: state.user,
      matchSocket: state.matchSocket,
      roomSocket: state.roomSocket,
    };
  }, shallow);

  const allRoutes = useRoutes(routes);

  // useEffect(() => {
  //   if (!user) {
  //     navigate(`/login`);
  //   }
  // }, []);

  // connects to match and room socket servers
  useEffect(() => {
    if (!matchSocket) {
      console.error(
        "failed to connect to match socket server, match socket not set"
      );
      return;
    }
    if (!roomSocket) {
      console.error(
        "failed to connect to room socket server, room socket not set"
      );
      return;
    }
    if (!user) {
      console.error("failed to connect to socket servers, user not logged in");
      return;
    }
    console.log("connecting to socket servers...");
    matchSocket.connect();
    roomSocket.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      console.log("disconnecting from socket servers...");
      matchSocket.disconnect();
      roomSocket.disconnect();
    };
  }, [user]);

  if (!allRoutes) {
    return <ErrorPage />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingLayout />}>
        <AppLayout>{allRoutes}</AppLayout>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
