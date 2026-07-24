import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export array of objects to CSV/Excel format
export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export table or custom data to PDF using jsPDF and jspdf-autotable
export const exportToPDF = (
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string
) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(0, 120, 212); // Azure Blue
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 16);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 32);
  doc.text(`Generated On: ${new Date().toLocaleString()} | Enterprise Operations Center`, 14, 38);

  // Table
  autoTable(doc, {
    startY: 44,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 120, 212],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 44 },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount} — Confidential Enterprise Internal Document`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Specific Payslip PDF Generator
export const generatePayslipPDF = (employeeName: string, month: string, basicSalary: number, bonus: number, deductions: number, netSalary: number) => {
  const doc = new jsPDF();

  // Header Box
  doc.setFillColor(0, 120, 212);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTERPRISE ERP — CONFIDENTIAL PAYSLIP', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Global Enterprise Systems Inc. | Payroll Operations', 14, 25);

  // Employee details
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Employee Name: ${employeeName}`, 14, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pay Period: ${month}`, 14, 50);
  doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 58);
  doc.text(`Payment Reference: PAY-${Math.floor(100000 + Math.random() * 900000)}`, 14, 66);

  // Breakdown Table
  autoTable(doc, {
    startY: 74,
    head: [['Earnings & Deductions Item', 'Amount (INR)']],
    body: [
      ['Base Fixed Monthly Salary', `Rs. ${basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Performance Bonus / Incentives', `+Rs. ${bonus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Tax & Benefit Deductions', `-Rs. ${deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['TOTAL NET DISBURSED SALARY', `Rs. ${netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 120, 212] },
    bodyStyles: { fontSize: 10 },
  });

  doc.save(`Payslip_${employeeName.replace(/\s+/g, '_')}_${month}.pdf`);
};
