
/*********************************
*****  GAME: The Game Class  *****
*********************************/

function Game () {
	this.fps = 0;
	this.state = undefined;
	this.intro = undefined;
	this.mainMenu = undefined;
	this.level = undefined;
	this.gameMenu = undefined;
	this.isPaused = false;
	this.isEscapeLocked = false;
	this.escapeLockStart = 0;

}

Game.prototype.Initialize = function () {
	this.state = main.GameStates.PRIMARY.INTRO;
	this.intro = new Introduction();
};

Game.prototype.Update = function () {
	var s, currentGameTime, elapsed;

	GameTime.Update();
	currentGameTime = GameTime.GetCurrentGameTime();
	elapsed = GameTime.GetElapsed();
	this.fps = fps.getFPS();
	if (main.hasGamePad) Input.GamePad.Update();

	// When we switch tabs the frame rate drops enough for the collision to stop working. We'll pause the game until the framerate comes back up
	if (this.fps > 30) {

		// Update Primary State first
		switch (this.state) {
			case main.GameStates.PRIMARY.INTRO:
				if (typeof this.intro === 'undefined') this.intro = new Introduction();
				this.intro.Update();
				// When the intro is finished, switch to main menu
				if (this.intro.GetDone()) {
					this.state = main.GameStates.PRIMARY.MAIN_MENU;
					this.intro = undefined;
				}
				break;
			case main.GameStates.PRIMARY.MAIN_MENU:
				if (typeof this.mainMenu === 'undefined') this.mainMenu = new MainMenu();
				this.mainMenu.Update();
				if (this.mainMenu.GetPlay()) {
					this.state = main.GameStates.PRIMARY.PLAYING;
					this.mainMenu = undefined;
				}
				break;
			case main.GameStates.PRIMARY.PLAYING:

				// Remove locks after 0.5 seconds
				if (this.isEscapeLocked && (currentGameTime - this.escapeLockStart) >= 0.5) this.isEscapeLocked = false;

				if (!this.isEscapeLocked && (Input.Keys.GetKey(Input.Keys.ESCAPE) || Input.GamePad.START.pressed)) {
					this.isPaused = (this.isPaused) ? false : true;
					this.isEscapeLocked = true;
					this.escapeLockStart = currentGameTime;
				}

				if (this.isPaused) {
					/*if (typeof this.gameMenu === 'undefined') this.gameMenu = new GameMenu(this.isPlayerDead);
					this.gameMenu.Update();
					if (this.gameMenu.QuitMainMenu() || this.gameMenu.QuitIntro()) {
						this.state = (this.gameMenu.QuitMainMenu()) ? main.GameStates.PRIMARY.MAIN_MENU : main.GameStates.PRIMARY.INTRO;
						this.isPaused = false;
						this.gameMenu = undefined;
						this.level = undefined;
					} else if (this.gameMenu.Restart()) {
						this.level = undefined;
						this.isPaused = false;
						this.gameMenu = new GameMenu(this.isPlayerDead);
						this.state = main.GameStates.PRIMARY.PLAYING;
					}*/
					console.log('PAUSED');
				} else {
					if (typeof this.level === 'undefined') this.level = new Level();
					this.level.Update();
					/*if (this.level.IsPlayerDead()) {
						this.isPaused = true;
						this.isPlayerDead = true;
					}*/
				}
				break;
			case main.GameStates.PRIMARY.OUTRO:
				break;
		}

	}

};

Game.prototype.Draw = function () {
	var s, state;
	// Clear the screen for re-drawing
	main.context.clearRect(0, 0, main.CANVAS_WIDTH, main.CANVAS_HEIGHT);

	// Update Primary State first
	switch (this.state) {
		case main.GameStates.PRIMARY.INTRO:
			if (typeof this.intro !== 'undefined') this.intro.Draw();
			state = 'INTRO';
			break;
		case main.GameStates.PRIMARY.MAIN_MENU:
			if (typeof this.mainMenu !== 'undefined') this.mainMenu.Draw();
			state = 'MAIN_MENU';
			break;
		case main.GameStates.PRIMARY.PLAYING:
			if (typeof this.level !== 'undefined') {
				this.level.Draw();
				DrawText('Time: ' + SecondsToTime(this.level.GetTimer()), 7, 20, 'normal 14pt Consolas, "Trebuchet MS", Verdana', '#FFFFFF');
			}
			
			/*if (this.isPaused) {
				if (typeof this.gameMenu !== 'undefined') this.gameMenu.Draw();
			}*/

			state = 'PLAYING';
			break;
		case main.GameStates.PRIMARY.OUTRO:
			state = 'OUTRO';
			break;
	}

	// DrawText('Primary State: ' + state, 7, 710, 'normal 14pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');

	// FPS
	DrawText('FPS: ' + this.fps, (main.CANVAS_WIDTH / 2 - 50), 20, 'normal 14pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');

};