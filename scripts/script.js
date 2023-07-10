document.addEventListener('DOMContentLoaded', () => {
   const menuBars = document.getElementById('bars');
   const menuList = document.querySelectorAll('#top-nav ul li');
   const contactFrame = document.getElementById('contact');
   const envelope = document.getElementById('email');
   const current = document.getElementById('current');
   const title = document.getElementById('title');
   const elementsLight = document.querySelectorAll('.light');
   const card = document.getElementById("card");
   const textElements = card.querySelectorAll("li");
 
   menuBars.onclick = () => { /* Menu bars animation */
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
 
   envelope.onclick = (event) => { /* Envelope animation */
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
 
   document.addEventListener('click', function (event) { /* Envelope frame animation */
     if (!contactFrame.contains(event.target) && !envelope.contains(event.target)) {
       contactFrame.style.display = 'none';
       envelope.classList.remove('fa-envelope-open');
       envelope.classList.add('fa-envelope');
     }
   });
 
   document.addEventListener('scroll', () => { /* Scroll events */
      const aboutSection = document.getElementById('about');
      const projectsSection = document.getElementById('projects');
      const aboutSectionTop = aboutSection.offsetTop;
      const projectsSectionTop = projectsSection.offsetTop;
      const scrollPosition = window.scrollY;
      
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

  card.addEventListener("mousemove", handleMouseMove); /* Skills card animation */
  card.addEventListener("mouseleave", handleMouseLeave);

  function handleMouseMove(event) {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rotateX = (mouseY - cardCenterY) / 10;
    const rotateY = (mouseX - cardCenterX) / 10;

    card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg)`;

    textElements.forEach((text) => {
      const textRect = text.getBoundingClientRect();
      const textCenterX = textRect.left + textRect.width / 2;
      const textCenterY = textRect.top + textRect.height / 2;

      const dx = Math.abs(mouseX - textCenterX);
      const dy = Math.abs(mouseY - textCenterY);

      const scale = 1 + (dx + dy) / 800;

      text.style.transform = `scale(${scale})`;
    });
  }

  function handleMouseLeave() {
  card.style.transform = "none";
  textElements.forEach((text) => {
    text.style.transform = "none";
  });
  }
});
 