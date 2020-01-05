package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.Relatable;

import java.awt.*;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class RectanglePlus implements Relatable {
    public int width = 0;
    public int height = 0;
    public Point origin;

    // four constructors
    public RectanglePlus() {
        origin = new Point(0, 0);
    }

    public RectanglePlus(Point p) {
        origin = p;
    }

    public RectanglePlus(int witdh, int height) {
        origin = new Point(0, 0);
        this.width = witdh;
        this.height = height;
    }

    public RectanglePlus(Point p, int width, int height) {
        this.origin = p;
        this.width = width;
        this.height = height;
    }

    // a method for moving the rectangle
    public void move(int x, int y) {
        origin.x = x;
        origin.y = y;
    }

    // a method for computing
    public int getArea() {
        return width * height;
    }

    @Override
    public int isLargeThan(Relatable other) {
        RectanglePlus otherRec = (RectanglePlus) other;
        if (otherRec.getArea() < this.getArea()) {
            return 1;
        } else if (otherRec.getArea() > this.getArea()) {
            return -1;
        } else {
            return 0;
        }
    }
}
