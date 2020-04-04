package my.generics;

import my.base.Canvas;
import my.base.Circle;
import my.base.Rectangle;
import my.base.Shape;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

public class GenericTest {

    @Test
    public void canvasTest() {
        final Circle circle = new Circle(1, 1, 1);
        final Circle circle2 = new Circle(2, 2, 2);
        final List<Circle> circles = Arrays.asList(circle, circle2);
        final Rectangle rectangle = new Rectangle(1, 1, 1, 1);
        final Rectangle rectangle2 = new Rectangle(2, 2, 2, 2);
        final List<Rectangle> rectangles = Arrays.asList(rectangle, rectangle2);
        final List<Shape> list = Arrays.asList(circle, rectangle);
        Canvas canvas = new Canvas();
        canvas.draw(circle);
        canvas.draw(rectangle);
        canvas.drawAll(list);
        //        canvas.drawAll(circles);  // compile error
        //        canvas.drawAll(rectangles);
        canvas.drawAllPlus(list);
        canvas.drawAllPlus(circles);
        canvas.drawAllPlus(rectangles);
    }

    @Test
    public void genericsAndSubType() {
        List<Integer> li = new ArrayList<>();
        //                List<Object> lo = li; // 编译出错，因为Object不是Integer的子类，所以不能这么使用
    }

    @Test
    public void genericsAndWildcard() {
        //        List<?> l = new ArrayList<String>();  ？表示是通配符类型，表示任意类型，也可以理解为有所类的子类
        //        l.add(new Object()); // 这样会有问题，因为Object不能匹配‘？’类或子类。
        //        l.add("a"); // 同理
        List<String> ls = new ArrayList<>();
        ls.add("a");
        ls.add("b");
        print(ls);
    }

    private void print(Collection<?> collection) {
        for (Object object : collection) {  // 这里不能使用通配符‘？’ 是因为‘？’只能用于参数上
            System.out.println("object = " + object);
        }
    }

    @Test
    public void CastsAndInstanceOf() {
        Collection cs = new ArrayList<String>();
        // Illegal.   Illegal generic type for instanceof
        //        if (cs instanceof Collection<String>) {}


        // Unchecked warning,
        Collection<String> cstr = (Collection<String>) cs;
    }

    <T> T badCast(T t, Object o) {
        return (T) o;
    }

    static <T> T badCastStatic(T t, Object o) {
        return (T) o;
    }

    @Test
    public void arraysTest() {
        // Not really allowed.
        //        List<String>[] lsa = new ArrayList<String>[10];
        List<String>[] lsa = new List[10]; //= new ArrayList<String>[10];
        Object o = lsa;
        Object[] oa = (Object[]) o;
        List<Integer> li = new ArrayList<Integer>();
        li.add(new Integer(3));
        // Unsound, but passes run time store check
        oa[1] = li;

        // Run-time error: ClassCastException.
        String s = lsa[1].get(0);
    }

    @Test
    public void arraysTest1() {
        // OK, array of unbounded wildcard type.
        List<?>[] lsa = new List<?>[10];
        Object o = lsa;
        Object[] oa = (Object[]) o;
        List<Integer> li = new ArrayList<Integer>();
        li.add(new Integer(3));
        // Correct.
        oa[1] = li;
        // Run time error, but cast is explicit.
        String s = (String) lsa[1].get(0);
    }

}
