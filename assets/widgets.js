// 階段 1 的互動練習：拆開一顆藥（#wTablet）、藥袋偵探（#wBag）、藥櫃（#wCabinet）、選劑型（#wChoose）。
(function () {
  const $ = (s, r = document) => r.querySelector(s), NS = 'http://www.w3.org/2000/svg';
  const opened = (id) => { try { localStorage.setItem('lp-opened-' + id, 'true'); } catch (e) {} };
  const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  /* ================= 拆開一顆藥 ================= */
  const wt = $('#wTablet');
  if (wt) {
    const COMP = [
      { k: 'api', name: '活性成分', ex: '示範藥 X', mg: 200, color: '#2F5FCC', role: '真正產生藥效的成分，藥盒上「200 毫克」指的就是它。', gone: '外觀、重量幾乎一樣，卻完全沒有藥效。臨床試驗用的「安慰劑」就是這樣做的。' },
      { k: 'filler', name: '填充劑', ex: '例如：乳糖、微晶纖維素', mg: 220, color: '#D9C7A0', role: '把體積撐到能壓成、好拿的大小。有些藥的活性成分只有 0.1 毫克，沒有填充劑根本做不成一顆。', gone: '藥錠變得又小又薄，不好拿、容易碎。活性成分越少的藥，越不可能少了它。' },
      { k: 'binder', name: '黏合劑', ex: '例如：聚維酮（PVP）、澱粉', mg: 25, color: '#7FB98A', role: '像膠水，讓粉末壓了之後能黏在一起。', gone: '壓好的錠一碰就碎，裝瓶運送後只剩粉屑。' },
      { k: 'disint', name: '崩解劑', ex: '例如：交聯羧甲基纖維素鈉', mg: 25, color: '#E9A92E', role: '遇水膨脹，把藥錠從裡面撐開，藥才溶得出來。', gone: '藥錠在胃裡像一顆小石頭，要很久才散開，起效大幅延後。' },
      { k: 'glidant', name: '助流劑', ex: '例如：二氧化矽', mg: 10, color: '#AEBAC2', role: '讓粉末流得順，每一顆裝進模具的粉量才會一樣。', gone: '粉末流動卡卡的，每顆重量差很多，也就是每顆的劑量不一樣。' },
      { k: 'lub', name: '潤滑劑', ex: '例如：硬脂酸鎂', mg: 5, color: '#5E6E76', role: '只佔 1%，防止粉末黏在打錠機的模具上。', gone: '粉末黏模，藥錠表面坑坑洞洞、邊緣缺角，重量也不穩。' },
      { k: 'coat', name: '膜衣', ex: '例如：羥丙甲纖維素（HPMC）、色素', mg: 15, color: '#E59AA6', role: '包在最外層：遮苦味、好吞、防潮，顏色也方便辨認。一般膜衣不防胃酸，和腸溶衣不同。', gone: '又苦又澀、容易受潮變質，和別的白色藥錠也更難分辨。' },
    ];
    $('.in', wt).innerHTML = '<div class="w-grid"><div><svg class="tab-svg" viewBox="0 0 240 200" role="img" aria-label="藥錠剖面示意圖"></svg><div class="compbar" role="group" aria-label="藥錠成分比例"></div><div class="scale"><span>0</span><span class="wl">500 毫克</span></div><div class="w-stats"></div></div><div><div class="comp-list"></div><div class="comp-card"></div><div class="w-verdict" role="status"></div></div></div>';
    const gone = new Set(); let sel = 'api'; const svg = $('svg', wt), bar = $('.compbar', wt), list = $('.comp-list', wt);
    const el = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    const g = el('g', {}), body = el('ellipse', { cx: 0, cy: 0, rx: 88, ry: 62, fill: '#F4F1EA', stroke: '#5f6370', 'stroke-width': 1.2 }, g), speck = [], r = rng(11);
    const core = COMP.filter(c => c.k !== 'coat'), coreMg = core.reduce((a, c) => a + c.mg, 0);
    core.forEach(c => { const gg = el('g', {}, g); speck.push([c.k, gg]); const n = Math.max(3, Math.round(c.mg / coreMg * 140)); for (let i = 0; i < n; i++) { let x, y; do { x = (r() * 2 - 1) * 82; y = (r() * 2 - 1) * 56; } while (x * x / 6724 + y * y / 3136 > 1); el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: c.k === 'api' ? 3.2 : 2.4, fill: c.color }, gg); } });
    const ring = el('ellipse', { cx: 0, cy: 0, rx: 92, ry: 66, fill: 'none', stroke: '#E59AA6', 'stroke-width': 6 }, g);
    const cracks = el('path', { d: 'M-60 -30 L-20 -5 L-35 25 M10 -55 L5 -10 L40 10 L30 50 M50 -35 L70 -10', fill: 'none', stroke: '#1d2033', 'stroke-width': 2, opacity: 0 }, g);
    const pits = el('g', { opacity: 0 }, g); [[-50, -20], [30, -35], [55, 20], [-15, 40], [-70, 10], [10, 5]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 5, fill: '#1d2033', opacity: .35 }, pits));
    const stone = el('text', { x: 120, y: 192, 'text-anchor': 'middle', 'font-size': 13, fill: '#5f6370' });
    COMP.forEach(c => {
      const b = document.createElement('button'); b.dataset.k = c.k; b.style.background = c.color; b.style.flexGrow = c.mg; b.setAttribute('aria-label', `${c.name} ${c.mg} 毫克`); b.onclick = () => { sel = c.k; render(); }; bar.appendChild(b);
      const l = document.createElement('button'); l.dataset.k = c.k; l.innerHTML = `<span class="sw" style="background:${c.color}"></span><span>${c.name}<br><small style="color:var(--muted)">${c.mg} mg</small></span>`; l.onclick = () => { sel = c.k; render(); }; list.appendChild(l);
    });
    function render() {
      const c = COMP.find(x => x.k === sel), isGone = gone.has(c.k);
      bar.querySelectorAll('button').forEach(b => { b.classList.toggle('sel', b.dataset.k === sel); b.classList.toggle('gone', gone.has(b.dataset.k)); });
      list.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', b.dataset.k === sel); b.classList.toggle('gone', gone.has(b.dataset.k)); });
      $('.comp-card', wt).innerHTML = `<h3>${c.name}　<span style="font-size:.9rem;color:var(--muted)">${c.mg} 毫克，約 ${Math.round(c.mg / 5)}%</span></h3><p class="ex">${c.ex}</p><p>${isGone ? '<b>拿掉之後：</b>' + c.gone : c.role}</p><button class="w-btn ${isGone ? 'ghost' : ''}">${isGone ? '放回去' : '拿掉它'}</button>`;
      $('.comp-card .w-btn', wt).onclick = () => { isGone ? gone.delete(c.k) : gone.add(c.k); opened('s1-tablet'); render(); };
      const w = COMP.reduce((a, x) => a + (gone.has(x.k) ? 0 : x.mg), 0), s = Math.sqrt(w / 500) * .95 + .05;
      g.setAttribute('transform', `translate(120,90) scale(${s.toFixed(3)})`);
      speck.forEach(([k, gg]) => gg.setAttribute('opacity', gone.has(k) ? 0 : 1));
      ring.setAttribute('opacity', gone.has('coat') ? 0 : 1); cracks.setAttribute('opacity', gone.has('binder') ? 1 : 0); pits.setAttribute('opacity', gone.has('lub') ? 1 : 0);
      body.setAttribute('stroke-dasharray', gone.has('binder') ? '6 5' : ''); stone.textContent = gone.has('disint') ? '在胃裡遲遲不散開…' : '';
      $('.wl', wt).textContent = `${w} 毫克`;
      const dis = gone.has('binder') ? '壓不成形' : gone.has('disint') ? '> 60 分鐘' : '約 5 分鐘';
      const vp = Math.max(1, gone.has('glidant') ? 8 : 0, gone.has('lub') ? 4 : 0, gone.has('binder') ? 10 : 0);
      const st = [['每顆重量', w + ' mg', w < 300], ['崩解時間', dis, dis !== '約 5 分鐘'], ['每顆劑量誤差', '± ' + vp + '%', vp > 2], ['藥效／口感', (gone.has('api') ? '沒有' : '有') + '／' + (gone.has('coat') ? '苦、易受潮' : '好吞'), gone.has('api') || gone.has('coat')]];
      $('.w-stats', wt).innerHTML = st.map(([k, v, b]) => `<div class="w-stat ${b ? 'bad' : ''}"><div class="v">${v}</div><div class="k">${k}</div></div>`).join('');
      const tv = $('.w-verdict', wt);
      if (!gone.size) { tv.className = 'w-verdict'; tv.innerHTML = '<b>完整的藥錠</b>只有 40% 是真正的藥，其餘 60% 都是賦形劑，各有工作。試著拿掉一種看看。'; }
      else { const names = [...gone].map(k => COMP.find(x => x.k === k).name).join('、'), only = gone.size === 1 && gone.has('coat'); tv.className = 'w-verdict' + (only ? '' : ' bad'); tv.innerHTML = `<b>${only ? '還能用，但不好吃' : '這顆藥不能出廠'}</b>你拿掉了：${names}。${gone.has('api') ? '沒有活性成分就沒有療效。' : '賦形劑本身通常沒有療效，但少了它們，藥就做不成、存不住，或在不對的地方釋放。'}`; }
    }
    render();
  }

  /* ================= 藥袋偵探 ================= */
  const wb = $('#wBag');
  if (wb) {
    const CASES = [
      { pill: { shape: 'caplet', color: '#F4F4F2', sheen: 1 }, f: { name: 'Ansutong F.C. 500 mg', zh: '安舒痛膜衣錠 500 毫克', use: '需要時每 6 小時服用 1 粒', look: '白色長橢圓形，表面光滑', note: '吞嚥困難者可剝半或磨粉服用' }, form: 'ir', split: 'yes', clues: ['zh', 'note'], exp: '「膜衣錠」的膜衣只是讓藥好吞、遮住苦味，不防胃酸，屬於一般速釋錠。表面光滑不等於腸溶，這個藥袋也寫明可以剝半或磨粉。' },
      { pill: { shape: 'round', color: '#F2C94C', sheen: 1 }, f: { name: 'Bowining EC 100 mg', zh: '保胃寧腸溶錠 100 毫克', use: '每日 1 次，飯後服用', look: '黃色圓形，表面光滑', note: '請整粒吞服，勿咬碎或剝半' }, form: 'ec', split: 'no', clues: ['name', 'zh', 'note'], exp: '英文 EC、中文「腸溶」兩個線索都有。腸溶衣一破，藥就會在胃裡釋放，所以要整粒吞。' },
      { pill: { shape: 'round', color: '#E9A3B4', sheen: 1, hole: 1 }, f: { name: 'Wenyashi XL 30 mg', zh: '穩壓適持續性藥效錠 30 毫克', use: '每日早上 1 次', look: '粉紅色圓形，表面有一個小孔', note: '整粒吞服；糞便中可能看到藥錠空殼，屬正常現象' }, form: 'er', split: 'no', clues: ['name', 'zh', 'look', 'note'], exp: 'XL 和「持續性藥效」都代表緩釋，一天一次也是提示。表面的小孔是讓藥慢慢擠出來的設計，空殼最後隨糞便排出，藥其實已經釋放完了。' },
      { pill: { shape: 'oval', color: '#FFFFFF', score: 1 }, f: { name: 'Changda SR 150 mg', zh: '暢達緩釋錠 150 毫克', use: '每日 2 次，早晚各 1 粒', look: '白色橢圓形，中間有刻痕', note: '可沿刻痕剝半，切勿磨碎或咀嚼' }, form: 'er', split: 'half', clues: ['name', 'zh', 'note'], exp: '這是比較少見的情況：有些緩釋錠設計成剝半後，兩半仍各自能慢慢釋放，但磨碎就全毀了。這只限仿單明確說可以的藥，不能套用到其他緩釋錠。' },
      { pill: { shape: 'caplet', color: '#DDE6F5', sheen: 1 }, f: { name: 'Vikexi CR 200 mg', zh: '維克適錠 200 毫克', use: '每日 1 次', look: '淡藍色長橢圓形', note: '無' }, form: 'er', split: 'no', clues: ['name', 'use'], exp: '中文名完全沒提，但英文名後面的 CR（控制釋放）就是緩釋的意思，一天只吃一次也是提示。只看中文名，就會漏掉這個線索。' },
      { pill: { shape: 'blister', text: 'Kangli 10' }, f: { name: '（藥盒已丟失）', zh: '不明', use: '不明', look: '白色小圓錠，鋁箔背面印著 Kangli 10', note: '不明' }, form: 'unknown', split: 'ask', clues: ['look'], exp: '只剩外觀和鋁箔上的印字，無法確定劑型。可以帶著鋁箔片問藥師，或用印字到食藥署的藥品許可證查詢系統查。確定之前，不要剝半或磨碎。' },
    ];
    const FN = [['name', '藥名'], ['zh', '中文名'], ['use', '用法'], ['look', '外觀'], ['note', '注意事項']];
    const FT = { ir: '速釋錠', ec: '腸溶錠', er: '緩釋錠', unknown: '看不出來' }, ST = { yes: '可以剝半或磨碎', half: '只能剝半，不能磨碎', no: '都不行，要整粒吞', ask: '資訊不夠，先問藥師' };
    const pillSVG = (p) => { let s = '<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">'; const st = 'stroke="#5f6370" stroke-width="1.2"'; if (p.shape === 'blister') s += `<rect x="14" y="14" width="132" height="62" rx="6" fill="#C9CED3" ${st}/><circle cx="52" cy="45" r="18" fill="#E4E8EB" ${st}/><circle cx="108" cy="45" r="18" fill="#E4E8EB" ${st} stroke-dasharray="3 3"/><text x="80" y="86" text-anchor="middle" font-size="10" fill="#5f6370">${p.text}</text>`; else { if (p.shape === 'caplet') s += `<rect x="30" y="26" width="100" height="38" rx="19" fill="${p.color}" ${st}/>`; if (p.shape === 'oval') s += `<ellipse cx="80" cy="45" rx="46" ry="28" fill="${p.color}" ${st}/>`; if (p.shape === 'round') s += `<circle cx="80" cy="45" r="30" fill="${p.color}" ${st}/>`; if (p.sheen) s += '<ellipse cx="68" cy="34" rx="16" ry="5" fill="#fff" opacity=".6"/>'; if (p.score) s += '<line x1="80" y1="19" x2="80" y2="71" stroke="#5f6370" stroke-width="2"/>'; if (p.hole) s += '<circle cx="92" cy="52" r="3" fill="#5a3440"/>'; } return s + '</svg>'; };
    $('.in', wb).innerHTML = '<div class="w-grid"><div class="bag"><div class="bag-top"><span>示範藥局　藥袋</span><span class="no"></span></div><div class="bag-pill" aria-hidden="true"></div><dl></dl></div><div><p class="w-q">這是哪一種劑型？</p><div class="w-opts" data-g="form"><button data-v="ir">速釋錠（一般錠）</button><button data-v="ec">腸溶錠</button><button data-v="er">緩釋錠</button><button data-v="unknown">看不出來</button></div><p class="w-q">可以剝半或磨碎嗎？</p><div class="w-opts" data-g="split"><button data-v="yes">可以剝半或磨碎</button><button data-v="half">只能剝半，不能磨碎</button><button data-v="no">都不行，要整粒吞</button><button data-v="ask">資訊不夠，先問藥師</button></div><p class="w-fb" role="status"></p><div class="w-actions"><span class="sc"></span><button class="w-btn go" disabled>對答案</button></div></div></div>';
    let ci = 0, score = 0, ans = {}, stage = 'pick'; const prog = $('.prog', wb), go = $('.go', wb), fb = $('.w-fb', wb);
    function render() {
      const c = CASES[ci]; ans = {}; stage = 'pick'; prog.textContent = `案例 ${ci + 1}／${CASES.length}`; $('.no', wb).textContent = `No. ${String(ci + 1).padStart(3, '0')}`;
      $('.bag-pill', wb).innerHTML = pillSVG(c.pill); $('dl', wb).innerHTML = FN.map(([k, n]) => `<dt>${n}</dt><dd data-k="${k}">${c.f[k]}</dd>`).join('');
      wb.querySelectorAll('.w-opts button').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.classList.remove('opt', 'right', 'wrong'); b.disabled = false; });
      fb.textContent = ''; go.textContent = '對答案'; go.disabled = true; $('.sc', wb).textContent = `答對 ${score} 個案例`;
    }
    wb.querySelectorAll('.w-opts').forEach(box => box.onclick = (e) => { const b = e.target.closest('button'); if (!b || stage !== 'pick') return; ans[box.dataset.g] = b.dataset.v; box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); go.disabled = !(ans.form && ans.split); });
    go.onclick = () => {
      if (stage === 'pick') {
        const c = CASES[ci]; stage = 'shown'; opened('s1-bag'); const okF = ans.form === c.form, okS = ans.split === c.split;
        wb.querySelectorAll('.w-opts').forEach(box => { const g = box.dataset.g, right = c[g]; box.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.add('opt'); if (b.dataset.v === right) b.classList.add('right'); else if (b.dataset.v === ans[g]) b.classList.add('wrong'); }); });
        c.clues.forEach(k => { const d = wb.querySelector(`dd[data-k="${k}"]`); if (d) d.classList.add('clue'); });
        if (okF && okS) score++;
        fb.textContent = (okF && okS ? '完全正確。' : `答案是：${FT[c.form]}，${ST[c.split]}。`) + c.exp + '　黃色標記是線索所在。';
        $('.sc', wb).textContent = `答對 ${score} 個案例`; go.textContent = ci < CASES.length - 1 ? '下一個案例' : '看結果';
      } else if (stage === 'shown') {
        if (ci < CASES.length - 1) { ci++; render(); } else { stage = 'end'; fb.textContent = `六個案例你答對了 ${score} 個。最常見的陷阱是：外表光滑不等於腸溶、中文名沒寫不代表不是緩釋、刻痕不代表一定能剝半。看不出來的時候，問藥師就是正確答案。`; go.textContent = '重新開始'; }
      } else { ci = 0; score = 0; render(); }
    };
    render();
  }

  /* ================= 藥櫃裡的同一個成分 ================= */
  const wc = $('#wCabinet');
  if (wc) {
    const BOXES = [
      { bn: '熱退靈', ty: '錠劑', col: '#C3303A', ing: [['乙醯胺酚', 500, 1]], dose: '每次 1 粒' },
      { bn: '舒咳寧', ty: '綜合感冒膠囊', col: '#2F5FCC', ing: [['乙醯胺酚', 300, 1], ['氯菲安明（抗組織胺）', 2], ['右美沙芬（止咳）', 15]], dose: '每次 1 粒' },
      { bn: '鼻暢', ty: '錠劑', col: '#23835F', ing: [['氯雷他定（抗組織胺）', 10]], dose: '每日 1 粒' },
      { bn: '夜安', ty: '綜合感冒液', col: '#7B5BB5', ing: [['Acetaminophen', 325, 1, '每 15 毫升'], ['苯海拉明（抗組織胺）', 12.5]], dose: '每次 15 毫升' },
      { bn: '胃舒', ty: '咀嚼錠', col: '#E9A92E', ing: [['碳酸鈣（制酸劑）', 500]], dose: '每次 1–2 粒' },
      { bn: 'Calmol 500', ty: '進口錠劑', col: '#566C74', ing: [['Paracetamol', 500, 1]], dose: '每次 1 粒' },
    ];
    $('.in', wc).innerHTML = '<div class="shelf"></div><div class="sum"><button class="w-btn go">檢查</button><div class="meter" aria-hidden="true"><i style="width:0"></i></div><span class="ms" style="font-size:.88rem;color:var(--muted)"></span></div><p class="w-fb" role="status"></p>';
    const shelf = $('.shelf', wc), picked = new Set(); let done = false;
    BOXES.forEach((b, i) => { const e = document.createElement('button'); e.className = 'mbox'; e.setAttribute('aria-pressed', 'false'); e.innerHTML = `<div class="lid" style="background:${b.col}"></div><div class="bn">${b.bn}</div><div class="ty">${b.ty}・${b.dose}</div><div class="ing">${b.ing.map(x => `<span data-a="${x[2] ? 1 : 0}">${x[0]} ${x[1]} mg${x[3] ? '／' + x[3] : ''}</span>`).join('<br>')}</div>`; e.onclick = () => { if (done) return; picked.has(i) ? picked.delete(i) : picked.add(i); e.setAttribute('aria-pressed', picked.has(i)); }; shelf.appendChild(e); });
    $('.prog', wc).textContent = '找出含乙醯胺酚的藥';
    $('.go', wc).onclick = () => {
      const els = [...shelf.children], go = $('.go', wc);
      if (done) { done = false; picked.clear(); els.forEach(e => { e.className = 'mbox'; e.setAttribute('aria-pressed', 'false'); e.querySelectorAll('mark').forEach(m => m.replaceWith(...m.childNodes)); }); go.textContent = '檢查'; $('.w-fb', wc).textContent = ''; $('.ms', wc).textContent = ''; $('.meter i', wc).style.width = '0'; return; }
      done = true; opened('s1-cabinet'); let hit = 0, miss = 0, wrong = 0, total = 0;
      BOXES.forEach((b, i) => { const has = b.ing.some(x => x[2]), e = els[i]; if (has) { total += b.ing.find(x => x[2])[1]; e.querySelectorAll('span[data-a="1"]').forEach(s => { const m = document.createElement('mark'); m.append(...s.childNodes); s.appendChild(m); }); } if (has && picked.has(i)) { hit++; e.classList.add('right'); } else if (has) { miss++; e.classList.add('miss'); } else if (picked.has(i)) { wrong++; e.classList.add('wrong'); } });
      const mi = $('.meter i', wc); mi.style.width = Math.min(100, total / 4000 * 100) + '%'; mi.className = total > 1000 ? 'over' : '';
      $('.ms', wc).textContent = `四樣各吃一次：乙醯胺酚 ${total} 毫克（一般成人單次常見上限 1000 毫克）`;
      let msg = miss === 0 && wrong === 0 ? '全部找到了。' : `找到 ${hit}／4 盒` + (miss ? `，漏掉 ${miss} 盒（虛線框）` : '') + (wrong ? `，多選了 ${wrong} 盒` : '') + '。';
      msg += '「熱退靈」「舒咳寧」「夜安」「Calmol」四個名字完全不同，成分卻都是乙醯胺酚，英文寫成 Acetaminophen 或 Paracetamol 也是同一個。四樣一起吃，單次就有 1625 毫克。乙醯胺酚過量會傷肝，而且初期常常沒有症狀。吃之前先看成分欄，不要只看商品名。';
      $('.w-fb', wc).textContent = msg; go.textContent = '重來一次';
    };
  }

  /* ================= 幫病人選劑型 ================= */
  const ws = $('#wChoose');
  if (ws) {
    const FORMS = { tab: ['💊', '錠劑'], liq: ['🥤', '液劑／糖漿'], odt: ['👅', '口溶錠'], inj: ['💉', '注射'], patch: ['🩹', '貼片'], inh: ['🌬️', '吸入劑'], supp: ['🔻', '栓劑'] };
    const SCN = [
      { who: '媽媽，帶著 3 歲的孩子', say: '「他發燒了，可是藥丸完全吞不下去，一直吐出來。」', ok: ['liq', 'supp'], best: 'liq', exp: '幼兒最常用液劑或糖漿，可以依體重精準量劑量；不肯吃或在吐的時候，退燒也有栓劑可選。' },
      { who: '25 歲，氣喘病人', say: '「我希望藥直接到肺，越快越好，又不想全身都有副作用。」', ok: ['inh'], best: 'inh', exp: '吸入劑把藥直接送到氣管和肺，用很小的劑量就有效，全身的副作用比口服少很多。' },
      { who: '80 歲的阿公，長期慢性疼痛', say: '「我常常忘記吃藥，吞藥也越來越困難。」', ok: ['patch'], best: 'patch', exp: '貼片讓藥經皮膚慢慢吸收，有些可以好幾天才換一次，不用吞，也不怕忘記一天吃好幾次。' },
      { who: '急診室，嚴重過敏', say: '「病人喉嚨腫起來、血壓一直掉！」', ok: ['inj'], best: 'inj', exp: '分秒必爭的時候，注射讓藥直接進入身體（例如肌肉或靜脈），不用等胃腸吸收，幾分鐘內就能起作用。' },
      { who: '60 歲，中風後吞嚥困難', say: '「喝水容易嗆到，可是每天都要吃藥。」', ok: ['odt', 'liq'], best: 'odt', exp: '口溶錠放在舌頭上就散開，不用配水；有些液劑也可以，但對容易嗆咳的人，稀的液體反而可能更難吞，要和醫療人員討論。' },
      { who: '上班族，偶爾頭痛', say: '「我吞藥沒問題，只想要方便帶、便宜一點。」', ok: ['tab'], best: 'tab', exp: '能吞的人，錠劑通常最方便：好保存、好攜帶、劑量準、成本低，所以是最常見的劑型。' },
    ];
    let si = 0, sc = 0; const box = $('.in', ws), prog = $('.prog', ws);
    function render() {
      const s = SCN[si]; prog.textContent = `病人 ${si + 1}／${SCN.length}`;
      box.innerHTML = `<div class="scn"><div class="who">${s.who}</div><div class="say">${s.say}</div><div class="forms">${Object.entries(FORMS).map(([k, [ic, n]]) => `<button class="opt0" data-f="${k}"><span aria-hidden="true">${ic}</span>${n}</button>`).join('')}</div><p class="w-fb" role="status"></p><div class="w-actions"><span>答對 ${sc} 位</span><button class="w-btn nx" hidden>${si < SCN.length - 1 ? '下一位病人' : '看結果'}</button></div></div>`;
      box.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
        opened('s1-choose'); const ok = s.ok.includes(b.dataset.f); if (ok) sc++;
        box.querySelectorAll('[data-f]').forEach(x => { x.disabled = true; x.classList.add('opt'); if (s.ok.includes(x.dataset.f)) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        const others = s.ok.length > 1 ? `（${s.ok.map(k => FORMS[k][1]).join('、')}都可以）` : '';
        $('.w-fb', box).textContent = (ok ? '選得好。' : `比較適合的是${FORMS[s.best][1]}。`) + others + s.exp; $('.nx', box).hidden = false;
      });
      $('.nx', box).onclick = () => { if (si < SCN.length - 1) { si++; render(); } else { prog.textContent = '完成'; box.innerHTML = `<div class="scn"><div class="say">你幫 ${sc}／${SCN.length} 位病人選對了劑型。</div><p>重點：劑型是為了解決問題而存在的。要快：注射、吸入；要穩：貼片、緩釋；吞不下：液劑、口溶錠、栓劑；要方便：錠劑。</p><button class="w-btn ag">重新開始</button></div>`; $('.ag', box).onclick = () => { si = 0; sc = 0; render(); }; } };
    }
    render();
  }
})();
