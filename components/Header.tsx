const Header = () => {
  return (
    <header>
        <div className="flex items-center space-x-2 md:space-x-10 ">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
        />
        <ul className="hidden space-x-4 md:flex" >
            <li>Home</li>
            <li>Tv Shows</li>
            <li>Movies</li>
            <li>New & popular</li>
            <li>My List</li>
        </ul>
        </div>
        <div> </div>
    </header>
  )
}

export default Header