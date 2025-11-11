// thaiCalendar.js
// ✅ ปฏิทิน พ.ศ. สำหรับ input date (วว/ดด/พ.ศ.)
// © 2025 Ledphong | Thai Calendar Library
// [Update 2025-11-11] + แก้ไขเพิ่มวงกลมสีแดงวันที่ปัจจุบัน

function thaiCalendar(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  element.addEventListener("click", function () {
    // ลบปฏิทินเก่า ถ้ามี
    document.querySelectorAll(".calendar-panel").forEach(e => e.remove());
    createCalendar(element);
  });

  function createCalendar(element) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear() + 543;

    const cal = document.createElement("div");
    cal.className = "calendar-panel p-2 border bg-white position-absolute shadow";

    cal.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <button class="btn btn-sm btn-primary prev">&lt;</button>
        <div>
          <select class="month_select form-control form-control-sm d-inline" style="width:110px;">
            <option value="01">มกราคม</option><option value="02">กุมภาพันธ์</option><option value="03">มีนาคม</option>
            <option value="04">เมษายน</option><option value="05">พฤษภาคม</option><option value="06">มิถุนายน</option>
            <option value="07">กรกฎาคม</option><option value="08">สิงหาคม</option><option value="09">กันยายน</option>
            <option value="10">ตุลาคม</option><option value="11">พฤศจิกายน</option><option value="12">ธันวาคม</option>
          </select>
          <select class="year_select form-control form-control-sm d-inline" style="width:100px;"></select>
        </div>
        <button class="btn btn-sm btn-primary next">&gt;</button>
      </div>
      <div class="calendar-body"></div>
    `;

    // ✅ สร้างปีแบบ พ.ศ.
    const yearSelect = cal.querySelector(".year_select");
    const thisYearAD = now.getFullYear();
    for (let y = thisYearAD - 120; y <= thisYearAD + 10; y++) {
      yearSelect.innerHTML += `<option value="${y + 543}">${y + 543}</option>`;
    }

    cal.querySelector(".month_select").value = String(month).padStart(2, "0");
    yearSelect.value = year;

    renderCalendar(cal, month, year);

    // ปุ่มเปลี่ยนเดือน
    cal.querySelector(".prev").addEventListener("click", () => {
      let m = parseInt(cal.querySelector(".month_select").value);
      let y = parseInt(cal.querySelector(".year_select").value);
      m--;
      if (m < 1) { m = 12; y--; }
      renderCalendar(cal, m, y);
      cal.querySelector(".month_select").value = String(m).padStart(2, "0");
      cal.querySelector(".year_select").value = y;
    });

    cal.querySelector(".next").addEventListener("click", () => {
      let m = parseInt(cal.querySelector(".month_select").value);
      let y = parseInt(cal.querySelector(".year_select").value);
      m++;
      if (m > 12) { m = 1; y++; }
      renderCalendar(cal, m, y);
      cal.querySelector(".month_select").value = String(m).padStart(2, "0");
      cal.querySelector(".year_select").value = y;
    });

    cal.querySelector(".month_select").addEventListener("change", () => {
      let m = parseInt(cal.querySelector(".month_select").value);
      let y = parseInt(cal.querySelector(".year_select").value);
      renderCalendar(cal, m, y);
    });

    cal.querySelector(".year_select").addEventListener("change", () => {
      let m = parseInt(cal.querySelector(".month_select").value);
      let y = parseInt(cal.querySelector(".year_select").value);
      renderCalendar(cal, m, y);
    });

    element.after(cal);
  }

  function renderCalendar(cal, month, yearBE) {
    const body = cal.querySelector(".calendar-body");
    const yearAD = yearBE - 543; // ✅ แปลง พ.ศ. → ค.ศ.
    const firstDay = new Date(yearAD, month - 1, 1);
    const lastDay = new Date(yearAD, month, 0).getDate();

    // ตรวจสอบวันปัจจุบัน
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear() + 543;

    let html = "<table class='table table-bordered text-center mb-0'>";
    html += "<thead class='table-light'><tr><th>อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th></tr></thead><tbody><tr>";

    // ช่องว่างก่อนวันที่ 1
    for (let i = 0; i < firstDay.getDay(); i++) html += "<td></td>";

    for (let d = 1; d <= lastDay; d++) {
      // ✅ ตรวจสอบว่าวันนี้หรือไม่
      const isToday = d === todayDate && month === todayMonth && yearBE === todayYear;
      const className = isToday ? "date-cell today" : "date-cell";

      html += `<td class="${className}">${String(d).padStart(2, '0')}</td>`;

      if ((firstDay.getDay() + d) % 7 === 0) html += "</tr><tr>";
    }

    html += "</tr></tbody></table>";
    body.innerHTML = html;

    // คลิกเลือกวันที่
    body.querySelectorAll(".date-cell").forEach(td => {
      td.addEventListener("click", () => {
        const date = td.textContent.trim();
        element.value = `${date.padStart(2, "0")}/${String(month).padStart(2, "0")}/${yearBE}`;
        cal.remove();
      });
    });
  }
}

// ✅ Export ให้เรียกใช้ได้ใน HTML
window.thaiCalendar = thaiCalendar;
