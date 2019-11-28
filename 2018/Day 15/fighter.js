class Fighter {
    constructor(faction, x, y, id) {
        this.faction = faction;
        this.x = x;
        this.y = y;
        this.power = 3;
        this.hp = 200;
        this.id = id;
    }

    show() {
        push();
        translate(res * (this.x + 1/2), res * (this.y + 1/2));
        noStroke();
        if(this.faction == 'G') {
            fill(255, 32, 32);
        } else if(this.faction == 'E') {
            fill(16, 208, 255);
        }
        ellipse(0, 0, res * 0.8);
        pop();
    }
}