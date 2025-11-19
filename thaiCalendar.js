// thaiCalendar.js
// ✅ ปฏิทิน พ.ศ. สำหรับ input date (วว/ดด/พ.ศ.)
// © 2025 Ledphong | Thai Calendar Library
// [Update 2025-11-19] + แก้ไขเพิ่มวงกลมสีแดงวันที่ปัจจุบัน

function thaiCalendar(selector){
  const el = document.querySelector(selector);
  if (!el) return;

  const MONTHS=[
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];

  let panel = null;

  // เปิดปฏิทิน
  el.addEventListener("click", e=>{
    e.stopPropagation();
    panel?.remove();
    create(el);
  });

  // ปิดเมื่อคลิกนอกปฏิทิน
  document.addEventListener("click", ()=>panel?.remove());

  /* --------------------- create() --------------------- */
  function create(input){
    const now = new Date();
    let m, yBE;

    // อ่านค่า input dd/mm/yyyy
    if (input.value && typeof input.value === "string" && input.value.includes("/")){
      const parts = input.value.split("/");
      if (parts.length === 3){
        m   = parseInt(parts[1],10);
        yBE = parseInt(parts[2],10);
      }
    }

    // ถ้าไม่มีค่าที่ถูกต้อง → ใช้วันที่ปัจจุบัน
    if (!m || !yBE || Number.isNaN(m) || Number.isNaN(yBE)){
      m   = now.getMonth() + 1;
      yBE = now.getFullYear() + 543;
    }

    // โครง panel
    panel = document.createElement("div");
    panel.innerHTML=`
      <div class="d-flex justify-content-between mb-2">
        <button class="btn btn-sm btn-outline-primary prev">&lt;</button>
        <div>
          <select class="month form-select form-select-sm d-inline w-auto"></select>
          <select class="year form-select form-select-sm d-inline w-auto"></select>
        </div>
        <button class="btn btn-sm btn-outline-primary next">&gt;</button>
      </div>
      <div class="body"></div>
    `;

    Object.assign(panel.style,{
      zIndex:"9999",
      borderRadius:"10px",
      overflow:"hidden",
      position:"absolute",
      background:"#fff",
      padding:"12px",
      border:"1px solid #ccc",
      boxShadow:"0 2px 8px rgba(0,0,0,0.15)"
    });

    // ตำแหน่งแสดง panel
    const rect = input.getBoundingClientRect();
    const top  = rect.bottom + window.scrollY + 6;
    let left   = rect.left + window.scrollX;

    // กันล้นด้านขวา
    if (left + 260 > window.innerWidth) left = window.innerWidth - 270;

    panel.style.top = top + "px";
    panel.style.left = left + "px";
    panel.style.minWidth = "240px";

    document.body.appendChild(panel);

    // เดือน
    const mSel = panel.querySelector(".month");
    MONTHS.forEach((t,i)=> mSel.innerHTML += `<option value="${i+1}">${t}</option>`);
    mSel.value = String(m);

    // ปี (BE)
    const ySel = panel.querySelector(".year");
    const yAD  = now.getFullYear();
    for (let i=yAD-120; i<=yAD+10; i++){
      const be = i + 543;
      ySel.innerHTML += `<option value="${be}">${be}</option>`;
    }
    ySel.value = String(yBE);

    render(panel, Number(mSel.value), Number(ySel.value), input);

    // ปุ่มเปลี่ยนเดือน
    panel.querySelector(".prev").onclick = e=>{ e.stopPropagation(); change(-1); };
    panel.querySelector(".next").onclick = e=>{ e.stopPropagation(); change(1); };

    // เปลี่ยนเดือน/ปี
    mSel.onchange = ySel.onchange = e=>{
      e.stopPropagation();
      render(panel, +mSel.value, +ySel.value, input);
    };

    panel.addEventListener("click", e=>e.stopPropagation());

    // ฟังก์ชันปรับเดือน
    function change(step){
      let mm = +mSel.value;
      let yy = +ySel.value;

      mm += step;
      if (mm < 1){ mm = 12; yy--; }
      if (mm > 12){ mm = 1; yy++; }

      mSel.value = String(mm);
      ySel.value = String(yy);

      render(panel, mm, yy, input);
    }
  }

  /* --------------------- render() --------------------- */
  function render(panel, month, yearBE, input){
    const body   = panel.querySelector(".body");
    const yearAD = yearBE - 543;

    const first = new Date(yearAD, month-1, 1);
    const last  = new Date(yearAD, month, 0).getDate();

    const today = new Date();
    const tD = today.getDate();
    const tM = today.getMonth() + 1;
    const tY = today.getFullYear() + 543;

    let html = `
      <table class="table table-bordered text-center mb-0">
      <thead class="table-light">
      <tr>
        <th>อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th>
      </tr></thead><tbody><tr>
    `;

    for (let i=0; i<first.getDay(); i++) html += "<td></td>";

    for (let d=1; d<=last; d++){
      const isToday = (d===tD && month===tM && yearBE===tY);

      const styleToday = isToday
        ? `background:yellow;color:red;border:2px solid red;border-radius:50%;
           width:36px;height:36px;display:flex;justify-content:center;align-items:center;
           margin:2px auto 0 auto;line-height:1;transition:all 0.2s ease;`
        : "";

      html += `
        <td class="p-2 date" data-day="${d}" style="cursor:pointer;${styleToday}">
          ${String(d).padStart(2,"0")}
        </td>
      `;

      if ((first.getDay() + d) % 7 === 0) html += "</tr><tr>";
    }

    body.innerHTML = html + "</tr></tbody></table>";

    // เลือกวัน
    body.querySelectorAll(".date").forEach(td=>{
      td.onclick = ()=>{
        const day = td.getAttribute("data-day");
        input.value = `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${String(yearBE)}`;
        panel.remove();
        input.dispatchEvent(new Event("change"));
      };
    });
  }
}

// ✅ Export ให้เรียกใช้ได้ใน HTML
window.thaiCalendar = thaiCalendar;
