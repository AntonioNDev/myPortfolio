

document.addEventListener('DOMContentLoaded', () => { 
   let container = document.getElementById("container");
   let cat = document.getElementById("meow");
   let stef = document.getElementById("stef");
   let prof = document.getElementById("prof");
   var audio = new Audio("staniMome.mp3");

   document.getElementById("button").onclick = () => {
      container.style.display = "flex";
      container.style.animationPlayState = "running";

      cat.style.transform = "scale(5)";
      cat.style.color = 'red';

      stef.style.animationPlayState = 'running';
      prof.style.animationPlayState = 'running';

      audio.play();
   }
});