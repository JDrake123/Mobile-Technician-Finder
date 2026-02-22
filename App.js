// Hero Section image slider
const heroSection = document.querySelector('.heroSection');
const Images = [
    'url(Images/Img1.jpg)',
    'url(Images/Img2.jpg)',
    'url(Images/Img3.jpg)',
    'url(Images/Img4.jpg)',
    'url(Images/Img5.jpg)',
    'url(Images/Img6.jpg)'
];
let i = 0;
function changeBackgroundImage(){
    heroSection.style.backgroundImage = Images[i];
    i++;
    if(i === Images.length){
        i = 0;
    }
}
setInterval(changeBackgroundImage, 3500);
window.onload = changeBackgroundImage();