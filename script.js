const intro = document.getElementById('intro');
const openButton = document.getElementById('openInvitation');
const header = document.getElementById('siteHeader');
const toast = document.getElementById('toast');
const menuButton = document.getElementById('menuButton');
const nav = document.querySelector('.site-header nav');

// Show the cinematic opening, then reveal the actual interactive website.
function openSite() {
  intro.classList.add('is-hidden');
  document.body.classList.remove('locked');
  header.classList.add('visible');
  setTimeout(() => intro.setAttribute('aria-hidden', 'true'), 1000);
}
document.body.classList.add('locked');
openButton.addEventListener('click', openSite);
// Automatically reveal the site after a short cinematic intro; the button can open it sooner.
window.addEventListener('load', () => setTimeout(openSite, 8500));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-reveal').forEach(section => revealObserver.observe(section));

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

document.getElementById('shareButton').addEventListener('click', async () => {
  const shareData = { title: 'دعوة زفاف أحمد وسارة', text: 'يسعدنا دعوتكم لمشاركتنا فرحة زفافنا 💛', url: location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else if (navigator.clipboard && location.protocol === 'https:') {
      await navigator.clipboard.writeText(location.href);
      showToast('تم نسخ رابط الدعوة');
    } else showToast('انسخ رابط الصفحة من شريط المتصفح لمشاركته');
  } catch (error) {
    if (error.name !== 'AbortError') showToast('يمكنك نسخ رابط الصفحة ومشاركته');
  }
});

document.getElementById('calendarButton').addEventListener('click', () => {
  // Demo date/time: edit these values in script.js to match the real event.
  const start = '20261212T190000';
  const end = '20261212T220000';
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//AR','BEGIN:VEVENT',`DTSTART:${start}`,`DTEND:${end}`,'SUMMARY:زفاف أحمد وسارة','LOCATION:قاعة الأندلس للاحتفالات، غزة - فلسطين','DESCRIPTION:يسعدنا حضوركم ومشاركتنا فرحة الزفاف','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'wedding-invitation.ics'; link.click();
  URL.revokeObjectURL(url);
  showToast('تم تجهيز ملف الموعد للتقويم');
});
