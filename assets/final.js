// 階段 6 · Lab 04 期末挑戰：林家的藥櫃大會診（#wFinal）。15 張卡片，12 張有問題、3 張做得對。
// 人物、藥名都是虛構的；每張卡片連回教過這件事的 Lab。
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const wf = $('#wFinal'); if (!wf) return;
  const opened = (id) => { try { localStorage.setItem('lp-opened-' + id, 'true'); } catch (e) {} };
  const CARDS = [
    { who: '爸爸 · 45 歲', col: '#3f6fe0', txt: '感冒頭痛，吃了綜合感冒膠囊（成分有乙醯胺酚），覺得不夠，又加一顆「熱退靈」（乙醯胺酚 500 mg）。', bad: true, why: '兩樣都含乙醯胺酚，等於同一種藥吃兩次，加起來可能超過上限、傷肝。吃之前先看成分欄。', lab: ['lab-cabinet.html', '階段 1 · 藥櫃裡的同一個成分'] },
    { who: '奶奶 · 78 歲', col: '#e58a9a', txt: '降血壓藥藥名後面有「XR」，奶奶吞不下，家人把它磨成粉拌進稀飯。', bad: true, why: 'XR 是緩釋劑型，磨碎會讓一整天的藥一次釋放出來。吞不下要問藥師有沒有別的劑型，不要自己磨。', lab: ['lab-forms.html', '階段 1 · 速釋、腸溶、緩釋'] },
    { who: '媽媽 · 42 歲', col: '#e9a92e', txt: '一天一次的藥早上忘了吃，晚上想起來，乾脆一次吃兩顆補回來。', bad: true, why: '一次吃兩顆會讓濃度衝太高。漏吃怎麼補要看藥，一般不要自己加倍，問藥師或看仿單。', lab: ['lab-schedule.html', '階段 2 · 一天要吃幾次'] },
    { who: '奶奶 · 78 歲', col: '#e58a9a', txt: '安眠藥吃了半年，覺得越來越沒效，自己改成一次吃兩顆。', bad: true, why: '這可能是耐受性。自己加量只會讓身體再適應，副作用和跌倒風險卻變大；要停或換也要醫師慢慢調整。', lab: ['lab-tolerance.html', '階段 3 · 耐受性'] },
    { who: '爸爸 · 45 歲', col: '#3f6fe0', txt: '長期吃一種需要抽血監測的藥。皮膚科新開了抗黴菌藥，爸爸沒提到自己在吃什麼。', bad: true, why: '有些抗黴菌藥會擋住肝臟的代謝酵素，讓原本的藥濃度一天天升高。看任何一科，都要說出正在吃的所有藥。', lab: ['lab-inhibit.html', '階段 4 · 酵素被擋住'] },
    { who: '爺爺 · 80 歲', col: '#7b5bb5', txt: '睡前吃安眠藥，再配兩杯高粱酒，說這樣比較好睡。', bad: true, why: '安眠藥和酒都會抑制腦部，效果會疊加，可能讓呼吸變淺，非常危險。', lab: ['lab-additive.html', '階段 4 · 效果疊加'] },
    { who: '小妹 · 3 歲 · 14 公斤', col: '#2fa05a', txt: '發燒，藥袋寫「每次 7 mL」，媽媽用家裡吃飯的湯匙舀一匙給她。', bad: true, why: '家用湯匙的容量差很多，可能多一倍也可能少一半。量藥水要用藥局附的量藥空針或量杯。', lab: ['lab-syrup.html', '階段 5 · 小孩不是縮小的大人'] },
    { who: '奶奶 · 78 歲', col: '#e58a9a', txt: '最近常頭暈，去附近診所又多拿了一包暈眩藥，沒有人看過她其他的藥。', bad: true, why: '頭暈可能是原本某種藥的副作用；再加一種會讓人想睡的藥，可能更容易跌倒，這就是處方瀑布。', lab: ['lab-elder.html', '階段 5 · 長輩的藥'] },
    { who: '姊姊 · 30 歲 · 懷孕 8 週', col: '#c4566f', txt: '有氣喘，怕藥傷到寶寶，自己把每天用的氣喘藥停掉了。', bad: true, why: '氣喘發作沒控制好，對媽媽和寶寶也有風險。懷孕時不要自己停藥，先和醫師、藥師討論。', lab: ['lab-preg.html', '階段 5 · 懷孕用藥'] },
    { who: '哥哥 · 17 歲', col: '#e5484d', txt: '抗生素吃了 2 天就不痛了，剩下的收進抽屜，打算下次感冒再吃。', bad: true, why: '沒照療程吃可能復發、留下比較耐藥的細菌；感冒大多是病毒，吃抗生素也沒用。剩下的拿去藥局回收。', lab: ['lab-abx.html', '階段 6 · 抗生素的療程'] },
    { who: '全家', col: '#566c74', txt: '所有的藥都放在浴室的鏡櫃裡，方便刷牙時順便吃。', bad: true, why: '浴室又熱又濕，藥可能提早變質，有效期限也不算數了。藥要放在陰涼、乾燥、小孩拿不到的地方。', lab: ['lab-store.html', '階段 6 · 藥的保存'] },
    { who: '哥哥 · 17 歲', col: '#e5484d', txt: '氣喘發作時拿起噴霧吸入劑，一按就用力猛吸，吸完馬上開口說話。', bad: true, why: '吸太快藥會撞在喉嚨，吸完不閉氣又會呼出去，真正到肺的很少。慢慢深吸、閉氣約 10 秒，必要時用輔助艙。', lab: ['lab-inhaler.html', '階段 6 · 吸入劑'] },
    { who: '大嫂 · 32 歲 · 哺乳中', col: '#38c0a6', txt: '牙痛，吃醫師開的短效止痛藥，而且選在剛餵完奶的時候吃。', bad: false, why: '做得好。很多藥可以邊吃邊餵；選短效的藥、剛餵完再吃，寶寶接觸到的更少。有疑問一樣可以問藥師。', lab: ['lab-milk.html', '階段 5 · 哺乳用藥'] },
    { who: '爺爺 · 80 歲', col: '#7b5bb5', txt: '每次看診，都把正在吃的所有藥袋（包括自己買的保健食品）一起帶給醫師看。', bad: false, why: '做得好。醫師、藥師看得到所有的藥，才能發現重複、交互作用和處方瀑布。', lab: ['lab-elder.html', '階段 5 · 長輩的藥'] },
    { who: '小妹 · 3 歲', col: '#2fa05a', txt: '抗過敏藥水的藥袋寫「開封後冷藏」，媽媽一回家就把它放進冰箱。', bad: false, why: '做得好。照標示存放，藥的品質才有保證；需要冷藏的藥放在室溫可能很快變弱。', lab: ['lab-store.html', '階段 6 · 藥的保存'] },
  ];
  const NBAD = CARDS.filter(c => c.bad).length;
  $('.in', wf).innerHTML = '<p class="fn-intro">林家一家人的藥櫃和用藥習慣。點一下你覺得<b>有問題</b>的卡片（會出現紅色旗子），選好以後按「檢查」。小心：有幾張其實做得很好。</p><div class="fn-grid"></div><div class="sum"><button class="w-btn go">檢查</button><span class="fn-count"></span></div><div class="w-verdict fn-res" role="status" hidden></div>';
  const grid = $('.fn-grid', wf), picked = new Set(); let done = false;
  CARDS.forEach((c, i) => {
    const e = document.createElement('button'); e.className = 'fn-card'; e.setAttribute('aria-pressed', 'false');
    e.innerHTML = `<div class="fn-top" style="background:${c.col}"></div><div class="fn-who">${c.who}<span class="fn-flag" aria-hidden="true">⚑</span></div><p class="fn-txt">${c.txt}</p><div class="fn-why" hidden></div>`;
    e.onclick = () => { if (done) return; picked.has(i) ? picked.delete(i) : picked.add(i); e.setAttribute('aria-pressed', picked.has(i)); count(); };
    grid.appendChild(e);
  });
  const count = () => { $('.fn-count', wf).textContent = `已標記 ${picked.size} 張`; $('.prog', wf).textContent = done ? '' : `找出有問題的卡片`; };
  count();
  $('.go', wf).onclick = () => {
    const els = [...grid.children], go = $('.go', wf), res = $('.fn-res', wf);
    if (done) { done = false; picked.clear(); els.forEach(e => { e.className = 'fn-card'; e.setAttribute('aria-pressed', 'false'); $('.fn-why', e).hidden = true; }); res.hidden = true; go.textContent = '檢查'; count(); return; }
    done = true; opened('final'); let hit = 0, miss = 0, wrong = 0;
    CARDS.forEach((c, i) => {
      const e = els[i], p = picked.has(i), w = $('.fn-why', e);
      const tag = c.bad ? (p ? ['right', '✓ 你找到了'] : ['miss', '漏掉了：有問題']) : (p ? ['wrong', '✕ 其實做得對'] : ['right', '✓ 做得對']);
      if (c.bad && p) hit++; else if (c.bad) miss++; else if (p) wrong++;
      e.classList.add(tag[0]); w.hidden = false;
      w.innerHTML = `<b>${tag[1]}</b>${c.why}<a href="${c.lab[0]}" onclick="event.stopPropagation()">複習：${c.lab[1]} →</a>`;
    });
    const perfect = miss === 0 && wrong === 0;
    res.hidden = false; res.className = 'w-verdict fn-res' + (perfect ? '' : ' bad');
    res.innerHTML = `<b>${perfect ? '全部答對！你已經可以幫家人做一次用藥檢查了。' : `找到 ${hit}／${NBAD} 個問題` + (wrong ? `，誤判 ${wrong} 張做得對的` : '')}</b>${perfect ? '十二個問題分別來自六個階段。真實生活裡遇到不確定的情況，最好的下一步是把藥帶去問藥師。' : '虛線框是漏掉的問題，紅框是其實做得對的。每張卡片下面都有說明和複習連結，看完可以按「重來一次」。'}`;
    go.textContent = '重來一次'; count();
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
})();
