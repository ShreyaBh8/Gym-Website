function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('open');
}
const a=document.querySelectorAll('.a')
a.forEach((ach)=>{
    ach.addEventListener('click',()=>{
        changeColor(ach,a)
    })
})
const days = document.querySelectorAll('.days');
const t1Array = [...document.querySelectorAll('.t1')];
const t2Array = [...document.querySelectorAll('.t2')];
const t3Array = [...document.querySelectorAll('.t3')];
const t4Array = [...document.querySelectorAll('.t4')];
const t5Array = [...document.querySelectorAll('.t5')];

let time = {
    "Monday": ["10:00AM - 11:30AM", "2:00PM - 3:30PM"],
    "Tuesday": ["2:00PM - 3:30PM", "10:00AM - 11:30AM"],
    "Wednesday": ["10:00AM - 11:30AM", "2:00PM - 3:30PM"],
    "Thursday": ["2:00PM - 3:30PM", "10:00AM - 11:30AM"],
    "Friday": ["10:00AM - 11:30AM", "2:00PM - 3:30PM"]
};

days.forEach((day) => {
    day.addEventListener('click', () => {
        changeColor(day,days)
        const selectDay = day.innerText.trim()
        // Clear the previous day's times
        t1Array.forEach(t1 => t1.innerText = "");
        t2Array.forEach(t2 => t2.innerText = "");
        t3Array.forEach(t3 => t3.innerText = "");
        t4Array.forEach(t4 => t4.innerText = "");
        t5Array.forEach(t5 => t5.innerText = "");

        // Update the selected day's time
        if (selectDay === "Monday") {
            t1Array[0].innerText = time[selectDay][0];
            t1Array[1].innerText = time[selectDay][1];
        }
        else if (selectDay === "Tuesday") {
            t2Array[0].innerText = time[selectDay][0];
            t2Array[1].innerText = time[selectDay][1];
        }
        else if (selectDay === "Wednesday") {
            t3Array[0].innerText = time[selectDay][0];
            t3Array[1].innerText = time[selectDay][1];
        }
        else if (selectDay === "Thursday") {
            t4Array[0].innerText = time[selectDay][0];
            t4Array[1].innerText = time[selectDay][1];
        }
        else if (selectDay === "Friday") {
            t5Array[0].innerText = time[selectDay][0];
            t5Array[1].innerText = time[selectDay][1];
        }
    });
});

function changeColor(ac,links) {
    links.forEach(function (l) {
        l.style.color = '';
    });
    ac.style.color = '#09ea09';
}
const classes = document.querySelectorAll('.class-card')
const heading = document.querySelector('#heading')
const para = document.querySelector('#para')
const gymImg = document.querySelector('.gym-img')
const classAbout = [
    {
        heading: "First Training Class",
        back: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&cs=tinysrgb&w=600",
        para: "Phasellus convallis mauris sed elementum vulputate. Donec posuere leo sed dui eleifend hendrerit. Sed suscipit suscipit erat, sed vehicula ligula. Aliquam ut sem fermentum sem tincidunt lacinia gravida aliquam nunc. Morbi quis erat imperdiet, molestie nunc ut, accumsan diam."
    },
    {
        heading: "Second Training Class",
        back: "https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=600",
        para: "Integer dapibus, est vel dapibus mattis, sem mauris luctus leo, ac pulvinar quam tortor a velit. Praesent ultrices erat ante, in ultricies augue ultricies faucibus. Nam tellus nibh, ullamcorper at mattis non, rhoncus sed massa. "
    },
    {
        heading: "Third Training Class",
        back: "https://images.pexels.com/photos/791764/pexels-photo-791764.jpeg?auto=compress&cs=tinysrgb&w=600",
        para: "Fusce laoreet malesuada rhoncus. Donec ultricies diam tortor, id auctor neque posuere sit amet. Aliquam pharetra, augue vel cursus porta, nisi tortor vulputate sapien, id scelerisque felis magna id felis."
    },
    {
        heading: "Fourth Training Class",
        back: "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=600",
        para: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ultrices elementum odio ac tempus. Etiam eleifend orci lectus, eget venenatis ipsum commodo et."
    }
]
classes.forEach((classItem) => {
    classItem.addEventListener('click', () => {
        changeColor(classItem,classes)
        const selectedClass = classItem.innerText.trim();

        for (let i = 0; i < classAbout.length; i++) {
            if (classAbout[i].heading === selectedClass) {
                heading.innerText = classAbout[i].heading;
                gymImg.style.backgroundImage = `url(${classAbout[i].back})`;
                para.innerText = classAbout[i].para;
                zbreak;
            }
        }
    });
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('#about');

    // offsetTop gives the distance from the top of the document to the top of the selected section (aboutSection)
    const aboutTop = aboutSection.offsetTop;

    // Get the current scroll position. This value increases as the user scrolls down.
    const scrollY = window.scrollY;

    //This checks if the user has scrolled  past the top of the "About" section
    if (scrollY >= aboutTop) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


const swiper = new Swiper(".slider-wrapper", {
    // Optional parameters
    loop: true,
    spaceBetween: 25,
    grabCursor: true,

    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});


