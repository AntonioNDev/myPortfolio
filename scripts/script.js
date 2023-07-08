document.addEventListener('DOMContentLoaded', () => {
   const menuBars = document.getElementById('bars');
   const menuList = document.querySelectorAll('#top-nav ul li');
   const contactFrame = document.getElementById('contact');
   const envelope = document.getElementById('email');

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

   envelope.onclick = () => { /* Contact frame animation */
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
   
   
});
