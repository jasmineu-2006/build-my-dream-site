import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LibraryProvider } from "@/context/LibraryContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import MyBooks from "@/pages/MyBooks";
import IssueReturn from "@/pages/IssueReturn";
import ManageBooks from "@/pages/ManageBooks";
import UserManagement from "@/pages/UserManagement";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LibraryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/my-books" element={<MyBooks />} />
              <Route path="/issue-return" element={<IssueReturn />} />
              <Route path="/manage-books" element={<ManageBooks />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LibraryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
