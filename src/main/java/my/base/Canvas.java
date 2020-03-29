package my.base;

import java.util.List;

public class Canvas {
    public void draw(Shape s) {
        System.out.println("draw:");
        s.draw(this);
    }

    public void drawAll(List<Shape> shapes) {
        System.out.println("drawAll:");
        for (Shape s : shapes) {
            s.draw(this);
        }
    }

    public void drawAllPlus(List<? extends Shape> shapes) {
        System.out.println("drawAllPlus:");
        for (Shape s : shapes) {
            s.draw(this);
        }
    }
}
