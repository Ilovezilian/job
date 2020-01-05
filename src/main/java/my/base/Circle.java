package my.base;

/**
 * Created by Ilovezilian on 2017/6/22.
 */
public class Circle {
    int x, y;

    public Circle(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void prtCircle() {
        System.out.println("(" + x + "," + y + ")");
    }

    public void prtCircle(int i) {
        System.out.println(i + ": (" + x + "," + y + ")");
    }

    public Circle clone() {
        return new Circle(this.x, this.y);
    }
}
