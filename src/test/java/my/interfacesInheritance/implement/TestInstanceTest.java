package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.Relatable;
import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class TestInstanceTest {
    @Test
    public void Test1() {
        Relatable plus1 = new TestInstance();
        Relatable plus = new TestInstance();
        TestInstance instance = (TestInstance) plus;
        int result = instance.isLargeThan(plus1);
        instance.hello();
        System.out.println("result = " + result);
    }

    @Test
    public void Test() {
        Object plus1 = new RectanglePlus();
        Object plus = new RectanglePlus();
        Relatable instance = (Relatable) plus;
        int result = instance.isLargeThan((Relatable) plus1);
        System.out.println("result = " + result);
    }
}