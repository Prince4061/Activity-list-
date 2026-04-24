const form = document.getElementById('gradeForm');
const tableBody = document.getElementById('tableBody');
const downloadBtn = document.getElementById('downloadPdf');
const toast = document.getElementById('toast');
const srNoInput = document.getElementById('srNo');
const teacherInput = document.getElementById('teacherName');

let students = [];

updateNextSrNo();

function updateNextSrNo() {
    srNoInput.value = students.length + 1;
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
    }, 2500);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const student = {
        id: Date.now(),
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        topic: document.getElementById('topic').value,
        activity: document.getElementById('activity').value
    };

    students.push(student);
    renderTable();

    // Clear specific fields
    document.getElementById('subject').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('topic').value = '';
    document.getElementById('activity').value = '';

    updateNextSrNo();
    showToast("Entry added successfully!");
});

function renderTable() {
    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr id="emptyState">
                <td colspan="5" class="px-4 py-20 text-center text-slate-400 italic">
                    No entries found. Please add data using the form.
                </td>
            </tr>
        `;
        downloadBtn.disabled = true;
        updateNextSrNo();
        return;
    }

    downloadBtn.disabled = false;
    tableBody.innerHTML = '';

    students.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-50 hover:bg-slate-50 transition-colors text-sm';
        tr.innerHTML = `
            <td class="px-3 py-4 text-slate-700 font-bold">${index + 1}</td>
            <td class="px-3 py-4 text-slate-600 font-medium">${student.subject}</td>
            <td class="px-3 py-4 text-slate-600">${student.grade}</td>
            <td class="px-3 py-4 text-slate-600 font-medium italic">${student.topic}</td>
            <td class="px-3 py-4 text-slate-600 max-w-[200px] break-words">${student.activity}</td>
        `;
        tableBody.appendChild(tr);
    });
    updateNextSrNo();
}

downloadBtn.addEventListener('click', () => {
    if (students.length === 0) return;

    const teacherName = teacherInput.value || "Not Specified";
    const reportDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Build table rows HTML
    const tableRowsHTML = students.map((s, index) => `
        <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: center; font-weight: bold;">${index + 1}</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">${s.subject}</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: center;">${s.grade}</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">${s.topic}</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">${s.activity}</td>
        </tr>
    `).join('');

    // Build the full print HTML — use a separate window so browser renders it natively
    const printHTML = `
        <!DOCTYPE html>
        <html lang="hi">
        <head>
            <meta charset="UTF-8">
            <title>Activity Report - ${teacherName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Noto Sans Devanagari', 'Inter', sans-serif;
                    color: #1e293b;
                    padding: 30px;
                    background: white;
                    line-height: 1.6;
                }
                .header {
                    text-align: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid #2563eb;
                }
                .logo {
                    width: 90px;
                    height: auto;
                    border-radius: 10px;
                    margin-bottom: 12px;
                }
                .title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 4px;
                }
                .affiliation {
                    font-size: 13px;
                    color: #2563eb;
                    font-weight: 600;
                    margin-bottom: 6px;
                }
                .teacher-info {
                    font-size: 14px;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 20px;
                    padding: 10px 16px;
                    background: #f8fafc;
                    border-left: 3px solid #2563eb;
                    border-radius: 4px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }
                thead tr {
                    background-color: #2563eb;
                    color: white;
                }
                thead th {
                    border: 1px solid #1d4ed8;
                    padding: 10px 12px;
                    text-align: left;
                    font-weight: 700;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                tbody tr:nth-child(even) { background-color: #f8fafc; }
                tbody td {
                    border: 1px solid #cbd5e1;
                    padding: 10px 12px;
                    vertical-align: top;
                }
                .footer {
                    margin-top: 20px;
                    text-align: right;
                    font-size: 12px;
                    color: #64748b;
                }
                @media print {
                    body { padding: 15px; }
                    @page { margin: 15mm; size: A4; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img class="logo" src="https://i.ibb.co/dsMrDjCs/Screenshot-2026-04-22-101540.png" alt="School Logo" crossorigin="anonymous">
                <div class="title">Integrated Skill Based Activity</div>
                <div class="affiliation">Affiliation No: 3330552</div>
            </div>
            <div class="teacher-info">Teacher Name: &nbsp; ${teacherName}</div>
            <table>
                <thead>
                    <tr>
                        <th style="width:5%;">Sr.</th>
                        <th style="width:18%;">Subject</th>
                        <th style="width:10%;">Grade</th>
                        <th style="width:22%;">Topic</th>
                        <th>Activity</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHTML}
                </tbody>
            </table>
            <div class="footer">Generated on: ${reportDate}</div>
        </body>
        </html>
    `;

    // Open a new window, write HTML, wait for fonts to load, then print
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.open();
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for fonts and images to load, then trigger print dialog
    printWindow.onload = function () {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            // Close after print dialog is dismissed
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        }, 1500); // 1.5s for fonts to load
    };

    showToast("Print dialog will open. Choose 'Save as PDF'!");
});
