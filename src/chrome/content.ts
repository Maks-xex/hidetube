
let visibility = "none";
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    if(document.querySelectorAll(".ytp-ce-element")){
      [...document.querySelectorAll(".ytp-ce-element") as any].forEach((div) => div.style.display = visibility);
    }
    (document.querySelector(".ytp-chrome-bottom") as any).style.display = visibility;
    (document.querySelector(".ytp-chrome-top") as any).style.display = visibility;
    if((document.querySelector(".annotation") as any)){
      (document.querySelector(".annotation") as any).style.display = visibility;
    }
    if (visibility === "none") {
      visibility = "";
    } else {
      visibility = "none";
    }
  }
});

export { }