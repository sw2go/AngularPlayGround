Smooth-Scroll Problem Edge and IE 2.8.2018: 
-------------------------------------------
    window.scroll({behavior: 'smooth', top:this.Position}); geht nicht im IE und Edge.

    Abhilfe:

    extend polyfills.ts for Edge and IE:

    // npm install smoothscroll-polyfill --save ( required for edge and ie support of window.scroll)
    import * as smoothscroll from 'smoothscroll-polyfill/dist/smoothscroll.js';
    smoothscroll.polyfill();


offsetTop Problem Firefox 2.8.2018:
-----------------------------------
    Eine "ls-navigation-section" Direktive unmittelbar auf einem Component wie z.B: 
  
    <app-mycomp ls-navigation-section id="xyz"></app-mycomp> 
  
    funktioniert auf allen Browsern ausser beim Firefox. Dieser liefert einen 
    um 16px zu kleinen offsetTop Wert. 

    Abhilfe schafft wenn man die "ls-navigation-section" Direktive auf einem 
    umschliessenden <div>:
  
    <div ls-navigation-section id="xyz"><app-mycomp></app-mycomp></div>
  
    oder innerhalb des Component Template auf einem <div> setzt, dann klappt es bei allen Browsern. 
