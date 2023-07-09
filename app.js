const navItems = document.getElementsByName('nav-item')
navItems.forEach(navItem => {
    navItem.addEventListener('click', function(){ 
        let clickedId = this.id
        navItems.forEach(navItem => {
            let itemId = navItem.id
            if (itemId == clickedId) navItem.classList.add('bg-cyan-500')
            else navItem.classList.remove('bg-cyan-500')
        })
    })
})