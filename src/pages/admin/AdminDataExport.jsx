import React, { useState, useEffect } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Lock,
  Calendar,
  Plus,
  FileText,
  CheckCircle2,
  X,
  ChevronRight,
  Database,
  Filter,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_export_jobs';

// seed data lives in src/data/json (DEFAULT_JOBS)

export default function AdminDataExport() {
  const { items: jobs, setItems: setJobs } = useCollection('exportJobs');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('Client Registry');
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');
  const [successBanner, setSuccessBanner] = useState(null);


  const triggerDownload = (fileName, format, content) => {
    const mimeType = format === 'JSON' ? 'application/json' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJob = (job) => {
    let dummyContent = '';
    if (job.format === 'JSON') {
      dummyContent = JSON.stringify(
        [
          {
            exportId: job.id,
            dataset: job.dataset,
            recordsCount: job.records,
            timestamp: new Date().toISOString(),
            status: 'Delivered',
            sampleData: [
              { id: 1, name: 'Sample Record 1', value: 1250.0, status: 'Active' },
              { id: 2, name: 'Sample Record 2', value: 3400.5, status: 'Completed' },
            ],
          },
        ],
        null,
        2
      );
    } else {
      dummyContent =
        'Record ID,Reference,Dataset,Category,Amount,Currency,Timestamp,Status\n' +
        `1,REC-001,${job.dataset},General,5000.00,USD,${job.createdAt},Processed\n` +
        `2,REC-002,${job.dataset},Trading,12450.50,USD,${job.createdAt},Verified\n` +
        `3,REC-003,${job.dataset},Settlement,890.00,USD,${job.createdAt},Settled\n`;
    }

    triggerDownload(job.name, job.format, dummyContent);
    setSuccessBanner(`Export file ${job.name}.${job.format.toLowerCase()} downloaded successfully.`);
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  const handleCreateExport = (e) => {
    e.preventDefault();

    const recordCounts = {
      'Client Registry': 12480,
      'Treasury & Finance': 8940,
      'Dealing Desk': 154200,
      'IB & Partnerships': 4830,
      'PAMM Pool Allocations': 3210,
    };

    const count = recordCounts[selectedDataset] || 5000;
    const formattedDataset = selectedDataset.replace(/\s+/g, '_');
    const formattedRange = selectedDateRange.replace(/\s+/g, '_');
    const exportName = `${formattedDataset}_${formattedRange}`;
    const newJobId = `EXP-${1093 + jobs.length}`;

    const newJob = {
      id: newJobId,
      name: exportName,
      dataset: selectedDataset,
      format: selectedFormat,
      records: count,
      requestedBy: 'admin@majestyfx.com',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Completed',
    };

    setJobs((prev) => [newJob, ...prev]);
    setIsModalOpen(false);
    handleDownloadJob(newJob);
  };

  const totalRecordsSum = jobs.reduce((acc, j) => acc + (j.records || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
      {/* Success Notification Banner */}
      {successBanner && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none"
          >
            <Link to="/admin/demo" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <Link to="/admin/settings" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              System Settings
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Data Export</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    CRM & Financial Data Export
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Hub
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Generate encrypted compliance reports, tax statements, trade ledger dumps, and custom CSV extracts.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.95rem',
                    backgroundColor: 'var(--desk, #ea580c)',
                    color: 'rgb(255, 255, 255)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)',
                  }}
                >
                  <Plus size={14} />
                  <span>Generate New Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="admin-stat-card">
          <div className="admin-icon-box" style={{ background: 'linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))' }}>
            <FileSpreadsheet size={20} color="#ffffff" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{jobs.length}</span>
            <span className="admin-stat-lbl">TOTAL EXPORT JOBS</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-icon-box" style={{ background: 'linear-gradient(135deg, rgb(22, 163, 74), rgb(21, 128, 61))' }}>
            <Download size={20} color="#ffffff" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{totalRecordsSum > 0 ? totalRecordsSum.toLocaleString() : '180,450'}</span>
            <span className="admin-stat-lbl">TOTAL RECORDS EXTRACTED</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-icon-box" style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105), rgb(4, 120, 87))' }}>
            <Lock size={20} color="#ffffff" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">AES-256</span>
            <span className="admin-stat-lbl">EXPORT ENCRYPTION</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-icon-box" style={{ background: 'linear-gradient(135deg, rgb(100, 116, 139), rgb(71, 85, 105))' }}>
            <Calendar size={20} color="#ffffff" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">30 Days</span>
            <span className="admin-stat-lbl">STORAGE RETENTION</span>
          </div>
        </div>
      </div>

      {/* Completed Export Jobs Table Box */}
      <div className="admin-table-box">
        <div style={{ padding: '1rem', borderBottom: '1px solid rgb(241, 245, 249)' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
            Completed Export Jobs & Archive
          </h3>
        </div>
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>EXPORT FILE NAME</th>
                  <th>DATASET</th>
                  <th>FORMAT</th>
                  <th>RECORDS</th>
                  <th>REQUESTED BY</th>
                  <th>GENERATED AT</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="data-table-empty">
                      No export jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{job.id}</td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileText size={14} color="#ea580c" />
                          <span>
                            {job.name}.{job.format.toLowerCase()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '4px',
                            color: '#475569',
                          }}
                        >
                          {job.dataset}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#334155' }}>{job.format}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{job.records.toLocaleString()}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{job.requestedBy}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{job.createdAt}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                          }}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadJob(job)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#16a34a',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Generate Custom Export */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <form
            onSubmit={handleCreateExport}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Generate Custom Export</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Select Target Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="Client Registry">Client Registry & KYC</option>
                  <option value="Treasury & Finance">Deposits & Withdrawals Ledger</option>
                  <option value="Dealing Desk">MT5 Closed Positions & Trades</option>
                  <option value="IB & Partnerships">IB Partner Commissions & Rebates</option>
                  <option value="PAMM Pool Allocations">PAMM Pool Investments</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Export Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="CSV">Comma Separated Values (.csv)</option>
                  <option value="XLSX">Microsoft Excel (.xlsx)</option>
                  <option value="JSON">JSON Document (.json)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Date Range Filter
                </label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="All Time">All Time Records</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="This Quarter">Current Quarter (Q3)</option>
                  <option value="Year to Date">Year to Date (2026)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.45rem 1rem',
                  backgroundColor: '#ea580c',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Run & Download Export
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Version Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(226, 232, 240)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '0.8125rem',
          color: 'rgb(100, 116, 139)',
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
