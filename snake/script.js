
window.onload = function() {
    
    let canvas;
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 700;
    let apple;
    let snakee;
    let widhtInBlock = canvasWidth / blockSize;
    let heightInBlock = canvasHeight / blockSize;
    let score;
    let timeout;

    function init(){
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px solid gray';
        canvas.style.margin = '50px auto';
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4]],"right"); // cree mon serpent
        apple = new Apple([10,10]);// la pomme
        score = 0;
        refreshCanvas();
        
    }

    function refreshCanvas(){
        snakee.move(); // faire bouger le serpent
        if(snakee.checkCollision()){
            gameOver();
        }else{
            if(snakee.isEatingApple(apple)){
                score++;
                if(delay >= 500){
                    delay-=30;
                }else if(delay >= 300){
                    delay-=20;
                }else if(delay >= 100){
                    delay-=10;
                }else{
                    delay = 80;
                }
                snakee.eatApple = true;
                do{//tant que la nouvelle position est sur le serpent faire une nouvel posistion
                    apple.setNewPosition();
                }while(apple.isOnSnake(snakee))
                
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);//  effacer les coord du canvas
            drawScore();//compte le score et mettre a  jour le score
            snakee.draw(); // le dessiner
            // tout les second x notre rectangle bouge
            apple.draw();// dessiner le serpent a chaque reset de la page
            timeout =  setTimeout(refreshCanvas,delay);// qui permet de dire execute moi une certainne fonction a chaque foois q'un certains delaie est passé

        }
        
    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centreX = canvasWidth /2;
        let centreY = canvasHeight /2;
        ctx.strokeText("Game Over",centreX,centreY- 180);
        ctx.fillText("Game Over",centreX,centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer",centreX,centreY - 120);

        ctx.fillText("Appuyer sur la touche Espace pour rejouer",centreX,centreY - 120);
        ctx.restore();
    }
    function restart(){//reprendre le jeu apres un game over
        snakee = new Snake([[6,4],[5,4],[4,4]],"right"); // cree mon serpent
        apple = new Apple([10,10]);// la pomme
        score = 0;
        clearTimeout(timeout); 
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        let centreX = canvasWidth /2;
        let centreY = canvasHeight /2;
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(),centreX,centreY);
        ctx.restore();
    }

    function drawBlock(ctx,position){
        let x = position[0] * blockSize;// la taille de chaque block * par le notre de pixel
        let y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }


    function Apple(position){
        this.position = position;
    
        this.draw = function(){
            ctx.save();// nous souvenir des encien parametre dans le canvas
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);// fonction qui dessine le cercle
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){// changer la position de la pomme de maniere aleatoire
            let newX = Math.round(Math.random()*(widhtInBlock - 1));
            let newY = Math.round(Math.random()*(heightInBlock - 1));
            this.position = [newX,newY];

        }
        //verifie si la position de la pomme est le serpent
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            for(let i=0;i < snakeToCheck.body.length;i++){
                if(this.position[0] == snakeToCheck.body[i][0] && this.position[1] == snakeToCheck.body[i][1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }

    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.eatApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i=0;i<this.body.length;i++){
                //console.log(this.body[i]);
                drawBlock(ctx,this.body[i]);// une fonction qui dessinera les blocks
            }
            ctx.restore(); // le remettre comme il etait avant
        };

        this.move = function(){//va faire avancer le serpent
            let nexPosition = this.body[0].slice();//copier le premeir element de body dans nextposition
            switch(this.direction){
                // variation des position de mon block en fonction de la direction
                case "left":
                    nexPosition[0] -= 1;
                    break;
                case "right":
                    nexPosition[0] += 1;
                    // le 6 devien 7
                    break;
                case "down":
                    nexPosition[1] += 1; 
                    break;
                case "up":
                    nexPosition[1] -= 1; 
                    break;
                default:
                    throw("Invalide direction");
                
            }
            
            
            this.body.unshift(nexPosition);//permet de rajouter le nextPosition a la premiere place
            
            if(!this.eatApple)// si le serpent ne mange pas la pomme j'enleve le nernier element sinon je laisse
                this.body.pop();// supprimer le dernier element donc on aura dans body [[7,4],[6,4],[5,4]] 
            else
                this.eatApple = false; // le mettre a false sinon il grandira indefinement
        };

        this.setDirection = function(newDirection)
        {
            let allowedDirection;
            switch(this.direction){
                // variation des position de mon block en fonction de la direction permise
                case "left":
                case "right":
                    allowedDirection = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left","right"];
                    break;
                default:
                    throw("Invalide direction");
                
            }

            // Si la direction est permise alors la direction est egale a la newDirection
            if(allowedDirection.indexOf(newDirection) > - 1){ // si il est dans allowedDi alors sup a -1 sinon -1
                this.direction = newDirection;
            }
        
        }

        this.checkCollision = function()
        {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];// la tete du serpent
            let res = this.body.slice(1);// tout le reste du tableau appartir de l'indice 1
            let snakeX = head[0];
            let snakeY = head[1];
            let minX=0; // la taille min des murs que le serpent ne doit pas passe
            let minY=0;
            let maxX = widhtInBlock - 1;// la taille max des murs que le serpent ne doit pas passe
            let maxY = heightInBlock - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(let i=0;i< res.length;i++){// verifie la collision du serpent
                if(snakeX == res[i][0] && snakeY == res[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;//return boolen

        }
        this.isEatingApple = function(appleEat){
            let head = this.body[0];// la tete du serpent

            if(head[0] === appleEat.position[0] && head[1] === appleEat.position[1]){
                return true;
            }else{
                return false;
            }

        }

    
    }

    document.onkeydown = function  handleKeyDown(e)// l'evenement qui ecoute les touche du clavier
    {
        let key = e.keyCode;// nous donne le code de la touche qui a ete apuiyer
        let newDirection;
        // LA nouvelle direction en fonction des toucher appuyer par l'utilisateur
        
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return ;
            default:
                return ;

        }
        snakee.setDirection(newDirection);
        
    }

    
    init();


}







