import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Fuel,
  Users,
  Wrench,
  Building,
  Zap,
  Shield,
  CreditCard,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { ExpenseRecord } from '../types';

export const OperatingExpensesModule: React.FC = () => {
  const { expenses, addExpense, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form state
  const [newCat, setNewCat] = useState<ExpenseRecord['category']>('Fuel');
  const [newAmount, setNewAmount] = useState<number>(85000);
  const [newDesc, setNewDesc] = useState('');
  const [newPaidTo, setNewPaidTo] = useState('');
  const [newPaidFrom, setNewPaidFrom] = useState<ExpenseRecord['paidFrom']>('Cash Drawer');
  const [newPlate, setNewPlate] = useState('RAD 482 B');
  const [newReceipt, setNewReceipt] = useState(`EXP-26-${Math.floor(1000 + Math.random() * 9000)}`);

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.vehiclePlate && e.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchPay = selectedPayment === 'all' || e.paidFrom === selectedPayment;
    return matchSearch && matchCat && matchPay;
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenses = expenses.filter((e) => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
  const maintenanceExpenses = expenses.filter((e) => e.category === 'Vehicle Maintenance').reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newPaidTo || !newAmount) {
      showToast('Please fill all required expense fields');
      return;
    }

    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: newCat,
      amount: Number(newAmount),
      description: newDesc,
      paidTo: newPaidTo,
      paidFrom: newPaidFrom,
      approvedBy: 'Jean-Paul Habimana',
      receiptNumber: newReceipt,
      vehiclePlate: newCat === 'Fuel' || newCat === 'Vehicle Maintenance' ? newPlate : undefined
    });

    showToast(`Expense voucher ${newReceipt} recorded (RWF ${Number(newAmount).toLocaleString()})`);
    setShowAddModal(false);
    setNewDesc('');
    setNewPaidTo('');
    setNewReceipt(`EXP-26-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A36A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Financial Control
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Voucher Management</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Operating Expenses & Petty Cash Ledger
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '4px' }}>
            Track fleet fuel, driver daily allowances, repairs, and depot maintenance costs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Expense voucher export generated (Excel/CSV)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '9px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13.5px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Export Ledger
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#16A36A',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(22, 163, 106, 0.25)'
            }}
          >
            <Plus size={16} />
            Record Expense Voucher
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
            Total OPEX This Month
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            RWF {totalExpenseAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, marginTop: '6px' }}>
            Within 92% of monthly budget limit
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
            Fleet Fuel (SP & Engen)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8' }}>
            RWF {fuelExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            6 delivery trucks & tricycles
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
            Vehicle Repairs & Servicing
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FBBF24' }}>
            RWF {maintenanceExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            Tire replacements & brake servicing
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
            Cash Drawer Petty Cash
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399' }}>
            RWF 1,450,000
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            Reconciled with Cashier daily
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '8px 14px' }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search by description, vendor, receipt #, or truck plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13.5px', color: '#FFFFFF' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '13px', backgroundColor: '#07152E', color: '#FFFFFF' }}
          >
            <option value="all">All Categories</option>
            <option value="Fuel">Fuel</option>
            <option value="Salaries">Salaries</option>
            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
            <option value="Warehouse Rent">Warehouse Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Insurance">Insurance</option>
            <option value="Marketing">Marketing</option>
            <option value="Internet & IT">Internet & IT</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>Paid From:</span>
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '13px', backgroundColor: '#07152E', color: '#FFFFFF' }}
          >
            <option value="all">All Sources</option>
            <option value="Cash Drawer">Cash Drawer</option>
            <option value="Bank Account (BK)">Bank Account (BK)</option>
            <option value="MoMo Corporate">MoMo Corporate</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#08132A', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontWeight: 600, fontSize: '12.5px' }}>
              <th style={{ padding: '12px 20px' }}>Receipt / Date</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Description</th>
              <th style={{ padding: '12px 16px' }}>Paid To / Vendor</th>
              <th style={{ padding: '12px 16px' }}>Payment Channel</th>
              <th style={{ padding: '12px 16px' }}>Approved By</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>Amount (RWF)</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{exp.receiptNumber}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{exp.date}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor:
                        exp.category === 'Fuel'
                          ? 'rgba(52, 120, 246, 0.15)'
                          : exp.category === 'Vehicle Maintenance'
                          ? 'rgba(242, 169, 59, 0.15)'
                          : exp.category === 'Salaries'
                          ? 'rgba(22, 163, 106, 0.15)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color:
                        exp.category === 'Fuel'
                          ? '#60A5FA'
                          : exp.category === 'Vehicle Maintenance'
                          ? '#FBBF24'
                          : exp.category === 'Salaries'
                          ? '#34D399'
                          : '#CBD5E1'
                    }}
                  >
                    {exp.category}
                  </span>
                  {exp.vehiclePlate && (
                    <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600, marginTop: '3px' }}>
                      {exp.vehiclePlate}
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px', color: '#FFFFFF', maxWidth: '280px' }}>
                  {exp.description}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#CBD5E1' }}>
                  {exp.paidTo}
                </td>
                <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12.5px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: exp.paidFrom === 'Cash Drawer' ? '#16A36A' : exp.paidFrom === 'MoMo Corporate' ? '#F2A93B' : '#3478F6', marginRight: '6px' }} />
                  {exp.paidFrom}
                </td>
                <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12.5px' }}>
                  {exp.approvedBy}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#FFFFFF' }}>
                  RWF {exp.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Expense Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 18, 32, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0B1733', borderRadius: '14px', width: '550px', maxWidth: '90vw', padding: '26px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(22, 163, 106, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={20} color="#34D399" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Record Expense Voucher</h3>
                  <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0 0' }}>Assign funds to fleet, logistics, or operations</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Expense Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                >
                  <option value="Fuel">Fuel (Diesel for Fleet)</option>
                  <option value="Vehicle Maintenance">Vehicle Maintenance & Tires</option>
                  <option value="Salaries">Driver & Offloader Daily Allowances</option>
                  <option value="Warehouse Rent">Warehouse Rent</option>
                  <option value="Utilities">Electricity & Cold Chain</option>
                  <option value="Internet & IT">Internet & DistributorOS IT</option>
                  <option value="Miscellaneous">Miscellaneous Depot Expense</option>
                </select>
              </div>

              {(newCat === 'Fuel' || newCat === 'Vehicle Maintenance') && (
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Truck Plate Number</label>
                  <select
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                  >
                    <option value="RAD 482 B">RAD 482 B (Mitsubishi Canter 4T)</option>
                    <option value="RAE 109 K">RAE 109 K (Fuso Fighter 8T)</option>
                    <option value="RAC 921 P">RAC 921 P (Isuzu ELF 3.5T)</option>
                    <option value="RAF 334 T">RAF 334 T (Piaggio Tricycle)</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Amount (RWF)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Payment Channel</label>
                  <select
                    value={newPaidFrom}
                    onChange={(e) => setNewPaidFrom(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                  >
                    <option value="Cash Drawer">Cash Drawer</option>
                    <option value="Bank Account (BK)">Bank Account (BK)</option>
                    <option value="MoMo Corporate">MoMo Corporate (MTN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Paid To / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. SP Petrol Gikondo, Garage Moderne, etc."
                  value={newPaidTo}
                  onChange={(e) => setNewPaidTo(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>Description / Purpose</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Diesel 60L for Remera-Kicukiro delivery run..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', backgroundColor: '#07152E', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.16)', background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#16A36A', color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
                >
                  Confirm & Print Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
