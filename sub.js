// ----------------------------------
// Sinc 指示器动态绘制与连动逻辑
// ----------------------------------
// 绘制垂直 sinc，峰值指向右侧 (X'正向)
// ----------------------------------
// Sinc 指示器动态绘制与连动逻辑
// ----------------------------------
const sincPath = document.getElementById('sinc-path');
const sincSvg = document.getElementById('sinc-svg');
const sincListItems = document.querySelectorAll('#sinc-list li');
const sections = document.querySelectorAll('section.works-module');
const mainWrapper = document.getElementById('mainWrapper');

// 记录波峰的当前位置和目标位置
let currentPeakY = 50;
let targetPeakY = 50;

// 核心数学：在固定窗口内绘制带相位偏移的 Sinc
function drawSincWave(peakY) {
    const height = 600;   // 固定的可视窗口高度
    const period = 20;    // 周期（值越小，显示的旁瓣越多）
    const amplitude = 20; // 压低了振幅，防止波峰太尖锐
    const offsetX = 5;    // 基础向右偏移，防止左侧波谷被切掉

    let d = "";
    for (let y = 0; y <= height; y += 2) {
        let t = (y - peakY) / period;
        let sincVal = t === 0 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
        let x = offsetX + sincVal * amplitude;
        d += (y === 0 ? "M " : " L ") + x + " " + y;
    }
    sincPath.setAttribute("d", d);
}

// 渲染循环：实现波峰丝滑传递的视觉特效
function animateWave() {
    // 每帧让当前峰值向目标峰值逼近 10% (Easing)
    currentPeakY += (targetPeakY - currentPeakY) * 0.1;
    drawSincWave(currentPeakY);
    requestAnimationFrame(animateWave);
}
animateWave(); // 启动！

// 监听滚动，找出应该把波峰对准哪个字
function updateSincIndicator() {
    let currentSectionId = '';
    const scrollPosition = (window.scrollY + window.innerHeight / 2) - mainWrapper.offsetTop;

    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
            currentSectionId = sec.getAttribute('id');
        }
    });

    // 默认指着第一个
    if (!currentSectionId && sincListItems.length > 0) {
        currentSectionId = sincListItems[0].dataset.target;
    }

    sincListItems.forEach(li => {
        li.classList.remove('active');
        if (li.dataset.target === currentSectionId) {
            li.classList.add('active');
            // 精准计算出当前高亮文字相对于 SVG 画布顶部的 Y 坐标！
            const liRect = li.getBoundingClientRect();
            const svgRect = sincSvg.getBoundingClientRect();
            targetPeakY = (liRect.top - svgRect.top) + (liRect.height / 2);
        }
    });
}

window.addEventListener('scroll', () => { updateSincIndicator(); reveal(); });
setTimeout(() => { updateSincIndicator(); reveal(); }, 100);

// 点击文字依然可以平滑滚动
sincListItems.forEach(li => {
    li.addEventListener('click', () => {
        const targetId = li.dataset.target;
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
        }
    });
});

// ----------------------------------
// 通用逻辑 (复用自 index.html)
// ----------------------------------
const openBtn = document.getElementById('openMenuBtn');
const closeBtn = document.getElementById('closeMenuBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const htmlElement = document.documentElement;
const bodyElement = document.body;

function openMenu() {
    sideMenu.classList.add('active');
    mainWrapper.classList.add('menu-open');
    menuOverlay.classList.add('active');
    htmlElement.classList.add('no-scroll');
    bodyElement.classList.add('no-scroll');
}

function closeMenu() {
    sideMenu.classList.remove('active');
    mainWrapper.classList.remove('menu-open');
    menuOverlay.classList.remove('active');
    htmlElement.classList.remove('no-scroll');
    bodyElement.classList.remove('no-scroll');
}

openBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// 点击 Logo 回到首页 (指向 index.html)
const homeLogo = document.getElementById('homeLogo');
const menuHomeLogo = document.getElementById('menuHomeLogo');

// 揭示动画逻辑
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    for (let i = 0; i < reveals.length; i++) {
        let elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
setTimeout(reveal, 100);

// 页脚“回到顶部”逻辑
const footerBackToTopBtn = document.getElementById('footerBackToTop');
if (footerBackToTopBtn) {
    footerBackToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}