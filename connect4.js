//player is now instantiated with a color;
class Player {
	constructor(color) {
		this.color = color
	}
}
//Legit- EVERYTHING else is contained in the game class;
class Game {
	//remember we're writing a blue print for an object that doesn't exist yet;
	//when we call it, and create a new object, we want these vars to be able to reference
	//this constructor;
	//To reference these from a new object we MUST define them with the context of this class;
	// That means this.param or this.method on EVERY param and method;
	constructor(p1, p2, height = 6, width = 7) {
		this.players = [p1, p2]
		this.height = height
		this.width = width
		this.currPlayer = p1
		this.gameOver = false
		//define the methods once we have the params
		this.makeJsBoardStructure()
		this.makeHtmlBoard()
	}
	makeJsBoardStructure() {
		this.board = []
		for (let y = 0; y < this.height; y++) {
			//remember we must use this.board to bind properly;
			this.board.push(Array.from({ length: this.length }))
		}
	}
	makeHtmlBoard() {
		const board = document.getElementById('board')
		//board.innerHTML = '';
		// Same-same
		const top = document.createElement('tr')
		top.setAttribute('id', 'column-top')
		//NEW- We need to remove the topper event clicker at the end;
		//to do this we rename it, remembering to rebind the context of this
		//so that thto the HtmlBoard we
		this.handleTopperClick = this.handleClick.bind(this)
		console.log(this)
		top.addEventListener('click', this.handleTopperClick)

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td')
			headCell.setAttribute('id', x)
			top.append(headCell)
		}
		board.append(top)
		// make main part of board:
		//iterate to find num of columns;
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr')
			//iterate to create a row for each cell in column;
			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td')
				cell.setAttribute('id', `${y}-${x}`)
				row.append(cell)
			}
			//add that row at each iteration of y;
			board.append(row)
		}
	}
	findTheRightSpot(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y
			}
		}
		return null
	}
	placeInTable(y, x) {
		const piece = document.createElement('div')
		//stlye the dot;
		piece.classList.add('piece')
		piece.style.backgroundColor = this.currPlayer.color
		piece.style.top = -50 * (y + 2)
		//select the coresponding cell;
		const spot = document.getElementById(`${y}-${x}`)
		//add the dot to the cell;
		spot.append(piece)
	}

	endGame(msg) {
		alert(msg)
		const top = document.querySelector('#column-top')
		top.removeEventListener('click', this.handleTopperClick)
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(e) {
		// get x from ID of clicked cell
		const x = +e.target.id

		// get next spot in column (if none, ignore click)
		const y = this.findTheRightSpot(x)
		if (y === null) {
			return
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer
		this.placeInTable(y, x)

		// check for tie
		if (this.board.every((row) => row.every((cell) => (cell.innerHtml = '')))) {
			return this.endGame('Tie!')
		}

		// check for win
		if (this.checkForWin()) {
			this.gameOver = true
			return this.endGame(`The ${this.currPlayer.color} player won!`)
		}

		// switch players
		this.currPlayer =
			this.currPlayer === this.players[0] ? this.players[1] : this.players[0]
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		const _win = (cells) =>
			cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer
			)

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				]
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				]
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				]
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				]

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true
				}
			}
		}
	}
}
document.getElementById('start-btn').addEventListener('click', () => {
	let p1 = new Player(document.getElementById('c1').value)
	let p2 = new Player(document.getElementById('c2').value)
	new Game(p1, p2)
})
