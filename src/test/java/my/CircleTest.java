package my;

import my.base.Circle;
import org.junit.Test;

/** 此处测试到java方法传递用的都是值传递
 * Created by Ilovezilian on 2017/6/22.
 */
public class CircleTest {
    @Test
    public void circleTest() {
        Circle circle = new Circle(1, 1, 0);
        circle.prtCircle(1);
        moveCircle(circle, 2, 2);
        circle.prtCircle(3);
        String s = new String();
    }

    public void moveCircle(Circle circle, int x, int y) {
        circle.setX(circle.getX() + x);
        circle.setY(circle.getY() + y);

        circle = new Circle(0, 0, 0);
        circle.prtCircle(2);
    }
}