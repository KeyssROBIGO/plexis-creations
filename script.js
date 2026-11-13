(function(){
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // En-tête au défilement
  var header = document.getElementById('header');
  var onScroll = function(){ header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

  // Menu mobile
  var toggle = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  links.addEventListener('click', function(e){
    if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  });

  // Menu déroulant « Nos univers »
  var dd = document.querySelector('.dd');
  if (dd) {
    var ddBtn = dd.querySelector('.dd-btn');
    ddBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = dd.classList.toggle('open');
      ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){ if (!dd.contains(e.target)) { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded','false'); } });
  }

  // Apparition au défilement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var sib = Array.prototype.filter.call(entry.target.parentElement.children, function(n){ return n.classList.contains('reveal'); });
        entry.target.style.transitionDelay = Math.min(Math.max(0, sib.indexOf(entry.target)) * 60, 300) + 'ms';
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  // FAQ : une seule question ouverte à la fois
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function(item){
    item.addEventListener('toggle', function(){
      if (!item.open) return;
      items.forEach(function(o){ if (o !== item) o.open = false; });
    });
  });

  // Visionneuse photos
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.gallery .tile'));
  var lb = document.getElementById('lightbox');
  if (lb && tiles.length) {
    var lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
    var current = 0, lastFocus = null;
    var show = function(i){
      current = (i + tiles.length) % tiles.length;
      var t = tiles[current];
      lbImg.src = t.dataset.full; lbImg.alt = t.querySelector('img').alt;
      lbCap.textContent = t.querySelector('h3').textContent;
    };
    var openLb = function(i){ lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow='hidden'; document.getElementById('lbClose').focus(); };
    var closeLb = function(){ lb.classList.remove('open'); document.body.style.overflow=''; if (lastFocus) lastFocus.focus(); };
    tiles.forEach(function(t, i){ t.addEventListener('click', function(){ openLb(i); }); });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', function(){ show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function(){ show(current + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // Page devis : univers pré-sélectionné depuis le lien (?univers=…)
  var sel = document.getElementById('univers');
  if (sel) {
    var u = new URLSearchParams(location.search).get('univers');
    if (u) Array.prototype.forEach.call(sel.options, function(o){ if (o.dataset.key === u) sel.value = o.value; });
  }
})();
