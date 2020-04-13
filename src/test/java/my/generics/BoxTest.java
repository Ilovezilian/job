package my.generics;

import org.junit.Test;

import java.util.Collections;
import java.util.List;

/**
 * Created by Ilovezilian on 2017/10/14.
 */
public class BoxTest {
    @Test
    public void testStaticMethod() {
        Box.hello("hello");
        Box.hello1();
        Box.hello1("hello1");
    }

    @Test
    public void create() {
        Box<String> stringBox = new Box<>();
        Box rawBox = stringBox;
        rawBox.set(8);  // warning: unchecked invocation to set(T)
        System.out.println(rawBox.toString());
    }

    @Test
    public void testCreate() {
        Box<Integer> bi;
        bi = createBox();
        bi.set(100);
        System.out.println(bi.toString());
    }

    Box createBox() {
        return new Box();
    }

    @Test
    public void boundedType() {
        Box<Integer> integerBox = new Box<Integer>();
        integerBox.set(new Integer(10));
        integerBox.inspect(10);
//        integerBox.inspect("some text"); // error: this is still String!
    }

    @Test
    public void inheritance() {
        Box<Number> box = new Box<>();
        box.set(new Integer(100));
        System.out.println(box);
    }

    @Test
    public void test() {
        List<String> listOne = Collections.emptyList();
        List<String> stringList = Collections.<String>emptyList();
    }

}