

 document.addEventListener("DOMContentLoaded", function () {
   const includeHTML = (el, url) => {
     fetch(url)
       .then((response) => response.text())
       .then((data) => {
         el.innerHTML = data;
       })
       .catch((err) => console.log(err));
   };

   includeHTML(document.getElementById("header"), "header.html");
   includeHTML(document.getElementById("aside"), "aside.html");
    includeHTML(document.getElementById("footer"), "footer.html");
 });