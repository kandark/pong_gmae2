import { SVG_NS } from '../settings'
import pingSound from '../../public/sounds/pong-01.wav'

export default class Ball {
    constructor(radius, boardWidth, boardHeight) {
        this.radius = radius
        this.boardHeight = boardHeight
        this.boardWidth = boardWidth
        this.direction = 1
        this.pingSound = new Audio(pingSound)

        //resets the ball in the middle of the board
        this.resets();
    }
    resets() {
        //code to center ball and for moviment
        this.x = this.boardWidth / 2
        this.y = this.boardHeight / 2


        //generates random number between -5 and 5
        // makes sure does not equal 0
        this.vy = 0
        while (this.vy == 0) {
            this.vy = Math.floor(Math.random() * 10 - 5)
        }


        this.vx = this.direction * (6 - Math.abs(this.vy))
    }

    paddleCollision(player1, player2) {
        //if vx greater than 0, detect paddle 2
        if (this.vx > 0) {
            let paddle = player2.coordinates(player2.x, player2.y, player2.width, player2.height)
            let [leftX, rightX, topY, bottomY] = paddle
            if (
                (this.x + this.radius >= leftX)
                && (this.x + this.radius <= rightX)
                && (this.y >= topY && this.y <= bottomY)
            ) {
                this.pingSound.play()
                this.vx = -this.vx
            }
        }
        else {
            let paddle = player1.coordinates(player1.x, player1.y, player1.width, player1.height)
            let [leftX, rightX, topY, bottomY] = paddle

            if (
                (this.x - this.radius <= rightX)
                && (this.x - this.radius >= leftX)
                && (this.y >= topY && this.y <= bottomY)
            ) {
                this.pingSound.play()
                this.vx = -this.vx
            }
        }

    }

    wallCollision() {

        //if ball hits left or rigth

        // reverse vx direction

        //this.vx - this.vx
        //reverse direction
        const hitLeft = this.x - this.radius <= 0
        const hitRight = this.x + this.radius >= this.boardWidth
        const hitTop = this.y - this.radius <= 0
        const hitBottom = this.y + this.radius >= this.boardHeight
        console.log(this.x)
        if (hitLeft || hitRight) {
            this.vx = -this.vx



        } else if (hitTop || hitBottom) {
            this.vy = -this.vy

        }

    }
    goal(playerWhoScored, otherPlayer) {
        playerWhoScored.score++
        if (playerWhoScored.score == 5) {
            alert('Game Over')
            playerWhoScored.score = 0
            otherPlayer.score = 0

        }


        let scored = document.getElementById('playerScore')
        scored.innerHTML = "GOOOOAAAAAALLLLLL";

        const delayInMilliseconds = 1000; //1 second

        setTimeout(function () {
            //your code to be executed after 1 second
            scored.innerHTML = ' '
        }, delayInMilliseconds);
        console.log(playerWhoScored
            .score)
        this.resets()

    }
    render(svg, player1, player2) {


        this.x += this.vx
        this.y += this.vy

        this.wallCollision()
        this.paddleCollision(player1, player2)


        let ball = document.createElementNS(SVG_NS, 'circle')
        //you code here
        ball.setAttributeNS(null, "r", this.radius)
        ball.setAttributeNS(null, "cx", this.x)
        ball.setAttributeNS(null, "cy", this.y)
        ball.setAttributeNS(null, "fill", "white")
        svg.appendChild(ball)

        const rightGoal = this.x + this.radius >= this.boardWidth
        const leftGoal = this.x - this.radius <= 0

        if (rightGoal) {
            this.goal(player1, player2)

            this.direction = 1


        } else if (leftGoal) {
            this.goal(player2, player1)

            this.direction = -1
        }

    }
}
