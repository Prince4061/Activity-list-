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

downloadBtn.addEventListener('click', async () => {
    if (students.length === 0) return;

    showToast("Generating PDF...");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const teacherName = teacherInput.value || "Not Specified";
    const reportDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const pageW = doc.internal.pageSize.getWidth();
    let cursorY = 14;

    // ── Try to load logo ──
    try {
        const logoUrl = "https://i.ibb.co/dsMrDjCs/Screenshot-2026-04-22-101540.png";
        const resp = await fetch(logoUrl);
        const blob = await resp.blob();
        const base64 = await new Promise((res) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.readAsDataURL(blob);
        });
        const imgW = 22, imgH = 22;
        doc.addImage(base64, 'PNG', (pageW - imgW) / 2, cursorY, imgW, imgH);
        cursorY += imgH + 4;
    } catch (e) {
        cursorY += 6; // skip logo space if blocked
    }

    // ── Header Title ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Integrated Skill Based Activity', pageW / 2, cursorY, { align: 'center' });
    cursorY += 7;

    // ── Affiliation ──
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.text('Affiliation No: 3330552', pageW / 2, cursorY, { align: 'center' });
    cursorY += 5;

    // ── Blue divider line ──
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.6);
    doc.line(14, cursorY, pageW - 14, cursorY);
    cursorY += 6;

    // ── Teacher Info Box ──
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0);
    doc.rect(14, cursorY, pageW - 28, 9, 'F');
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(14, cursorY, 14, cursorY + 9); // left blue border
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Teacher Name:  ${teacherName}`, 18, cursorY + 6);
    cursorY += 14;

    // ── Data Table ──
    doc.autoTable({
        startY: cursorY,
        head: [['Sr.', 'Subject', 'Grade', 'Topic', 'Activity']],
        body: students.map((s, i) => [i + 1, s.subject, s.grade, s.topic, s.activity]),
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left'
        },
        bodyStyles: { fontSize: 10, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: 35 },
            2: { cellWidth: 22, halign: 'center' },
            3: { cellWidth: 40 },
            4: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 },
        styles: { overflow: 'linebreak', valign: 'top', lineColor: [203, 213, 225], lineWidth: 0.3 }
    });

    // ── Footer ──
    const finalY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${reportDate}`, pageW - 14, finalY, { align: 'right' });

    // ── Save ──
    const safeName = teacherName.replace(/[^a-z0-9]/gi, '_');
    doc.save(`Activity_Report_${safeName}.pdf`);
    showToast("PDF downloaded successfully!");
});
