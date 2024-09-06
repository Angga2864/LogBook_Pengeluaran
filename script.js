document.addEventListener("DOMContentLoaded", function () {
  // Menampilkan waktu realtime
  function updateTime() {
    const currentTimeElement = document.getElementById("currentTime");
    const now = new Date();
    currentTimeElement.innerHTML = now.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" });
  }
  setInterval(updateTime, 1000);
  updateTime();

  const expenseForm = document.getElementById("expenseForm");
  const expenseTableBody = document.getElementById("expenseTableBody");
  const totalExpenseElement = document.getElementById("totalExpense");

  // Ambil data pengeluaran dari Local Storage atau inisialisasi jika belum ada
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Memuat data dari Local Storage saat halaman dimuat
  loadExpenses();

  // Mengelola data pengeluaran
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const expenseType = document.getElementById("expenseType").value;
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value); // Pastikan ini angka
    const expenseNote = document.getElementById("expenseNote").value;
    const timestamp = new Date().toLocaleString("id-ID");

    if (isNaN(expenseAmount)) {
      alert("Nominal uang yang dikeluarkan harus berupa angka.");
      return;
    }

    const expense = { timestamp, expenseType, expenseAmount, expenseNote };
    expenses.push(expense);

    // Simpan data ke Local Storage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    addExpenseToTable(expense);
    updateTotalExpense();

    expenseForm.reset();
  });

  // Fungsi untuk memuat data pengeluaran dari Local Storage dan memperbarui tabel
  function loadExpenses() {
    expenses.forEach((expense) => {
      addExpenseToTable(expense);
    });
    updateTotalExpense();
  }

  // Fungsi untuk menambahkan pengeluaran ke tabel
  function addExpenseToTable(expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${expense.timestamp}</td>
          <td>${expense.expenseType}</td>
          <td>Rp ${expense.expenseAmount.toLocaleString("id-ID")}</td>
          <td>${expense.expenseNote}</td>
        `;
    expenseTableBody.appendChild(row);
  }

  // Menghitung total pengeluaran
  function updateTotalExpense() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const totalExpense = expenses
      .filter((expense) => {
        const expenseDateParts = expense.timestamp.split(" ")[0].split("/"); // Memperbaiki cara mendapatkan bulan/tahun dari timestamp
        const expenseDate = new Date(`${expenseDateParts[2]}-${expenseDateParts[1]}-${expenseDateParts[0]}`);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.expenseAmount, 0);

    totalExpenseElement.innerHTML = `Rp ${totalExpense.toLocaleString("id-ID")}`;
  }
});
