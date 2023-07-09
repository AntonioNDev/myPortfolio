document.addEventListener('DOMContentLoaded', () => {
   const menuBars = document.getElementById('bars');
   const menuList = document.querySelectorAll('#top-nav ul li');
   const contactFrame = document.getElementById('contact');
   const envelope = document.getElementById('email');
   const current = document.getElementById('current');
   const title = document.getElementById('title');
   const elementsLight = document.querySelectorAll('.light');
 
   menuBars.onclick = () => {
     if (menuBars.classList.contains('fa-bars')) {
       menuBars.classList.remove('fa-bars');
       menuBars.classList.add('fa-bars-staggered');
 
       menuList.forEach((item, index) => {
         item.style.animation = `listDown 250ms ease-out ${100 + index * 100}ms 1 forwards`;
       });
     } else {
       menuBars.classList.remove('fa-bars-staggered');
       menuBars.classList.add('fa-bars');
 
       menuList.forEach((item, index) => {
         item.style.animation = `listUp 200ms ease-in ${100 + index * 100}ms 1 forwards`;
       });
     }
   };
 
   envelope.onclick = (event) => {
     if (envelope.classList.contains('fa-envelope')) {
       envelope.classList.remove('fa-envelope');
       envelope.classList.add('fa-envelope-open');
 
       contactFrame.style.display = 'flex';
     } else {
       envelope.classList.remove('fa-envelope-open');
       envelope.classList.add('fa-envelope');
 
       contactFrame.style.display = 'none';
     }
   };
 
   document.addEventListener('click', function (event) {
     if (!contactFrame.contains(event.target) && !envelope.contains(event.target)) {
       contactFrame.style.display = 'none';
       envelope.classList.remove('fa-envelope-open');
       envelope.classList.add('fa-envelope');
     }
   });
 
   document.addEventListener('scroll', () => {
     const aboutSection = document.getElementById('about');
     const projectsSection = document.getElementById('projects');
     const aboutSectionTop = aboutSection.offsetTop;
     const projectsSectionTop = projectsSection.offsetTop;
     const scrollPosition = window.pageYOffset;
 
     if (scrollPosition <= aboutSectionTop / 2) {
       current.innerHTML = 'Home';
       title.style.opacity = 0;
       elementsLight.forEach((element) => {
         element.style.color = '';
       });
     } else if (scrollPosition >= aboutSectionTop / 2 && scrollPosition <= projectsSectionTop / 1.5) {
       current.innerHTML = 'About me';
       title.style.opacity = 1;
       elementsLight.forEach((element) => {
         element.style.color = '#E0E7E9';
       });
     } else if (scrollPosition >= projectsSectionTop / 2) {
       current.innerHTML = 'Projects';
       elementsLight.forEach((element) => {
         element.style.color = '#E0E7E9';
       });
     }
   });
 });
 