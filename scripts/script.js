document.addEventListener('DOMContentLoaded', () => {
   const menuBars = document.getElementById('bars');
   const menuList = document.querySelectorAll('#top-nav ul li');
   const contactFrame = document.getElementById('contact');
   const envelope = document.getElementById('email');
   const current = document.getElementById('current');
   const title = document.getElementById('title');
   const elementsLight = document.querySelectorAll('.light');


   menuBars.onclick = () => { /* Menu list animation */
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

   envelope.onclick = (event) => { /* Contact frame animation */

      if (envelope.classList.contains('fa-envelope')) {
         envelope.classList.remove('fa-envelope');
         envelope.classList.add('fa-envelope-open');

         contactFrame.style.display = 'flex';
      } else {
         envelope.classList.remove('fa-envelope-open');
         envelope.classList.add('fa-envelope');

         contactFrame.style.display = 'none';  
      }
   }

   document.addEventListener('click', function(event) { /* When the user clicks anywhere on the screen the frame closes */
      if (!contactFrame.contains(event.target) && !envelope.contains(event.target)) {
        contactFrame.style.display = 'none';
        envelope.classList.remove('fa-envelope-open');
        envelope.classList.add('fa-envelope');
      }
   });
   
   document.addEventListener('scroll', () => { /* scroll animations event */
      var aboutSection = document.getElementById('about');
      var projectsSection = document.getElementById('projects');
      var aboutSectionTop = aboutSection.offsetTop;
      var projectsSectionTop = projectsSection.offsetTop;

      var scrollPosition = window.scrollY;
      
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
           element.style.color = '#E0E7E9'; // Reset the color to default
         });
      } else if (scrollPosition >= projectsSectionTop / 2){
         current.innerHTML = 'Projects';
         elementsLight.forEach((element) => {
            element.style.color = '#E0E7E9'; // Reset the color to default
          });
      }

      console.log(projectsSectionTop);
      console.log(scrollPosition);
    });

});
