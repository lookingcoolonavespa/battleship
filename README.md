# battleship
live demo: https://lookingcoolonavespa.github.io/battleship/dist/

## app in action
![screenshot of home page](https://i.postimg.cc/9X8KJ9Ms/Screenshot-from-2021-12-31-17-15-25.png)

![screenshot of story mode](https://i.postimg.cc/nrPWzygn/Screenshot-from-2021-12-31-17-19-26.png)

![screenshot of ship placement](https://i.postimg.cc/65FSNNC0/Screenshot-from-2021-12-31-17-16-13.png)

![screenshot of game](https://i.postimg.cc/HsrKKL8n/Screenshot-from-2021-12-31-17-16-30.png)

## features
- play battleship against (a somewhat smart) ai
- features a story mode or quick start your way into a game if that's what you're after
- keep gameplay sound on or turn it off
- fully responsive

## tech stack
- vanilla js
- html/css

## project goals
- get more comfortable with jest test suite

## challenges i faced
- **Running code sequentially** - This was my first dive into writing promise driven code. I've used promises before to fetch data and display data, but writing promises here was a little different. I had to decide _how_ promises were to resolve (eg. on click?, when the animation ends?) rather than just waiting for a response. 

For this project I chose .then() chaining over async/await. The syntax just felt more correct and intuitive to me, but it could've been written either way. 

The most difficult part was figuring out how to run the place ship sequence. I tried going with a while loop at first, but none of the solutions were very elegant to me so I ended up going with promises. Making promises work wasn't easy, but once I figured out how to run the sequence recursively, the rest was smooth sailing.
