let canvas = document.querySelector("canvas");
let coins_earned = 0;
let walletAddress = localStorage.getItem("walletAddress"); // To retrieve the walletAddress from localStorage
let coins_won = document.getElementById("coins-won");
const popupContainer = document.getElementById("popup-container");
const claimRewardButton = document.getElementById("claim-reward-button");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let animationID_animate;
let animationID_gameloop;

const image = new Image();
const chest_image = new Image();
const shark = new Image();
image.src = "/src/assets/subb.png";
chest_image.src = "/src/assets/chest.png";
shark.src = "/src/assets/shark.png";

const ctx = canvas.getContext("2d");
// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**--*-*-*-*-**-*-*--*-*-*-*-*-**--**-*-*--**-*-*-*--**-*-*-*-*-*-*-*-*//
// *********************************************************************************************************//

// Define the initial position and size of the submarine
const subWidth = 120;
const subHeight = 70;
let subX = subWidth / 2;
let subY = canvas.height / 2 - 200;

// Define the initial position and size of the grabber
const grabberWidth = 20;
let grabberHeight = 0;

// Define grabber animation parameters
const grabSpeed = 10;
const maxGrabHeight = 100;
let grabbing = false;

// Create variables to add vertical movement when moving left or right
let verticalOffset = 0;
const maxVerticalOffset = 10; // Adjust as needed

// Create an object to track key states
const keyState = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
};

// Define the initial positions and size of the treasure chests
const chestWidth = 120;
const chestHeight = 80;
const chests = [
    { x: 150, y: 630, collected: false, coins: 50 },
    { x: 540, y: 630, collected: false, coins: 100 },
    { x: 940, y: 630, collected: false, coins: 150 },
    { x: 1290, y: 630, collected: false, coins: 300 },
];

// Function to draw the submarine and grabber
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the submarine with vertical offset
    ctx.drawImage(image, subX, subY + verticalOffset, subWidth, subHeight);

    // Draw the grabber
    ctx.fillStyle = "brown";
    ctx.fillRect(subX + subWidth / 2 - grabberWidth / 2, subY + subHeight + verticalOffset, grabberWidth, grabberHeight);

    // Draw the treasure chests
    for (const chest of chests) {
        if (!chest.collected) {
            ctx.drawImage(chest_image, chest.x, chest.y, chestWidth, chestHeight);
        }
    }
}

// Function to check for collisions between the grabber and chests
function checkCollisions() {
    if (grabbing) {
        const grabberX = subX + subWidth / 2 - grabberWidth / 2;
        const grabberY = subY + subHeight + verticalOffset + grabberHeight;

        for (const chest of chests) {
            if (!chest.collected) {
                const chestX = chest.x;
                const chestY = chest.y;

                // Check if the grabber's bounding box intersects with the chest's bounding box
                if (
                    grabberX + grabberWidth > chestX &&
                    grabberX < chestX + chestWidth &&
                    grabberY > chestY &&
                    grabberY < chestY + chestHeight
                ) {
                    // Collision detected, mark the chest as collected
                    chest.collected = true;
                    coins_earned += chest.coins;
                    if (coins_earned === 600) {
                        gameOver();
                    }
                }
            }
        }
    }
}
///////////////// SHARK SHARK
/// SHARK
// Define the shark parameters
const sharkWidth = 130;
const sharkHeight = 60;
let sharkX = canvas.width / 2 - sharkWidth / 2;
let sharkY = canvas.height / 2 - sharkHeight / 2;
let sharkSpeed = 8;
let sharkDirection = 1; // 1 for moving right, -1 for moving left

// Function to draw the shark
function drawShark() {
    ctx.drawImage(shark, sharkX, sharkY, sharkWidth, sharkHeight);
}

// Function to update shark's position
function updateShark() {
    sharkX += sharkSpeed * sharkDirection;
    // Check if the shark has hit the canvas boundaries
    if (sharkX < 0) {
        sharkX = 0;
        sharkDirection = 1; // Change direction to right
    } else if (sharkX + sharkWidth > canvas.width) {
        sharkX = canvas.width - sharkWidth;
        sharkDirection = -1; // Change direction to left
    }
}

// Function to check for collisions with the shark
function checkSharkCollision() {
    const sharkLeft = sharkX;
    const sharkRight = sharkX + sharkWidth;
    const sharkTop = sharkY;
    const sharkBottom = sharkY + sharkHeight;

    const subLeft = subX;
    const subRight = subX + subWidth;
    const subTop = subY + verticalOffset;
    const subBottom = subY + subHeight + verticalOffset;

    if (
        sharkLeft < subRight &&
        sharkRight > subLeft &&
        sharkTop < subBottom &&
        sharkBottom > subTop
    ) {
        // Collision detected, end the game
        gameOver();
        return true;
    }
    return false;
}

//.......................................................................//
// Function to handle game over
function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "90px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    cancelAnimationFrame(animationID_animate);
    cancelAnimationFrame(animationID_gameloop);
    coins_won.innerHTML = coins_earned;
    popupContainer.style.display = "block";
}

claimRewardButton.addEventListener("click", async () => {
    popupContainer.style.display = "none";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract_instance = OceanExplorerContract(signer);
    await contract_instance.claimReward(walletAddress, coins_earned);

    window.location.href = "start_game.html";
});
//.......................................................................//
// Update the game in a loop
function gameLoop() {
    animationID_gameloop = requestAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShark();
    updateShark();
    draw();
    checkSharkCollision();
}


// Function to handle key presses
function handleKeydown(event) {
    keyState[event.key] = true;

    // Call draw() when 'x' is pressed
    if (event.key === "x" || event.key === " ") {
        if (!grabbing && grabberHeight === 0) {
            grabbing = true;
        } else if (grabbing && grabberHeight >= maxGrabHeight) {
            grabbing = false;
        }
        draw(); // Redraw the submarine, grabber, and chests
    }
}

// Function to handle key releases
function handleKeyup(event) {
    keyState[event.key] = false;
}

// Add event listeners for key presses and releases
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// Update the submarine's position based on key presses
function updatePosition() {
    const speed = 8; // Set the speed of submarine movement
    const verticalSpeed = 1; // Set the vertical movement speed

    if (keyState["ArrowLeft"] || keyState["a"]) {
        if (subX - speed >= 0) {
            // Move submarine left and add a slight tilt forward effect
            subX -= speed;
            verticalOffset = maxVerticalOffset;
        }
    }
    if (keyState["ArrowRight"] || keyState["d"]) {
        if (subX + subWidth + speed <= canvas.width) {
            // Move submarine right and add a slight tilt backward effect
            subX += speed;
            verticalOffset = -maxVerticalOffset;
        }
    }
    if (keyState["ArrowUp"] || keyState["w"]) {
        if (subY - speed >= 70) {
            subY -= speed; // Move submarine up
        }
    }
    if (keyState["ArrowDown"] || keyState["s"]) {
        if (subY + subHeight + speed <= canvas.height - 80) {
            subY += speed; // Move submarine down
        }
    }

    // Check for collisions with the treasure chests
    checkCollisions();

    // Draw the submarine, grabber, and chests
    draw();
    drawShark();
    checkSharkCollision();
}

// Update the animation loop
function animate() {
    animationID_animate = requestAnimationFrame(animate);
    console.log("Wallet Address: ", walletAddress);

    if (grabbing) {
        // Extend the grabber
        grabberHeight += grabSpeed;
        if (grabberHeight > maxGrabHeight) {
            grabberHeight = maxGrabHeight;
        }
        setTimeout(() => {
            grabbing = false;
        }, 200);
    }
    else {
        // Retract the grabber
        grabberHeight -= grabSpeed;
        if (grabberHeight < 0) {
            grabberHeight = 0;
        }
    }

    // Reduce the vertical offset gradually to create a smooth effect
    if (verticalOffset > 0) {
        verticalOffset -= 0.1;
        if (verticalOffset < 0) {
            verticalOffset = 0;
        }
    } else if (verticalOffset < 0) {
        verticalOffset += 0.1;
        if (verticalOffset > 0) {
            verticalOffset = 0;
        }
    }

    // Update the submarine's position
    updatePosition();
}
// Start the game loop
gameLoop();

// Start the animation loop
animate();






