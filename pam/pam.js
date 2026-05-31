(function () {
  'use strict';
  var root = document.querySelector('.pam') || document;

  // ─── FAQ accordion ───
  var faqBtns = root.querySelectorAll('.faq-btn');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      faqBtns.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var oa = document.getElementById(other.getAttribute('aria-controls'));
          if (oa) oa.classList.remove('faq-answer--open');
        }
      });
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('faq-answer--open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('faq-answer--open');
      }
    });
  });

  // ─── Dots grid: 30 dots, light up on scroll into view ───
  var grid = root.querySelector('.dots-grid');
  if (grid) {
    for (var i = 0; i < 30; i++) {
      var dot = document.createElement('div');
      dot.className = 'dot';
      grid.appendChild(dot);
    }
    var dots = grid.querySelectorAll('.dot');
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && 'IntersectionObserver' in window) {
      var lit = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !lit) {
            lit = true;
            dots.forEach(function (d, idx) {
              setTimeout(function () { d.classList.add('lit'); }, idx * 45);
            });
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(grid);
    } else {
      dots.forEach(function (d) { d.classList.add('lit'); });
    }
  }

  // ─── Hero reveal (failsafe: kalau JS jalan, animate; default dah visible) ───
  var hero = root.querySelector('.reveal-init');
  if (hero) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && document.readyState !== 'complete') {
      window.addEventListener('load', function () {
        setTimeout(function () { hero.classList.add('reveal-done'); }, 80);
      });
    } else {
      hero.classList.add('reveal-done');
    }
  }

  // ─── Demo marquee: clone untuk seamless loop + lightbox (semua track) ───
  var tracks = root.querySelectorAll('.marquee__track');
  var reduceMarquee = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tracks.length && !reduceMarquee) {
    tracks.forEach(function (track) {
      var originals = Array.prototype.slice.call(track.children);
      originals.forEach(function (node) {
        var clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  if (lightbox && lightboxImg) {
    var gallery = [];
    var galleryIndex = 0;
    (function buildGallery() {
      var nodes = root.querySelectorAll('.marquee__item:not([aria-hidden="true"]) img');
      gallery = Array.prototype.map.call(nodes, function (img) {
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' };
      });
    })();

    function showAt(i) {
      if (!gallery.length) return;
      galleryIndex = (i + gallery.length) % gallery.length;
      lightboxImg.src = gallery[galleryIndex].src;
      lightboxImg.alt = gallery[galleryIndex].alt;
    }

    root.querySelectorAll('.marquee__item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src');
        var idx = 0;
        for (var k = 0; k < gallery.length; k++) { if (gallery[k].src === src) { idx = k; break; } }
        showAt(idx);
        if (typeof lightbox.showModal === 'function') lightbox.showModal();
      });
    });

    var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    var nextBtn = lightbox.querySelector('.lightbox__nav--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { showAt(galleryIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showAt(galleryIndex + 1); });

    var closeBtn = lightbox.querySelector('.lightbox__close');
    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showAt(galleryIndex - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); showAt(galleryIndex + 1); }
    });
  }

})();
