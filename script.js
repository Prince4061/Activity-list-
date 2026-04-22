const form = document.getElementById('gradeForm');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
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

const getBase64Image = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
};

downloadBtn.addEventListener('click', () => {
    if (students.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const teacherName = teacherInput.value || "Not Specified";
    
    // Add School Logo
    const logoImg = document.getElementById('schoolLogo');
    try {
        const imgData = getBase64Image(logoImg);
        doc.addImage(imgData, 'PNG', 14, 10, 25, 25);
    } catch (e) {
        console.error("Logo generation failed", e);
    }

    // Header Content
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("Integrated Skill Based Activity", 45, 18);
    
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "normal");
    doc.text(`Affiliation No: 3330552`, 45, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Teacher: ${teacherName}`, 45, 32);
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 18, { align: "right" });

    // Table Columns and Body
    const tableData = students.map((s, index) => [
        index + 1, 
        s.subject, 
        s.grade, 
        s.topic,
        s.activity
    ]);

    doc.autoTable({
        startY: 45,
        head: [['Sr.', 'Subject', 'Grade', 'Topic', 'Activity']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 10, halign: 'center', textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5, overflow: 'linebreak', textColor: [50, 50, 50] },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 35 },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 45 },
            4: { cellWidth: 'auto' }
        },
        margin: { top: 45 }
    });

    const fileName = `Activity_Report_${teacherName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
    showToast("Report downloaded successfully!");
});
