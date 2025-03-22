import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import OrdersPage from './pages/OrdersPage';
import EquipmentsPage from './pages/EquipmentsPage';
import CustomersPage from './pages/CustomersPage';
import CalendarPage from './pages/CalendarPage';
import CaptureImage from './pages/CaptureImage';
import HandoversPage from './pages/HandoverPage';
import HandoverDetailPage from './pages/HandoverDetailPage';
import HandoverForm from './components/HandoverForm';

function App(): React.ReactElement {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/equipments" element={<EquipmentsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/handovers" element={<HandoversPage />} />
            <Route path="/handover/create" element={<HandoverForm />} />
            <Route path="/handover/:id" element={<HandoverDetailPage />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;