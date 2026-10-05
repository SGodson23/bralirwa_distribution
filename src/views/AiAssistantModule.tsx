import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Users,
  Boxes,
  Truck,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  richContent?: React.ReactNode;
}

export const AiAssistantModule: React.FC = () => {
  const { customers, inventory, emptiesSummary, profitLoss, salesOrders, currentTenant, setCurrentNav, showToast } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'assistant',
      timestamp: '08:30 AM',
      text: `Mwaramutse! I am your DistributorOS AI Operations Copilot for **${currentTenant.name}**. I have full real-time visibility into your warehouse inventory, retailer credit exposure, delivery truck telematics, and empty crate balances across Kigali. How can I assist your operations today?`
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const suggestedPrompts = [
    'Which retailers have overdue debt exceeding 1,000,000 RWF?',
    'What is our current empty crate deficit with BRALIRWA?',
    'Simulate profit if diesel price increases by 10%',
    'Which SKUs need urgent restocking from Gisenyi Brewery?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: ChatMessage;

      if (query.toLowerCase().includes('debt') || query.toLowerCase().includes('overdue')) {
        const topDebtors = customers.filter((c) => c.currentExposure > 1000000);
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Found **${topDebtors.length} retailers** with current credit balances exceeding 1,000,000 RWF. Total exposure in this group is **RWF ${topDebtors.reduce((s, c) => s + c.currentExposure, 0).toLocaleString()}**.`,
          richContent: (
            <div style={{ marginTop: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: 'rgba(5, 14, 34, 0.7)' }}>
                  <tr style={{ textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '10px 14px' }}>Retailer</th>
                    <th style={{ padding: '10px 14px' }}>Sector</th>
                    <th style={{ padding: '10px 14px' }}>Credit Limit</th>
                    <th style={{ padding: '10px 14px' }}>Exposure</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topDebtors.slice(0, 4).map((c) => (
                    <tr key={c.id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#FFFFFF' }}>{c.name}</td>
                      <td style={{ padding: '10px 14px', color: '#CBD5E1' }}>{c.sector}</td>
                      <td style={{ padding: '10px 14px', color: '#BAE6FD' }}>RWF {c.creditLimit.toLocaleString()}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#FB7185' }}>
                        RWF {c.currentExposure.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: c.status === 'blocked' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: c.status === 'blocked' ? '#FB7185' : '#FBBF24' }}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        };
      } else if (query.toLowerCase().includes('crate') || query.toLowerCase().includes('deficit') || query.toLowerCase().includes('empties')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Your total empty crate fleet is **${emptiesSummary.totalDistributorCrates.toLocaleString()} crates** (valued at **RWF ${emptiesSummary.totalAssetValueRWF.toLocaleString()}**). Here is where your empty crates are right now:`,
          richContent: (
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.65)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700 }}>At Retailer Bars</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FB7185' }}>{emptiesSummary.atCustomers.toLocaleString()} Crates</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Owed by 184 customers</div>
              </div>
              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.65)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700 }}>In Warehouses</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399' }}>{emptiesSummary.inWarehouse.toLocaleString()} Crates</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Ready for Gisenyi backhaul</div>
              </div>
              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.65)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 700 }}>Damaged / Dispute</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FBBF24' }}>{emptiesSummary.damaged + emptiesSummary.missingInDispute} Crates</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Deposit claimed</div>
              </div>
            </div>
          )
        };
      } else if (query.toLowerCase().includes('fuel') || query.toLowerCase().includes('simulate') || query.toLowerCase().includes('diesel')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `**Simulation Result (Fuel +10%):**\n\n- Current monthly fleet diesel cost: **RWF 3,120,000**\n- New estimated diesel cost: **RWF 3,432,000** (+RWF 312,000)\n- Net operating margin impact: **-0.28%** (from 10.9% to 10.62%)\n\n**AI Recommendation:** Consolidate Kigali-Gasabo delivery drops from 4 runs per week to 3 multi-drop loads, reducing total mileage by 180 km and offsetting the entire RWF 312,000 price rise.`
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Analysis complete. Based on current sales velocity and warehouse buffers, today's top-selling brand is **Primus 50cl** with 480 crates dispatched since 07:00 AM. Total revenue collected today is **RWF 18,420,500**. Would you like me to generate a summary for the General Manager?`
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Intelligence Suite
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>BRALIRWA AI Operations Copilot</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            DistributorOS AI Assistant
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Ask natural language questions about sales, logistics, empty crate deficits, and profitability
          </p>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Reset Conversation
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#CBD5E1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} color="#A78BFA" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '18px'
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(167, 139, 250, 0.2)',
                    border: '1px solid rgba(167, 139, 250, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot size={20} color="#A78BFA" />
                </div>
              )}

              <div
                style={{
                  backgroundColor: isUser ? 'rgba(56, 189, 248, 0.18)' : 'rgba(8, 22, 50, 0.85)',
                  color: '#FFFFFF',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: isUser ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                {m.richContent}
                <div style={{ fontSize: '11px', color: isUser ? '#BAE6FD' : '#94A3B8', marginTop: '6px', textAlign: 'right' }}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(167, 139, 250, 0.2)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={20} color="#A78BFA" />
            </div>
            <div style={{ backgroundColor: 'rgba(8, 22, 50, 0.85)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '13px', color: '#94A3B8' }}>
              Analyzing real-time distributor data...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="glass-card"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          padding: '8px 12px'
        }}
      >
        <input
          type="text"
          placeholder="Ask anything about Kigali routes, Primus/Mützig inventory, cash, or debtors..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '14px',
            padding: '10px 12px',
            color: '#FFFFFF'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '11px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
            transition: 'all 0.15s ease'
          }}
        >
          <Send size={15} />
          Ask Copilot
        </button>
      </form>
    </div>
  );
};
