import React, { Component } from "react";
import { BrowserRouter, Route, Routes,Navigate, useLocation } from "react-router-dom";
import Layout from "./assets/layouts/Layout";
import Dashboard from "./assets/pages/admin/Dashboard";
import AuthLayout from "./assets/layouts/AuthLayout";
import Login from "./assets/pages/auth/Login";
import Suratmasuk from "./assets/pages/admin/suratmasuk";
import AddSuratmasuk from "./assets/pages/admin/Addsuratmasuk";
import Suratkeluar from "./assets/pages/admin/Suratkeluar";
import AddSuratkeluar from "./assets/pages/admin/Addsuratkeluar";
import Transaksi from "./assets/pages/admin/Transakasi";
import AddTransaksi from "./assets/pages/admin/Addtransaksi";
import User from "./assets/pages/admin/user";
import AddUser from "./assets/pages/admin/Adduser";
import EditUser from "./assets/pages/admin/Edituser";

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const ProtectedRoute = ({ component : Component}) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" replace/>

}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={isAuthenticated() ? <Layout /> : <Navigate to='/login' replace/>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="suratmasuk" element={<Suratmasuk />} />
          <Route path="addsuratmasuk" element={<AddSuratmasuk />} />
          <Route path="suratkeluar" element={<Suratkeluar />} />
          <Route path="addsuratkeluar" element={<AddSuratkeluar />} />
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="addtransaksi" element={<AddTransaksi />} />
          <Route path="users" element={<User />} />
          <Route path="addusers" element={<AddUser />} />
          <Route path="editusers/:id" element={<EditUser />} />
        </Route>

        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
