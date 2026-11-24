// 從零開始學藥 · shared page behaviour: theme toggle, quiz, outcome checklist, click-to-load lab embed.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  // theme
  const root = document.documentElement, saved = store.get('lp-theme', null);
  if (saved) root.dataset.theme = saved;
  const tb = $('#themeBtn');
  if (tb) tb.onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark'; store.set('lp-theme', root.dataset.theme);
  };

  // quiz: <div class="quiz" data-quiz='[{"q":..,"o":[..],"a":1,"e":".."}]'>
  document.querySelectorAll('.quiz[data-quiz]').forEach(box => {
    const Q = JSON.parse(box.dataset.quiz); let i = 0, score = 0, done = false;
    box.innerHTML = '<div class="head"><span>你弄懂了嗎？</span><span class="n"></span></div><p class="q"></p><div class="opts"></div><p class="fb" role="status"></p><div class="foot"><button class="btn" disabled>下一題</button></div>';
    const n = $('.n', box), q = $('.q', box), opts = $('.opts', box), fb = $('.fb', box), next = $('.btn', box);
    function show() {
      const it = Q[i]; n.textContent = `第 ${i + 1} 題，共 ${Q.length} 題`; q.textContent = it.q; fb.textContent = ''; opts.innerHTML = '';
      it.o.forEach((t, k) => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => pick(k, b); opts.appendChild(b); });
      next.disabled = true; next.textContent = i === Q.length - 1 ? '看結果' : '下一題';
    }
    function pick(k, b) {
      const it = Q[i], bs = [...opts.children]; bs.forEach(x => x.disabled = true); bs[it.a].classList.add('right');
      if (k === it.a) { score++; fb.textContent = '答對了。' + it.e; } else { b.classList.add('wrong'); fb.textContent = '再想想。' + it.e; }
      next.disabled = false;
    }
    next.onclick = () => {
      if (done) { done = false; i = 0; score = 0; show(); return; }
      if (i < Q.length - 1) { i++; show(); return; }
      done = true; n.textContent = '完成'; opts.innerHTML = ''; fb.textContent = '';
      q.textContent = `你答對了 ${score}／${Q.length} 題。` + (score === Q.length ? '這個階段的重點你已經掌握了。' : '回到上面的 Lab 再玩一次，答案都在裡面。');
      next.textContent = '重新作答';
    };
    show();
  });

  // checklist: <ul class="check" data-key="..."> + .count
  document.querySelectorAll('.check[data-key]').forEach(ul => {
    const key = ul.dataset.key, boxes = [...ul.querySelectorAll('input')], cnt = document.querySelector(`[data-count="${key}"]`), v = store.get(key, []);
    const upd = () => { const s = boxes.map(b => b.checked); if (cnt) cnt.textContent = `${s.filter(Boolean).length} / ${s.length}`; store.set(key, s); };
    boxes.forEach((b, i) => { b.checked = !!v[i]; b.onchange = upd; }); upd();
  });

  // lab embed: click to load the iframe; the lab reports its height with {type:'kapri:height'}
  document.querySelectorAll('.embed[data-src]').forEach(box => {
    const btn = $('.start', box), stage = $('.stagebox', box);
    btn.onclick = () => {
      const f = document.createElement('iframe'); f.src = box.dataset.src; f.title = box.dataset.title || 'Lab'; f.allow = 'autoplay'; f.loading = 'eager';
      stage.replaceWith(f);
      window.addEventListener('message', (e) => { if (e.source === f.contentWindow && e.data && e.data.type === 'kapri:height') f.style.height = e.data.h + 'px'; });
      f.focus();
      store.set('lp-opened-' + (box.dataset.id || ''), true);
    };
  });
  // "opened" badges on stage pages
  document.querySelectorAll('[data-opened]').forEach(el => { if (store.get('lp-opened-' + el.dataset.opened, false)) { el.textContent = '玩過了'; el.classList.add('done'); } });
})();
